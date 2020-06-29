
//Including the required packages and assigning it to Local Variables
const config = require("../config/auth.config");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passwordResetToken = require('../models/resettoken.model');
var bcrypt = require("bcryptjs");
const crypto = require('crypto');
const db = require("../models");
const User = db.user;
const Role = db.role;

//Function to facilitate Sign Up feature 
exports.signup = (req, res) => {
 
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    //picture : user.gravatar(),
    isSeller : req.body.isSeller
  });

//alert(user)
 user.save((err, user) => {
  if (err) {
    res.status(500).send({ message: err });
    return;
  }

  if (req.body.roles) {
    Role.find(
      {
        name: { $in: req.body.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = roles.map(role => role._id);
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
            });
            
           // res.status(200).send({ success: true, accessToken: token });
            
          res.json({
            success: true,
            message: "Successful",
            accessToken: token
          });
        });
      }
    );
  } else {
    Role.findOne({ name: "user" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = [role._id];
      user.save(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        var token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
          });

        res.json({
          success: true,
          message: "Successful",
          accessToken: token
        });

      });
    });
  }
 
});
}


//Function to facilitate login feature
exports.signin = (req, res) => {

  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        console.log(authorities)
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
}

exports.ResetPassword = async (req,res) =>{
  if (!req.body.email) {
    return res
    .status(500)
    .json({ message: 'Email is required' });
    }
    const user = await User.findOne({
    email:req.body.email
    });
    if (!user) {
    return res
    .status(409)
    .json({ message: 'Email does not exist' });
    }
    var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
    resettoken.save(function (err) {
    if (err) { return res.status(500).send({ msg: err.message }); }
    passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
    res.status(200).json({ success:true, message: 'Reset Password successfully.' });
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: 'true',
      port: 465,
      auth: {
        user: 'dattaram.120@gmail.com',
        pass: 'imfperacto_123'
      },
      tls: {
        rejectUnauthorized: false
    }
    });
    var mailOptions = {
    to: user.email,
    from: 'dattaram.120@gmail.com',
    subject: 'Password Reset',
    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    'Your reset code is ' + resettoken.resettoken+ ' Or Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    'http://192.168.1.207:4200/response-reset-password/' + resettoken.resettoken + '\n\n' +
    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({
          success:true,  
          status:true,
          message: 'successfuly sent!'
        })
      }
    })
    })
}

exports.ValidPasswordToken = async (req,res) =>{
  if (!req.body.resettoken) {
    return res
    .status(500)
    .json({ message: 'Token is required' });
    }
    const user = await passwordResetToken.findOne({
    resettoken: req.body.resettoken
    });
    if (!user) {
    return res
    .status(409)
    .json({ message: 'Invalid URL' });
    }
    User.findOneAndUpdate({ _id: user._userId }).then(() => {
    res.status(200).json({ success:true, message: 'Token verified successfully.' });
    }).catch((err) => {
    return res.status(500).send({ msg: err.message });
    });
}

exports.NewPassword = (req,res) =>{
  passwordResetToken.findOne({ resettoken: req.body.resettoken }, function (err, userToken, next) {
    if (!userToken) {
      return res
        .status(409)
        .json({ message: 'Token has expired' });
    }

    User.findOne({
      _id: userToken._userId
    }, function (err, userEmail, next) {
      if (!userEmail) {
        return res
          .status(409)
          .json({ message: 'User does not exist' });
      }
      return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
        if (err) {
          return res
            .status(400)
            .json({ message: 'Error hashing password' });
        }
        userEmail.password = hash;
        userEmail.save(function (err) {
          if (err) {
            return res
              .status(400)
              .json({ message: 'Password can not reset.' });
          } else {
            userToken.remove();
            return res
              .status(201)
              .json({ success:true, message: 'Password reset successfully' });
          }

        });
      });
    });

  })
}

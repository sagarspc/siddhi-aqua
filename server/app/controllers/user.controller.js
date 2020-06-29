
//const config = require('../config/auth.config');
const db = require("../models");
const User = db.user;
const Role = db.role;
// const Role = require('../models/role.model.js');
// const User = require('../models/user.model.js');

//var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// exports.signup = (req, res) => {

// 	const user = new User({
// 		name: req.body.name,
// 		username: req.body.username,
// 		email: req.body.email,
// 		password: bcrypt.hashSync(req.body.password, 8)
// 	});
   
// 	user.save((err, user) => {
// 	 if (err) {
// 	   res.status(500).send({ message: err });
// 	   return;
// 	 }
   
// 	 if (req.body.roles) {
// 	   Role.find(
// 		 {
// 		   name: { $in: req.body.roles }
// 		 },
// 		 (err, roles) => {
// 		   if (err) {
// 			 res.status(500).send({ message: err });
// 			 return;
// 		   }
   
// 		   user.roles = roles.map(role => role._id);
// 		   user.save(err => {
// 			 if (err) {
// 			   res.status(500).send({ message: err });
// 			   return;
// 			 }
   
// 			 res.send({ message: "User was registered successfully!" });
// 		   });
// 		 }
// 	   );
// 	 } else {
// 	   Role.findOne({ name: "user" }, (err, role) => {
// 		 if (err) {
// 		   res.status(500).send({ message: err });
// 		   return;
// 		 }
   
// 		 user.roles = [role._id];
// 		 user.save(err => {
// 		   if (err) {
// 			 res.status(500).send({ message: err });
// 			 return;
// 		   }
   
// 		   res.send({ message: "User was registered successfully!" });
// 		 });
// 	   });
// 	 }

// 	 var token = jwt.sign({ id: user._id }, config.secret, {
// 		expiresIn: 86400 // expires in 24 hours
// 	  });
	  
// 	  res.status(200).send({ auth: true, accessToken: token });
	  
//    });
// }
   
   
//    //Function to facilitate login feature
//    exports.signin = (req, res) => {
   
// 	 User.findOne({
// 	   username: req.body.username
// 	 })
// 	   .populate("roles", "-__v")
// 	   .exec((err, user) => {
// 		 if (err) {
// 		   res.status(500).send({ message: err });
// 		   return;
// 		 }
   
// 		 if (!user) {
// 		   return res.status(404).send({ message: "User Not found." });
// 		 }
   
// 		 var passwordIsValid = bcrypt.compareSync(
// 		   req.body.password,
// 		   user.password
// 		 );
   
// 		 if (!passwordIsValid) {
// 		   return res.status(401).send({
// 			 accessToken: null,
// 			 message: "Invalid Password!"
// 		   });
// 		 }
   
// 		 var token = jwt.sign({ id: user._id }, config.secret, {
// 		   expiresIn: 86400 // 24 hours
// 		 });
   
// 		 var authorities = [];
   
// 		 for (let i = 0; i < user.roles.length; i++) {
// 		   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
// 		   console.log(authorities)
// 		 }
// 		 res.status(200).send({
// 		   id: user._id,
// 		   username: user.username,
// 		   email: user.email,
// 		   roles: authorities,
// 		   accessToken: token
// 		 });
// 	   });
//    }
   

exports.allAccess = (req, res) => {
	User.find({}, (err, users) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'Users not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			users: users
			})
		}
	  })
};


exports.userBoard = (req, res) => {
	console.log('respose',req)
	User.findOne({ _id: req.userId })
	.select('-_id -__v -password')
	.populate('roles', '-_id -__v')
	.exec((err, user) => {
		if (err){
			console.log(user)
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "User not found with _id = " + req.userId
				});                
			}
			return res.status(500).send({
				message: "Error retrieving User with _id = " + req.userId	
			});
		}
					
		res.status(200).json({
			"description": "User Content Page",
			"user": user
		});
	});
}

exports.adminBoard = (req, res) => {
	User.findOne({ _id: req.userId })
	.select('-_id -__v -password')
	.populate('roles', '-_id -__v')
	.exec((err, user) => {
		if (err){
			if(err.kind === 'ObjectId') {
				res.status(404).send({
					message: "User not found with _id = " + req.userId
				});                
				return;
			}

			res.status(500).json({
				"description": "Can not access Admin Board",
				"error": err
			});

			return;
		}
					
		res.status(200).json({
			"description": "Admin Board",
			"user": user
		});
	});
}

exports.moderatorBoard = (req, res) => {
	User.findOne({ _id: req.userId })
	.select('-_id -__v -password')
	.populate('roles', '-_id -__v')
	.exec((err, user) => {
		if (err){
			if(err.kind === 'ObjectId') {
				res.status(404).send({
					message: "User not found with _id = " + req.userId
				});                
				return;
			}

			res.status(500).json({
				"description": "Can not access PM Board",
				"error": err
			});

			return;
		}
					
		res.status(200).json({
			"description": "PM Board",	
			"user": user
		});
	});
}

exports.createRole = (req, res) => {
	const role = new Role({
		name: req.body.name
	});
	role.save()
	res.json({
		success: true,
		message: "Successful"
	  });
}

exports.GetallRoles = (req, res) => {
	Role.find({}, (err, roles) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'Roles not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			roles: roles
			})
		}
	  });
}

exports.createUser = (req, res) => {
	const user = new User({
		username : req.body.username,
		email : req.body.email,
		password : bcrypt.hashSync(req.body.password, 8),
		isSeller : req.body.isSeller
	});
	

	user.roles = [req.body.roleID]
	// Save a User to the MongoDB
	user.save();
	res.json({
	success: true,
	message: "Successful"
	});
	
}

exports.updateUserById = (req,res) =>{
	const id = req.params.id
	User.findByIdAndUpdate(id, req.body, function (err, user) {
	if (err) {
		return next(err);
	  } else {
		user.username = req.body.username;
		user.email = req.body.email;
		//user.isSeller : req.body.isSeller
		user.password = bcrypt.hashSync(req.body.password, 8),
		user.save(function (err, user) {
		  if (err) {
			res.send("Error: ", err);
		  } else {
			res.json({ success:true, message: "user was updated successfully.",order: user});
		  }
		})
	  }
	});
}

exports.createProfile = (req, res) => {
	User.findOne({ _id: req.decoded.id }, (err, user) => {
		if (err) return next(err);
  
		if (req.body.username) user.username = req.body.username;
		if (req.body.email) user.email = req.body.email;
		if (req.body.password) user.password = req.body.password;
		user.isSeller = req.body.isSeller;
		console.log(user)
		user.save();
		res.json({
		  success: true,
		  message: 'Successfully edited your profile'
		});
	  });
}



exports.Getprofile = (req, res) => {
	User.findOne({ _id: req.decoded.id }, (err, user) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'User not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			user: user
			})
		}
	  });
}

exports.Getaddress = (req, res) => {
	User.findOne({ _id: req.decoded.id }, (err, user) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'Roles not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			address: user.address
			})
		}
	  });
}

exports.createAddress = (req, res) => {
	User.findOne({ _id: req.decoded.id }, (err, user) => {
		if (err) return next(err);
		if (req.body.addr1) user.address.addr1 = req.body.addr1;
		if (req.body.addr2) user.address.addr2 = req.body.addr2;
		if (req.body.city) user.address.city = req.body.city;
		if (req.body.state) user.address.state = req.body.state;
		if (req.body.country) user.address.country = req.body.country;
		if (req.body.postalCode) user.address.postalCode = req.body.postalCode;
	   console.log(user)
		user.save();
		res.json({
		  success: true,
		  message: 'Successfully edited your address'
		});
	  });
}



exports.getUserById = (req,res) => {
	User.findById({ _id: req.params.id })
	.populate('roles')
	.exec((err, user) => {
	  if (err) {
		res.json({
		  success: false,
		  message: 'User is not found'
		});
	  } else {
		if (user) {
			console.log(user)
		  res.json({
			success: true,
			user: user
		  });
		}
	  }
	});
}

exports.deleteUserById = (req,res) =>{
	const id = req.params.id;
    User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete with id=${id}.May be was not found!`
          });
        } else {
          res.json({
            success:true,
            message: "deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete with id=" + id
        });
      });
}
exports.GetRoleById = (req,res) =>{
	Role.findOne({ _id: req.params.id }, (err, role) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'role not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			role: role
			})
		}
	  });
}

exports.updateRoleById = (req,res) =>{
	const id = req.params.id
	Role.findByIdAndUpdate(id, req.body, function (err, role) {
	if (err) {
		console.log(err);
	  } else {
		role.name = req.body.name;
		role.save(function (err, role) {
		  if (err) {
			res.send("Error: ", err);
		  } else {
			res.json({ success:true, message: "role was updated successfully.",role: role});
		  }
		})
	  }
	});
}

exports.deleteRoleById = (req, res) => {
    const id = req.params.id;
    Role.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete with id=${id}.May be was not found!`
          });
        } else {
          res.json({
            success:true,
            message: "deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete with id=" + id
        });
      });
  };

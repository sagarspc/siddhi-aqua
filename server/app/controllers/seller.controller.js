

const Product = require('../models/product.model');
const Order = require('../models/order.model');
const VerifyPayment = require('../models/verifiedOrder.model');
const Razorpay = require('razorpay')
//const async = require('async');
const crypto = require("crypto");

let rzp = new Razorpay({
	key_id: 'rzp_test_GWT3anbuTzocbm', // your `KEY_ID`
	key_secret: 'CV64TbW8dkLihXgbpkolRD5f' // your `KEY_SECRET`
  })

  
  
 
  
  

  exports.getAllProducts = (req, res) => {
    Product.find({}, (err, product) => {
      if (err) {
        res.json({
          success: false,
          message: 'Product not found'
        });
        }
        else{
        res.json({
        success: true,
        message: "Success",
        product: product
        })
      }
      });
  }

  exports.getSellerProductsById = (req, res) => {
	Product.find({ owner: req.decoded.id })
	.populate('owner')
  .populate('category')
  .populate('brand')
	.exec((err, products) => {
	  if (products) {
		res.json({
		  success: true,
		  message: "Products",
		  products: products
		});
	  }
	});
}

exports.createSellerProducts = (req, res) => {
    let product = new Product();
    product.owner = req.decoded.id;
    product.category = req.body.categoryId;
    product.brand = req.body.brandId;
    product.stock = req.body.stock;
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.imageUrl = req.body.imageUrl;
    //product.image = req.file.location;
    product.save();
    res.json({
      success: true,
      message: 'Successfully Added the product'
    });
}

exports.updateSellerProductsById = (req, res) => {
  let product = new Product();
  product.owner = req.decoded.id;
  product.category = req.body.categoryId;
  product.brand = req.body.brandId;
  product.stock = req.body.stock;
  product.title = req.body.title;
  product.price = req.body.price;
  product.description = req.body.description;
  product.imageUrl = req.body.imageUrl;
  product.updated = Date.now;
  const id = req.params.id;
  
  Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot update product with id=${id}. Maybe Product was not found!`
      });
    } else res.json({ success:true, message: "product was updated successfully." });
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Product with id=" + id
    });
  });
}

exports.deleteProductsById = (req, res) => {
    const id = req.params.id;
  
    Product.findByIdAndRemove(id)
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

  exports.deleteOrderById = (req, res) => {
    const id = req.params.id;
  
    Order.findByIdAndRemove(id)
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

exports.getAllOrders = (req, res) => {
  Order.find({}, (err, orders) => {
    if (err) {
      res.json({
        success: false,
        message: 'Orders not found'
      });
      }
      else{
      res.json({
      success: true,
      message: "Success",
      orders: orders
      })
    }
    });
}

exports.getOrders = (req, res) => {
	Order.find({ owner: req.decoded.id })
	.populate('owner')
	.populate('category')
	.exec((err, orders) => {
	  if (orders) {
		res.json({
		  success: true,
		  message: "Orders",
		  orders: orders
		});
	  }
	});
}

exports.createOrders = (req, res) => {
	const products = req.body.products;
    let order = new Order();
    order.owner = req.decoded.id;
    order.totalPrice = req.body.totalPrice;
    order.status = req.body.status;
    order.createdBy = req.body.createdBy;
    
    products.map(product => {
      order.products.push({
        product: product.product,
        quantity: product.quantity
      });
    });

    order.save();
    res.json({
      success: true,
      _id:order._id,
      message: 'Successfully Added the product'
    });
}


exports.updateOrders = (req, res) => {
  const products = req.body.products
  let order = new Order()
  order.status = req.body.status
  order.totalPrice = req.body.totalPrice
  products.map(product => {
    order.products.push({
      product: product.product,
      quantity: product.quantity
    });
  });
  const id = req.params.id;
  Order.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.json({ success:true, message: "Tutorial was updated successfully.",order: data});
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
}

exports.CreatePayment = (req,res) => {
  const payment_capture = req.body.payment_capture
  const amount = req.body.amount
  const currency = req.body.currency

  const options = {
    amount: amount * 100,  // amount in the smallest currency unit
    currency,
    payment_capture
    };

    rzp.orders.create(options, function(err, order) {
      console.log(order);
      res.send({
        success:true,
        payload:order
      })
    });

}

exports.VerifyPayment = (req,res) =>{
  let verifyPayment = new VerifyPayment()
  verifyPayment.owner = req.decoded.id;
  verifyPayment.order = req.body.orderID;
  verifyPayment.razorpay_order_id = req.body.razorpay_order_id
  verifyPayment.razorpay_payment_id = req.body.razorpay_payment_id
  verifyPayment.razorpay_signature = req.body.razorpay_signature

  const secret = 'CV64TbW8dkLihXgbpkolRD5f'

  const generated_signature = crypto.createHmac('sha256', secret)
                   .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
                   .digest('hex');
//console.log(generated_signature);
//var generated_signature = crypto.createHmac(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id, secret);
  
verifyPayment.save(function(err){
    if(err){
      console.log(err)
    }
    else{
      if (generated_signature == req.body.razorpay_signature) {
        res.json({
          success:true,
          message:"payment verified successfully"
        });
      }
    }
  });
}

exports.refundPayment = (req,res) =>{
  const amount = req.body.amount
  const speed = req.body.speed
  const options = {
      amount,
      speed
    };
  //rzp.payments.refund()
  const paymentId = req.params.id;
  rzp.payments.refund(paymentId).then(options,(data) => {
    res.json({
      success:true,
      refund:data,
      message:'success refund'
    })
  }).catch((error) => {
    // error
    console.log(error)
  })
}

exports.getVerifyPayment = (req,res) => {
  VerifyPayment.find({ owner: req.decoded.id }).
  populate('owner').
  populate('order')
	.exec((err, payment) => {
    if(err){
      console.log(err)
    }
	  else{
      res.json({
        success: true,
        message: "fetched payment by ID",
        payment: payment
      });
	  }
	}); 
}
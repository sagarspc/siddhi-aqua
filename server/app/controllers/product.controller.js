
const Category = require('../models/category.model');
const Brand = require('../models/brand.model');
const Product = require('../models//product.model');
const Order = require('../models/order.model');
const async = require('async');
const Review = require('../models/review.model');

var ObjectID = require('mongodb').ObjectID;


exports.getCategories = (req, res) => {
	Category.find({}, (err, categories) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'Categories not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			categories: categories
			})
		}
	  });
}

exports.createCategory = (req, res) => {
	const category = new Category({
		name: req.body.name
	});
	category.save()
	res.json({
		success: true,
		message: "Successful"
	  });
}

exports.getBrands = (req, res) => {
	Brand.find({}, (err, brands) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'Categories not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			brands: brands
			})
		}
	  });
}

exports.createBrand = (req, res) => {
	const brand = new Brand({
		name: req.body.name
	});
	brand.save()
	res.json({
		success: true,
		message: "Successful"
	  });
}

exports.getProducts = (req, res) => {
	const perPage = 10;
	const page = req.query.page;
	async.parallel([
	  function(callback) {
		Product.count({}, (err, count) => {
		  var totalProducts = count;
		  callback(err, totalProducts);
		});
	  },
	  function(callback) {
		Product.find({})
		  .skip(perPage * page)
		  .limit(perPage)
		  .populate('category')
		  .populate('brand')
		  .populate('owner')
		  .populate('reviews')
		  .exec((err, products) => {
			if(err) return next(err);
			callback(err, products);
		  });
	  }
	], function(err, results) {
	  var totalProducts = results[0];
	  var products = results[1];
	 
	  res.json({
		success: true,
		message: 'category',
		products: products,
		totalProducts: totalProducts,
		pages: Math.ceil(totalProducts / perPage)
	  });
	});
}

exports.getCategoriesById = (req, res) => {
	const perPage = 10;
    const page = req.query.page;
    async.parallel([
      function(callback) {
        Product.count({ category: req.params.id }, (err, count) => {
          var totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function(callback) {
        Product.find({ category: req.params.id })
          .skip(perPage * page)
          .limit(perPage)
          .populate('category')
          .populate('owner')
          .populate('reviews')
          .exec((err, products) => {
            if(err) return next(err);
            callback(err, products);
          });
      },
      function(callback) {
        Category.findOne({ _id: req.params.id }, (err, category) => {
         callback(err, category)
        });
      }
    ], function(err, results) {
      var totalProducts = results[0];
      var products = results[1];
      var category = results[2];
      res.json({
        success: true,
        message: 'category',
        products: products,
        categoryName: category.name,
        totalProducts: totalProducts,
        pages: Math.ceil(totalProducts / perPage)
      });
    });
}

exports.getProductById = (req, res) => {
	Product.findById({ _id: req.params.id })
	.populate('category')
	.populate('brand')
	.populate('owner')
	.deepPopulate('reviews.owner')
	.exec((err, product) => {
	  if (err) {
		res.json({
		  success: false,
		  message: 'Product is not found'
		});
	  } else {
		if (product) {
			console.log(product)
		  res.json({
			success: true,
			product: product
		  });
		}
	  }
	});
}

exports.getOrderById = (req, res) => {
	Order.findOne({ _id: req.params.id })
	.deepPopulate('products.product.owner')
	.populate('owner')
	.exec((err, order) => {
	  if (err) {
		res.json({
		  success: false,
		  message: "Couldn't find your order"
		});
	  } else {
		res.json({
		  success: true,
		  message: 'Found your order',
		  order: order
		});
	  }
	});
}



exports.createReview = (req, res) => {
	async.waterfall([
		function(callback) {
		  Product.findOne({ _id: req.body.productId}, (err, product) => {
			if (product) {
			  callback(err, product);
			}
		  });
		},
		function(product) {
		  let review = new Review();
		  review.owner = req.decoded.id;
  
		  if (req.body.title) review.title = req.body.title;
		  if (req.body.description) review.description = req.body.description
		  review.rating = req.body.rating;
  
		  product.reviews.push(review._id);
		  product.save();
		  review.save();
		  res.json({
			success: true,
			message: "Successfully added the review"
		  });
		}
	  ]);
}

exports.getAccOrders = (req, res) => {
	Order.find({ owner: req.decoded.id })
	.populate('products.product')
	.populate('owner')
	.exec((err, orders) => {
	  if (err) {
		res.json({
		  success: false,
		  message: "Couldn't find your order"
		});
	  } else {
		res.json({
		  success: true,
		  message: 'Found your order',
		  orders: orders
		});
	  }
	});
}

exports.getBrandsById = (req,res) => {
	Brand.findOne({ _id: req.params.id }, (err, brand) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'brand not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			brand: brand
			})
		}
	  });
}
exports.updateBrandsById = (req,res) =>{
	const id = req.params.id
	Brand.findByIdAndUpdate(id, req.body, function (err, brand) {
	if (err) {
		console.log(err);
	  } else {
		brand.name = req.body.name;
		brand.save(function (err, brand) {
		  if (err) {
			res.send("Error: ", err);
		  } else {
			res.json({ success:true, message: "brand was updated successfully.",brand: brand});
		  }
		})
	  }
	});
}

exports.deleteBrandById = (req, res) => {
    const id = req.params.id;
    Brand.findByIdAndRemove(id)
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


  exports.CategoriesById = (req,res) => {
	Category.findOne({ _id: req.params.id }, (err, category) => {
		if (err) {
			res.json({
			  success: false,
			  message: 'brand not found'
			});
		  }
		  else{
			res.json({
			success: true,
			message: "Success",
			category: category
			})
		}
	  });
}

exports.updateCategoriesById = (req,res) =>{
	const id = req.params.id
	Category.findByIdAndUpdate(id, req.body, function (err, category) {
	if (err) {
		console.log(err);
	  } else {
		category.name = req.body.name;
		category.save(function (err, category) {
		  if (err) {
			res.send("Error: ", err);
		  } else {
			res.json({ success:true, message: "category was updated successfully.",category: category});
		  }
		})
	  }
	});
}

exports.deleteCategoryById = (req, res) => {
    const id = req.params.id;
    Category.findByIdAndRemove(id)
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

const { authJwt } = require("../middlewares");
const controller = require("../controllers/product.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  // api for categories
  app.get("/api/categories", controller.getCategories);
  app.get("/api/categoriesbyID/:id", controller.CategoriesById);
  app.put("/api/categories/:id", controller.updateCategoriesById);
  app.post("/api/categories", [authJwt.verifyToken], controller.createCategory);
  app.delete("/api/categories/:id", [authJwt.verifyToken], controller.deleteCategoryById);
    // api for brands
    app.get("/api/brands", controller.getBrands);
    app.get("/api/brands/:id", controller.getBrandsById);
    app.put("/api/brands/:id", controller.updateBrandsById);
    app.post("/api/brands", [authJwt.verifyToken], controller.createBrand);
    app.delete("/api/brand/:id", [authJwt.verifyToken], controller.deleteBrandById);
  //api to facilitate get request of specific categories
  app.get("/api/categories/:id", [authJwt.verifyToken], controller.getCategoriesById);

  // api for products
  app.get("/api/products", controller.getProducts);

  //api to facilitate get request of specific product
  app.get("/api/product/:id", controller.getProductById);

  //Function to handle Orders functionality for authenticated users
  app.get("/api/accounts/orders", [authJwt.verifyToken], controller.getAccOrders);

  //Function to facilitate get request of specific order 
  app.get("/api/accounts/orders/:id", [authJwt.verifyToken], controller.getOrderById);

  //Function to facilitate review functionality 
  app.post("/api/review", [authJwt.verifyToken], controller.createReview);

};

const { authJwt } = require("../middlewares");
const controller = require("../controllers/seller.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  // api for seller products
  app.get("/api/seller/products", [authJwt.verifyToken], controller.getAllProducts);
  app.get("/api/seller/products", [authJwt.verifyToken], controller.getSellerProductsById);
  app.post("/api/seller/products", [authJwt.verifyToken], controller.createSellerProducts);
  app.put("/api/seller/products/:id", [authJwt.verifyToken], controller.updateSellerProductsById);
  app.delete("/api/seller/products/:id", [authJwt.verifyToken], controller.deleteProductsById);
  
  // api for orders
  app.get("/api/orders", [authJwt.verifyToken], controller.getOrders);
  app.post("/api/seller/orders", [authJwt.verifyToken], controller.createOrders);
  app.put("/api/seller/orders/:id", [authJwt.verifyToken], controller.updateOrders);
  app.delete("/api/order/:id", [authJwt.verifyToken], controller.deleteOrderById);

  app.get("/api/seller/orders", [authJwt.verifyToken], controller.getAllOrders);
  app.post("/api/payment", [authJwt.verifyToken], controller.CreatePayment);
  app.post("/api/verifyPayement", [authJwt.verifyToken], controller.VerifyPayment);
  app.get("/api/verifyPayement", [authJwt.verifyToken], controller.getVerifyPayment);
 // app.get("/api/seller/payment", [authJwt.verifyToken], controller.CreatePayment);
 app.post("/api/payments/:id/refund",[authJwt.verifyToken],controller.refundPayment)
};

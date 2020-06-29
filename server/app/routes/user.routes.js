const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  // Create a new Role
  app.post('/api/role',[authJwt.verifyToken], controller.createRole);
  app.get("/api/role", [authJwt.verifyToken],controller.GetallRoles);
  app.get("/api/role/:id", [authJwt.verifyToken],controller.GetRoleById);
  app.put("/api/role/:id", [authJwt.verifyToken],controller.updateRoleById);
  app.delete("/api/role/:id", [authJwt.verifyToken],controller.deleteRoleById);
  // Create a new Role
  app.post('/api/test/user',[authJwt.verifyToken], controller.createUser);
  app.get('/api/test/user/:id',[authJwt.verifyToken], controller.getUserById);
  app.put('/api/test/user/:id',[authJwt.verifyToken], controller.updateUserById);
  app.delete('/api/test/user/:id',[authJwt.verifyToken], controller.deleteUserById);
  
  app.get("/api/test/profile", [authJwt.verifyToken], controller.Getprofile);
  app.post("/api/test/profile", [authJwt.verifyToken], controller.createProfile);
 
  // app.post("/api/address", [authJwt.verifyToken], controller.createAddress);
  app.get("/api/test/address", [authJwt.verifyToken], controller.Getaddress);
  app.post("/api/test/address", [authJwt.verifyToken], controller.createAddress);
};

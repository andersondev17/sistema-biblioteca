const { Router } = require("express");
const { checkAdmin } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

const userRouter = Router();

// Solo Admin gestiona usuarios
userRouter.post("/", checkAdmin, userController.createUser);
userRouter.get("/", checkAdmin, userController.getAllUsers); // Solo Admin ve todos
userRouter.get("/:id", checkAdmin, userController.getUserById);
userRouter.put("/:id", checkAdmin, userController.updateUser);
userRouter.delete("/:id", checkAdmin, userController.deleteUser);

module.exports = userRouter;
const { Router } = require("express");
const { checkAdmin } = require("../middlewares/auth.middleware");
const authorController = require("../controllers/author.controller");

const authorRouter = Router();

// Solo Admin puede crear, actualizar o eliminar
authorRouter.post("/", checkAdmin, authorController.createAuthor);
authorRouter.get("/", authorController.getAllAuthors); // Acceso público
authorRouter.get("/:cedula", authorController.getAuthorByCedula); // Acceso público
authorRouter.put("/:cedula", checkAdmin, authorController.updateAuthor);
authorRouter.delete("/:cedula", checkAdmin, authorController.deleteAuthor);

module.exports = authorRouter;
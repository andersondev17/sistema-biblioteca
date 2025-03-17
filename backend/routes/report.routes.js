const { Router } = require("express");
const { checkEmployee } = require("../middlewares/auth.middleware");
const reportController = require("../controllers/report.controller");

const reportRouter = Router();

// Solo empleados acceden a reportes
reportRouter.get("/authors/:cedula", checkEmployee, reportController.getAuthorReport);

module.exports = reportRouter;
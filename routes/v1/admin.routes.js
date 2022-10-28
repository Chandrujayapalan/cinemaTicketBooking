const express = require('express')
const adminRouter = express.Router()
const controller = require('../../controller/admin.controller')
const validator = require('../../middleware/validator')
const auth = require('../../middleware/auth')

adminRouter.post("/register", validator.regValidator, controller.register)
adminRouter.post("/login", validator.logvalidator, controller.login)

adminRouter.post("/theater", validator.theaterValidator, [auth.authenticating, auth.admin], controller.createTheater)
adminRouter.get("/theater",[auth.authenticating, auth.admin], controller.getAllTheater)
adminRouter.put("/theater/:id", validator.theaterValidator, [auth.authenticating, auth.admin],  controller.updateTheater)
adminRouter.delete("/theater/:id", [auth.authenticating, auth.admin], controller.updateTheater)








module.exports = adminRouter

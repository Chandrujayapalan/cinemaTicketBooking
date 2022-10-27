const express = require('express')
const adminRouter = express.Router()
const controller = require('../../controller/controller')
const validator = require('../../middleware/validator')
const auth = require('../../middleware/auth')

adminRouter.post("/register", validator.regValidator, controller.register)
adminRouter.post("/login", validator.logvalidator, controller.login)



module.exports = adminRouter

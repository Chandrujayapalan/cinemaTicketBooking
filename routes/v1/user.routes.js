const express = require('express')
const userRouter = express.Router()
const controller = require('../../controller/booking.controller')
const signController = require('../../controller/controller')

const validator = require('../../middleware/validator')
const auth = require('../../middleware/auth')

userRouter.post("/register", validator.regValidator, signController.register)
userRouter.post("/login", validator.logvalidator, signController.login)


userRouter.get("/movie", [auth.authenticating, auth.user], controller.getMovie)
userRouter.get("/show", [auth.authenticating, auth.user], controller.getShow)

userRouter.post("/seat/:screenId/:showTimeId", [auth.authenticating, auth.user], controller.createSeat)
userRouter.get("/seat/:screenId/:showTimeId", [auth.authenticating, auth.user], controller.getSeat)
userRouter.post("/book/:screenId/:showTimeId", [auth.authenticating, auth.user], controller.createBooking)








module.exports = userRouter
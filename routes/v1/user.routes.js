const express = require('express')
const userRouter = express.Router()
const controller = require('../../controller/user.controller')
// const signController = require('../../controller/user.controller copy')

const validator = require('../../middleware/validator')
const auth = require('../../middleware/auth')

userRouter.post("/register", validator.regValidator, controller.register)
userRouter.post("/login", validator.logvalidator, controller.login)


userRouter.get("/movie", [auth.authenticating, auth.user], controller.getMovie)
userRouter.get("/show", [auth.authenticating, auth.user], controller.getShow)

userRouter.get("/seat/:showTimeId", [auth.authenticating, auth.user], controller.getSeat)

userRouter.post("/booking", [auth.authenticating, auth.user], controller.createBooking)
userRouter.get("/booking", [auth.authenticating, auth.user], controller.getBooking)
userRouter.get("/bookings", [auth.authenticating, auth.user], controller.getAllBooking)












module.exports = userRouter
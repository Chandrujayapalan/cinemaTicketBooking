const express = require('express')
const userRouter = express.Router()
const controller = require('../../controller/user.controller')
// const signController = require('../../controller/admin.controller')

const validator = require('../../middleware/validator')
const auth = require('../../middleware/auth')

userRouter.post("/register", validator.regValidator, controller.register)
userRouter.post("/login", validator.logvalidator, controller.login)


userRouter.get("/movie", [auth.authenticating, auth.user], controller.getMovie)
userRouter.get("/show", [auth.authenticating, auth.user], controller.getShow)

userRouter.post("/seat", validator.seatValidator, [auth.authenticating, auth.user], controller.createSeat)
userRouter.get("/seat/:screenId/:showTimeId", [auth.authenticating, auth.user], controller.getSeat)

userRouter.post("/book", validator.bookValidator, [auth.authenticating, auth.user], controller.createBooking)








module.exports = userRouter
const express = require('express')
const subAdminRouter = express.Router()
const controller = require('../../controller/screen.controller')
const signController = require('../../controller/controller')

const validator = require('../../middleware/validator')
const auth = require('../../middleware/auth')

subAdminRouter.post("/register", validator.regValidator, signController.register)
subAdminRouter.post("/login", validator.logvalidator, signController.login)


subAdminRouter.post("/screen", [auth.authenticating, auth.subAdmin], controller.createScreen)
subAdminRouter.get("/screen/:theaterId", [auth.authenticating, auth.subAdmin], controller.getScreen)

subAdminRouter.get("/movie", [auth.authenticating, auth.subAdmin], controller.getMovie)


subAdminRouter.post("/show", [auth.authenticating, auth.subAdmin], controller.createShowTiming)






// router.post("/movie", [auth.authenticating, auth.admin  ], controller.createMovie)
// router.get("/movie", controller.getMovie)

// router.post("/showTime", [auth.authenticating, auth.admin],controller.createShowTiming)
// router.post("/screen", [auth.authenticating, auth.admin], controller.createScreen)
// router.post("/seat", [auth.authenticating, auth.admin], controller.createSeat)
// router.post("/reserver", [auth.authenticating, auth.admin], controller.createReserver)
// router.post("/theater", [auth.authenticating, auth.supAdmin], controller.createTheater)
// router.get("/getTheater", [auth.authenticating, auth.supAdmin], controller.getAllTheater)

// router.get("/theater", controller.getTheaterInArea)

// router.put("/reser/:id", [auth.authenticating, auth.supAdmin], controller.updateReserver)

// router.get("/screen", [auth.authenticating, auth.supAdmin], controller.getScreen)















module.exports = subAdminRouter

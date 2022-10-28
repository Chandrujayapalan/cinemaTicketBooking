const express = require('express')
const subAdminRouter = express.Router()
const controller = require('../../controller/subAdmin.controller')

const validator = require('../../middleware/validator')
const auth = require('../../middleware/auth')

subAdminRouter.post("/register", validator.regValidator, controller.register)
subAdminRouter.post("/login", validator.logvalidator, controller.login)

subAdminRouter.post("/movie", validator.movieValidator, [auth.authenticating, auth.subAdmin], controller.createMovie)
subAdminRouter.get("/movie", [auth.authenticating, auth.subAdmin], controller.getMovie)
subAdminRouter.put("/movie/:id", [auth.authenticating, auth.subAdmin], controller.updateMovie)


subAdminRouter.get("/theater", [auth.authenticating, auth.subAdmin], controller.getAllTheater)

subAdminRouter.post("/screen", validator.screenValidator ,[auth.authenticating, auth.subAdmin], controller.createScreen)
subAdminRouter.get("/screen/:theaterId", [auth.authenticating, auth.subAdmin], controller.getScreen)
subAdminRouter.put("/screen/:id", [auth.authenticating, auth.subAdmin], controller.updateScreen)


subAdminRouter.post("/show", validator.showValidator ,[auth.authenticating, auth.subAdmin], controller.createShowTiming)
subAdminRouter.get("/show", [auth.authenticating, auth.subAdmin], controller.getShow)
subAdminRouter.put("/show/:id", [auth.authenticating, auth.subAdmin], controller.updateShow)








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

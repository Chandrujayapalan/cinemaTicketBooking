const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')
const validator = require('../middleware/validator')
const auth = require('../middleware/auth')

router.post("/register",validator.regValidator, controller.register)
router.post("/login", validator.logvalidator,controller.login)
router.post("/movie", [auth.authenticating, auth.admin  ], controller.createMovie)
router.post("/showTime", [auth.authenticating, auth.admin],controller.createShowTiming)
router.post("/screen", [auth.authenticating, auth.admin], controller.createScreen)
router.post("/seat", [auth.authenticating, auth.admin], controller.createSeat)
router.post("/reserver", [auth.authenticating, auth.admin], controller.createReserver)
router.post("/theater", [auth.authenticating, auth.supAdmin], controller.createTheater)
router.get("/getTheater", [auth.authenticating, auth.supAdmin], controller.getAllTheater)
router.get("/theater", [auth.authenticating, auth.user], controller.getTheaterInArea)
router.put("/reser/:id", [auth.authenticating, auth.supAdmin], controller.updateReserver)
router.get("/scree", [auth.authenticating, auth.supAdmin], controller.getScreen)














module.exports = router
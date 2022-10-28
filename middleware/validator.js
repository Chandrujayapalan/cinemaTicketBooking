const joi = require('joi')


const regValidator = async (req, res, next) => {
    try {
        let option = joi.object().keys({
            name: joi.string().required(),
            email: joi.string().email().required(),
            phone: joi.number().required(),
            password: joi.string().required(),
        })
        const { error } = option.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

const logvalidator = async (req, res, next) => {
    try {
        let option = joi.object().keys({
            username: joi.string().required(),
            password: joi.string().required(),
        })
        const { error } = option.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
const theaterValidator = async (req, res, next) => {
    try {
        let option = joi.object().keys({
            theaterName: joi.string().required(),
            status: joi.boolean().required(),

        })
        const { error } = option.validate(req.body)
        // console.log(option)
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
const movieValidator = async (req, res, next) => {
    try {
        let option = joi.object().keys({
            movieName: joi.string().required(),
            duration: joi.number().required(),
            releaseDate: joi.date().required(),
        })
        const { error } = option.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
const showValidator = async (req, res, next) => {
    try {
        let option = joi.object().keys({
            screenId: joi.string().required(),
            movieId: joi.string().required(),
            showTiming: joi.string().required(),
            showDate: joi.date().required(),
            endDate: joi.date().required(),
        })
        const { error } = option.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
const screenValidator = async (req, res, next) => {
    try {
        let option = joi.object().keys({
            screenName: joi.string().required(),
            theaterId: joi.string().required(),
            seats: joi.number().required(),
            ticketPrice: joi.number().required(),
        })
        const { error } = option.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

const seatValidator = async (req, res, next) => {
    try {
        let option = joi.object().keys({
            screenId: joi.string().required(),
            showTimeId: joi.string().required(),
            seatNo: joi.number().required(),
        })
        const { error } = option.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

const bookValidator = async (req, res, next) => {
    try {
        let option = joi.object().keys({
            screenId: joi.string().required(),
            showTimeId: joi.string().required(),
            // seatNo: joi.number().required(),
        })
        const { error } = option.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    regValidator, 
    logvalidator,
     theaterValidator,
      movieValidator,
       showValidator,
        screenValidator, 
        seatValidator,
        bookValidator
}
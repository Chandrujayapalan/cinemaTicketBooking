const Screen = require('../model/screen')
const ShowTime = require('../model/showTimings')
const Movie = require('../model/movie')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Theater = require('../model/theater')


const register = async (req, res, next) => {
    try {
        let { name, email, phone, password } = req.body

        let user = await User.findOne({ $or: [{ email: email }, { phone: phone }] })
        if (!user) {
            let userData = new User({
                name: name,
                email: email,
                phone: phone,
                password: await bcrypt.hash(password, 10),
                userType: 2,
            })
            let subAdmin = await userData.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully subAdmin',
                data: subAdmin
            })
        } else {
            return res.status(400).json({ status: 400, message: "Already exists" })
        }
    }
    catch (error) {
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const login = async (req, res, next) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ email: username, userType: 2 })
        console.log(user)
        if (user) {
            var validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: 400,
                    message: 'password does not match'
                })
            } else {
                let token = jwt.sign({ id: user.id, userType: user.userType }, process.env.TOKEN_KEY, { expiresIn: '10d' })
                return res.status(200).json({
                    status: 200,
                    message: " login successfully by subAdmin",
                    userType: user.userType,
                    data: token
                })
            }
        } else {
            return res.json({
                status: 400,
                message: 'no subAdmin found '
            })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const getAllTheater = async (req, res, next) => {
    try {
        let getTheater = await Theater.find({ status: true })
        if (!getTheater.length) {
            return res.status(400).json({
                status: 400,
                message: 'there is no theaters in you acc please create theaters',

            })
        } else {
            return res.status(200).json({
                status: 200,
                message: 'data fetch successfully',
                data: getTheater
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const createMovie = async (req, res, next) => {
    try {
        let { movieName, duration, releaseDate } = req.body
        let findMovie = await Movie.findOne({ movieName: movieName })
        if (!findMovie) {
            let movie = new Movie({
                movieName: movieName,
                duration: duration,
                releaseDate: releaseDate
            })
            await movie.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully',
                data: movie
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Already exists"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}

const getMovie = async (req, res, next) => {
    try {
        let getScreen = await Movie.find()
        return res.status(200).json({
            status: 200,
            message: 'data fetch successfully',
            data: getScreen
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}

const updateMovie = async (req, res, next) => {
    try {
        let { status } = req.body
        let { id } = req.params
        let findMovie = await Movie.find({ _id: id, status: true })
        console.log(findMovie)
        if (!findMovie.length) {
            return res.status(400).json({
                status: 400,
                message: "no movies"
            })

        } else {
            let movie = {
                status: status,
            }
            findMovie = await Movie.findByIdAndUpdate({ _id: id }, { $set: movie }, { new: true })
            return res.status(200).json({
                status: 200,
                message: 'updated successfully',
                data: findMovie
            })

        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}

const createScreen = async (req, res, next) => {
    try {
        let { screenName, theaterId, seats, ticketPrice } = req.body
        let getScreen = await Screen.find({ theaterId: theaterId, screenName: screenName })
        //  console.log(getScreen)
        if (!getScreen.length) {
            let screen = new Screen({
                theaterId: theaterId,
                screenName: screenName,
                ticketPrice: ticketPrice,
                seats: seats
            })
            await screen.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully',
                data: screen
            })
        } else {
            return res.status(400).json({ status: 400, message: "Already exists" })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}

const getScreen = async (req, res, next) => {
    try {
        let { theaterId } = req.params
        let getScreen = await Screen.find({ theaterId: theaterId })

        return res.status(200).json({
            status: 200,
            message: 'data fetch successfully',
            data: getScreen
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const updateScreen = async (req, res, next) => {
    try {
        let { status, ticketPrice, seats } = req.body
        let { id } = req.params
        let findScreen = await Screen.findOne({ _id: id, status: true })
        console.log(findScreen)
        if (!findScreen) {
            return res.status(400).json({
                status: 400,
                message: "no Screens"
            })

        } else {
            let screen = {
                status: status || findScreen.status,
                seats: seats || findScreen.seats,
                ticketPrice: ticketPrice || findScreen.ticketPrice,
            }
            screen = await Screen.findByIdAndUpdate({ _id: id }, { $set: screen }, { new: true })
            return res.status(200).json({
                status: 200,
                message: 'updated successfully',
                data: screen
            })

        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}

const createShowTiming = async (req, res, next) => {
    try {
        let { screenId, movieId, showTiming, showDate, endDate } = req.body
        let getScreen = await ShowTime.find({ screenId: screenId, movieId: movieId, showTiming: showTiming, showDate: showDate })
        if (!getScreen.length) {
            let show = new ShowTime({
                screenId: screenId,
                movieId: movieId,
                showTiming: showTiming,
                showDate: showDate,
                endDate: endDate
            })
            await show.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully',
                data: show
            })
        } else {
            return res.status(400).json({ status: 400, message: "Already exists" })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const getShow = async (req, res, next) => {
    try {
        let getShow = await ShowTime.find({ status: true })
            .populate({
                path: 'screenId',
                populate: {
                    path: "theaterId"
                }
            }).populate('movieId')
        return res.status(200).json({
            status: 200,
            message: 'data fetch successfully',
            data: getShow
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}
const updateShow = async (req, res, next) => {
    try {
        let { status } = req.body
        let { id } = req.params
        let showTime = {
                status: status ,
            }
        showTime = await ShowTime.findByIdAndUpdate({ _id: id }, { $set: showTime }, { new: true })
        if (showTime)
            return res.status(200).json({
                status: 200,
                message: 'updated successfully',
                data: showTime
            })

        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: 400,
            err: " Something went Wrong",
            message: error.message
        })
    }
}

module.exports = {
    register,
    login,
    createMovie,
    getMovie,
    updateMovie,
    getAllTheater,
    createScreen,
    getScreen,
    updateScreen,
    createShowTiming,
    getShow,
    updateShow,
}
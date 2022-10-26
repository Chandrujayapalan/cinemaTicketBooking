const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Movie = require('../model/movie')
const ShowTime = require('../model/showTimings')
const Screen = require('../model/screen')
const Seat = require('../model/seat')
const Reserver = require('../model/reserver')
const Theater = require('../model/theater')
const moment = require("moment")

const register = async (req, res, next) => {
    try {
        let user = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })

        if (!user) {
            let userData = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: await bcrypt.hash(req.body.password, 10),
                userType: req.body.userType,
                dateTime: req.body.dateTime
            })
            if (req.body.userType == 1) {
                let superAdmin = await userData.save()
                return res.status(200).json({
                    status: 200,
                    message: 'Added successfully',
                    data: superAdmin
                })
            } else {
                if (req.body.userType == 2) {
                    let admin = await userData.save()
                    return res.status(200).json({
                        status: 200,
                        message: 'Added successfully',
                        data: admin
                    })
                }
                else {
                    if (req.body.userType == 3) {
                        let users = await userData.save()
                        // let find = users.createdAt
                        //  find = moment(find).format("HH:mm A")
                        return res.status(200).json({
                            status: 200,
                            message: 'Added successfully',
                            data: users
                        })
                    }
                }
                return res.json({ status: 400, message: "please provide valid userType" })
            }

        } else {
            return res.json({ status: 400, message: "Already exists" })

        }
    }
    catch (error) {
        res.json({
            message: error.message
        })
    }
}
const login = async (req, res, next) => {
    try {
        let username = req.body.username
        let password = req.body.password
        let user = await User.findOne({ email: username })
        console.log(user)
        if (user) {
            var validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.json({
                    message: 'password does not match'
                })
            } else {
                let token = jwt.sign({ id: user.id, userType: user.userType }, process.env.TOKEN_KEY, { expiresIn: '5d' })
                return res.status(200).json({
                    status: 200,
                    message: " login successfully",
                    userType: user.userType,
                    data: token
                })
            }
        } else {
            return res.json({
                status: 400,
                message: 'no user found'
            })
        }
    }
    catch (error) {
        console.log(error)
        res.json({
            message: error.message
        })
    }
}
const createMovie = async (req, res, next) => {
    try {
        let { movieName, duration, releaseDate, showStart } = req.body
        let findMovie = await Movie.findOne({ $and: [{ movieName: movieName }] })
        if (!findMovie) {
            let movie = new Movie({
                movieName: movieName,
                duration: duration,
                releaseDate: releaseDate
            })
            await movie.save()
            // await ShowTime.save({ showStart: showStart })
            // await ShowTime.save({ showStart: showStart })

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
const createShowTiming = async (req, res, next) => {
    try {

        let { showStart, screenId, theaterId } = req.body
        let show = new ShowTime({
            theaterId: theaterId,
            screenId: screenId,
            showStart: showStart,
            // seatId: seatId
            // startAt: startAt,
            // startDate: startDate,
            // endDate: endDate
        })
        await show.save()
        return res.status(200).json({
            status: 200,
            message: 'Added successfully',
            data: show
        })
        // // } else {
        //     return res.status(400).json({
        //         status: 400,
        //         message: "Already exists"
        //     })
        // }
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
        let { screenName, theaterId, seatId } = req.body

        let getScreen = await Screen.find({ theaterId: theaterId })
        getScreen = getScreen.find(a => a.screenName === screenName)

        if (!getScreen) {
            let screen = new Screen({
                theaterId: theaterId,
                screenName: screenName,
                seatId: seatId
            })
            await screen.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully',
                data: screen
            })
        } else {
            return res.json({ status: 400, message: "Already exists" })

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
const createSeat = async (req, res, next) => {
    try {
        let { TicketPrice, totalSeat } = req.body
        let seat = new Seat({
            totalSeat: totalSeat,
            seatsRemaining: totalSeat.length,
            TicketPrice: TicketPrice
        })
        await seat.save()
        return res.status(200).json({
            status: 200,
            message: 'Added successfully',
            data: seat
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
const createReserver = async (req, res, next) => {
    try {
        let { screenId, movieId, showTimeId, startDate, endDate, theaterId } = req.body
        let getReserver = await Reserver.find({ $and: [{ screenId: screenId }, { movieId: movieId }] })
        console.log(getReserver, "showTime")
        // .populate({
        //     path: 'theaterId',
        //     populate: {
        //         path: 'screenId',
        //     }
        // })
        // .populate( 'movieId')
        // .populate('theaterId')
        // .populate('screenId')
        // .populate('showTimeId')

        //    let showTime = showTimeId.map(itemY => { return itemY; });
        //     console.log(showTime, "showTime")

        //     getReserver = getReserver.map(a => a.showTimeId.filter(a => showTime.includes(a)))



        // console.log(getReserver) 
        // return res.status(200).json({
        //     status: 200,
        //     message: 'Added successfully',
        //     data: getReserver
        // })
        if (!getReserver.length) {
            let reserver = new Reserver({
                theaterId: theaterId,
                screenId: screenId,
                movieId: movieId,
                showTimeId: showTimeId,
                startDate: startDate,
                endDate: endDate
            })
            await reserver.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully',
                data: reserver
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
const updateReserver = async (req, res, next) => {
    try {
        let { showTimeId } = req.body
        let { id } = req.params
        console.log(id)
        let getReserver = await Reserver.findOne({ _id: id })
       
        console.log(getReserver, "showTime")
        let find = getReserver.endDate
        find = moment(find).format("YYYY-MM-DD")
        console.log(find)
        // console.log(, "showTime")
        // return
        if (find == new Date().toISOString().slice(0, 10)) {
            let reserver = {
                status: false,
            }
            let updateStatus = await Reserver.findOneAndUpdate(id, { $set: reserver })
            return res.status(200).json({
                status: 200,
                message: 'updated status successfully',
                data: updateStatus
            })
        }else {
            let reserver = {
                showTimeId: showTimeId,
            }
           let updateReserver = await Reserver.findOneAndUpdate(id, { $set: reserver })
            return res.status(200).json({
                status: 200,
                message: 'updated successfully',
                data: updateReserver
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
const createTheater = async (req, res, next) => {
    try {
        // let findTheater = await

        let { theaterName, area } = req.body
        let theater = new Theater({
            theaterName: theaterName,
            area: area
        })
        await theater.save()
        return res.status(200).json({
            status: 200,
            message: 'Added successfully',
            data: theater
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

const getAllTheater = async (req, res, next) => {
    try {

        let getAll = await Theater.find().populate({
            path: 'reserverId',
            populate: {
                path: 'screenId',
            }
        })
            .populate({
                path: 'reserverId',
                populate: { path: 'movieId' }
            })
            .populate({
                path: 'reserverId',
                populate: {
                    path: 'showTimeId',
                    populate: {
                        path: 'seatId'
                    }
                }
            }).populate('theaterId')
        // .populate({
        //     path: 'reserverId',
        //     populate: { path: 'screenId' }
        // })
        //    getAll = getAll.map(a => a.reserverId).populate("screenId")
        return res.status(200).json({
            status: 200,
            message: 'date fetch successfully',
            data: getAll
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
const getTheaterInArea = async (req, res, next) => {
    try {
        let { area, theaterName, movieName ,date} = req.query
        let obj = { status: { $ne: false } }
        if (theaterName || area) {
            obj.match = {
                $or: [
                    {
                        theaterName: { $regex: `${theaterName}` }
                    },
                    {
                        area: { $regex: `${area}` }
                    },
                ]
            }
        }
        if (movieName) {
            obj.match = {
                movieName: { $regex: `${movieName}` }
            }
        }
        if (date) {
            obj.match = {
                // showTimeId: {
                    // $type:
                    //     "array" ,$ne: null},
                showStart: { $gte: date }
            }
        }
        let getTheater = await Reserver.find({ status: obj.status })
            .populate({
                path: 'theaterId',
                match: obj.match
            }).populate({
                path: 'screenId',
                populate: {
                    path: 'seatId',
                }
            }).populate({
                path: 'movieId',
                match: obj.match
            })
            .populate({
                path: 'showTimeId',
                match: obj.match,
                // not :[],
                
            })
        // getTheater = getTheater.filter(a => { return { a.theaterId.theaterName === theaterName } , a.theaterId.area === area})
        // console.log(getTheater)
        // console.log() 
        let getTheater1 = getTheater.filter(a => a.theaterId !== null)
        let getTheater2 = getTheater.filter(a => a.movieId !== null)
        console.log(getTheater2)
        

        let getTheater3 = getTheater.map(a => a.showTimeId.filter(a => a._id !== null )  )
        console.log(getTheater3, "getTheater3")

        getTheater3 = getTheater3.filter(a => !a )
        console.log(getTheater3, "getTheater3")

        // getTheater3 = getTheater3.filter(a => !a.length)
        console.log(getTheater3, "getTheater3")

        if (!getTheater1.length) {
            return res.status(400).json({
                status: 400,
                message: 'there is no theater in your area',
            })
        } else if (!getTheater2.length) {
            return res.status(400).json({
                status: 400,
                message: 'there is no movie such like',
            })         
        }
        else if (!getTheater3.length ) {
            return res.status(400).json({
                status: 400,
                message: 'there is no movie such like in date',
            })
        } 
        else {
            return res.status(200).json({
                status: 200,
                message: 'data successfully',
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
const getScreen = async (req, res, next) => {
    try {
        let getScreen = await Screen.find()


   
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

module.exports = {
    register,
    login,
    getTheaterInArea,
    updateReserver,
    // createTheat,
    getAllTheater,
    createMovie,
    createShowTiming,
    createScreen,
    createReserver,
    createSeat,
    createTheater,
    getScreen
}
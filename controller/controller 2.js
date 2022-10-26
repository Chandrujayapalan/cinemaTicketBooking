// const User = require('../model/user')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const Movie = require('../model/movie')
// const ShowTime = require('../model/showTimings')
// const Screen = require('../model/screen')
// const Seat = require('../model/seat')

// const register = async (req, res, next) => {
//     try {
//         let user = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })

//         if (!user) {
//             let userData = new User({
//                 name: req.body.name,
//                 email: req.body.email,
//                 phone: req.body.phone,
//                 password: await bcrypt.hash(req.body.password, 10),
//                 userType: req.body.userType
//             })
//             if (req.body.userType == 1) {
//                 let superAdmin = await userData.save()
//                 return res.status(200).json({
//                     status: 200,
//                     message: 'Added successfully',
//                     data: superAdmin
//                 })
//             } else {
//                 if (req.body.userType == 2) {
//                     let admin = await userData.save()
//                     return res.status(200).json({
//                         status: 200,
//                         message: 'Added successfully',
//                         data: admin
//                     })
//                 }
//                 else {
//                     if (req.body.userType == 3) {
//                         let users = await userData.save()
//                         return res.status(200).json({
//                             status: 200,
//                             message: 'Added successfully',
//                             data: users
//                         })
//                     }
//                 }
//                 return res.json({ status: 400, message: "please provide valid userType" })
//             }

//         } else {
//             return res.json({ status: 400, message: "Already exists" })

//         }
//     }
//     catch (error) {
//         res.json({
//             message: error.message
//         })
//     }
// }
// const login = async (req, res, next) => {
//     try {
//         let username = req.body.username
//         let password = req.body.password
//         let user = await User.findOne({ email: username })
//         console.log(user)
//         if (user) {
//             var validPassword = bcrypt.compareSync(password, user.password);
//             if (!validPassword) {
//                 return res.json({
//                     message: 'password does not match'
//                 })
//             } else {
//                 let token = jwt.sign({ id: user.id, userType: user.userType }, process.env.TOKEN_KEY, { expiresIn: '5d' })
//                 return res.status(200).json({
//                     status: 200,
//                     message: " login successfully",
//                     userType: user.userType,
//                     data: token
//                 })
//             }
//         } else {
//             return res.json({
//                 status: 400,
//                 message: 'no user found'
//             })
//         }
//     }
//     catch (error) {
//         console.log(error)
//         res.json({
//             message: error.message
//         })
//     }
// }
// const createMovie = async (req, res, next) => {
//     try {
//         let { movieName, duration, releaseDate } = req.body
//         let findMovie = await Movie.findOne({ movieName: movieName })
//         if (!findMovie) {
//             let movie = new Movie({
//                 movieName: movieName,
//                 duration: duration,
//                 releaseDate: releaseDate
//             })
//             await movie.save()
//             return res.status(200).json({
//                 status: 200,
//                 message: 'Added successfully',
//                 data: movie
//             })
//         } else {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Already exists"
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             status: 400,
//             err: " Something went Wrong",
//             message: error.message
//         })
//     }
// }
// const createShowTiming = async (req, res, next) => {
//     try {

//         let { movieId, screenId, startAt, startDate, endDate } = req.body

//         let findMShow = await ShowTime.findOne({ startAt: startAt })
//         console.log(findMShow)
//         if (!findMShow) {
//             let show = new ShowTime({
//                 screenId: screenId,
//                 movieId: movieId,
//                 startAt: startAt,
//                 startDate: startDate,
//                 endDate: endDate
//             })
//             await show.save()
//             return res.status(200).json({
//                 status: 200,
//                 message: 'Added successfully',
//                 data: show
//             })
//         } else {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Already exists"
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             status: 400,
//             err: " Something went Wrong",
//             message: error.message
//         })
//     }
// }

// const createScreen = async (req, res, next) => {
//     try {
//         let { movieId, screenName, showTimeId } = req.body
//         let screen = new Screen({
//             movieId: movieId,
//             screenName: screenName,
//             // showTimeId: showTimeId
//         })
//         await screen.save()
//         return res.status(200).json({
//             status: 200,
//             message: 'Added successfully',
//             data: screen
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             status: 400,
//             err: " Something went Wrong",
//             message: error.message
//         })
//     }
// }
// const createSeat = async (req, res, next) => {
//     try {
//         let { screenId, TicketPrice, totalSeat } = req.body
//         let seat = new Seat({
//             screenId: screenId,
//             totalSeat: totalSeat,
//             seatsRemaining: totalSeat.length,
//             TicketPrice: TicketPrice
//         })
//         await seat.save()
//         return res.status(200).json({
//             status: 200,
//             message: 'Added successfully',
//             data: seat
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(400).json({
//             status: 400,
//             err: " Something went Wrong",
//             message: error.message
//         })
//     }
// }
// module.exports = { register, login, createMovie, createShowTiming, createScreen, createSeat }
const Screen = require('../model/screen')
const ShowTime = require('../model/showTimings')
const Movie = require('../model/movie')
const createScreen = async (req, res, next) => {
    try {
        let { screenName, theaterId, seats, ticketPrice } = req.body
        let getScreen = await Screen.find({ theaterId: theaterId })
        getScreen = getScreen.find(a => a.screenName === screenName)
        if (!getScreen) {
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

const createShowTiming = async (req, res, next) => {
    try {

        let { screenId, movieId, showTiming ,startDate, endDate } = req.body
        let getScreen = await ShowTime.find({ screenId: screenId ,  movieId: movieId ,  showTiming: showTiming  })

        if (!getScreen.length){
        let show = new ShowTime({
            screenId: screenId,
            movieId: movieId,
            showTiming: showTiming,
            startDate: startDate,
            endDate: endDate

               })
        await show.save()
        return res.status(200).json({
            status: 200,
            message: 'Added successfully',
            data: show
        })}else{
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
module.exports = {
    createScreen,
    createShowTiming,
    getScreen,
    getMovie
}
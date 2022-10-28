const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Theater = require('../model/theater')

const register = async (req, res, next) => {
    try {
        let user = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
        let { name, email, phone, password } = req.body
        if (!user) {
            let userData = new User({
                name: name,
                email: email,
                phone: phone,
                password: await bcrypt.hash(password, 10),
                userType: 1,
            })
            let admin = await userData.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully Admin',
                data: admin
            })
        } else {
            return res.json({ status: 400, message: "Already exists" })
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
        let user = await User.findOne({ email: username, userType: 1 })
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
                    message: " login successfully by Admin",
                    userType: user.userType,
                    data: token
                })
            }
        } else {
            return res.json({
                status: 400,
                message: 'no admin found'
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
const createTheater = async (req, res, next) => {
    try {
        console.log(req.user.id)
        let { theaterName } = req.body
        let getTheater = await Theater.find({ theaterName: theaterName, userId: req.user.id, status: true })
        if (!getTheater.length) {
            let theater = new Theater({
                theaterName: theaterName,
                userId: req.user.id
            })
            await theater.save()
            return res.status(200).json({
                status: 200,
                message: 'Added successfully',
                data: theater
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Already exist"
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

const getAllTheater = async (req, res, next) => {
    try {
        let getTheater = await Theater.find({ userId: req.user.id, status: true })
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
const updateTheater = async (req, res, next) => {
    try {
        // let userId = req.user.id
        let { id } = req.params
        let { theaterName, status } = req.body
       
        let getTheater = await Theater.findById(id)
        console.log(getTheater)
        if (!getTheater) {
            return res.status(400).json({
                status: 400,
                message: 'There is no such like theater',
            })
        }
        getTheater = getTheater.theaterName == theaterName
        if (!getTheater) {
            let theater = {
                theaterName: theaterName || getTheater.theaterName,
                status: status || getTheater.status
            }
            getTheater = await Theater.findByIdAndUpdate({ _id: id }, { $set: theater }, { new: true })
            return res.status(200).json({
                status: 200,
                message: 'updated successfully',
                data: getTheater
            })
        } else {
            return res.status(200).json({
                status: 200,
                message: 'Please change the theater name already exists',
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

module.exports = {
    register,
    login,
    createTheater,
    getAllTheater,
    updateTheater
}
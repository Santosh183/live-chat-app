const userModel = require('../models/userModel');
const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleWare = require('../middlewares/authMiddlewaire')

// user registration
router.post('/register', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (user) {
            return res.send({
                message: 'User already exist',
                success: false
            });
        }
        const hashedPassword = await bcryptjs.hash(req.body.password, 10) // 10 is level of salting
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        return res.send({
            message: 'User created successfully',
            success: true
        });
    }
    catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})


// user login
router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.send({
                message: 'User does not exist',
                success: false
            });
        }
        const validPassword = await bcryptjs.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.send({
                message: 'Invalid password',
                success: false
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        return res.send({
            message: 'User logged in successfully',
            success: true,
            data: token
        });
    }
    catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})

// user login
router.get('/get-current-user', authMiddleWare, async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        res.send({
            message: 'User fetched successfully',
            data: user,
            success: true
        })
    }
    catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

// get current user
router.get('/get-all-users', authMiddleWare, async (req, res) => {
    try {
        const allUsers = await userModel.find({ _id: { $ne: req.body.userId } });
        res.send({
            message: 'Users fetched successfully',
            data: allUsers,
            success: true
        })
    }
    catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
})


module.exports = router;
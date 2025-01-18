const User = require("../models/User")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const jwt_secret = process.env.JWT_SECRET

exports.getUser = async(req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)

        if(!user){
            return res.status(400).json({ message: 'User is not exists'})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: error.message  })
    }
}
exports.getUsers = async(req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({ message: error.message  })
    }
}
exports.createUser = async(req, res) => {
    try {
        const { name, email, password } = req.body

        const salt = await bcrypt.genSalt(10); // Gera um salt único para a senha.
        const hashPassword = await bcrypt.hash(password, salt); // Gera o hash da senha usando o salt.
        
        const user = await User.create({
            name,
            email,
            password: hashPassword
        })

        const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "1h" });
    
        res.status(201).json({ message: 'User created successfully', token, user });


        
    } catch (error) {
        res.status(400).json({ message: error.message  })
    }
}
exports.updateUser = async(req, res) => {
    try {
        const userId = req.params.id
        const userUpdate = req.body
        const user = await User.findByIdAndUpdate(userId, userUpdate, { new: true })

        if(!user){
            return res.status(400).json({ message: 'User is not exists'})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: error.message  })
    }
}
exports.deletedUser = async(req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findByIdAndDelete(userId)

        if(!user){
            return res.status(400).json({ message: 'User is not exists'})
        }
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message  })
    }
}
exports.deletedUserAll = async(req, res) => {
    try {
        const user = await User.deleteMany()
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        } res.status(200).json({ message: 'All users have been deleted.'  });

    } catch (error) {
        res.status(400).json({ message: error.message  })
    }
}
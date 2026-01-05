import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function registerUser(req, res) {

    const { name, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "user Already Exists"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password: hashPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: "user register successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })
}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET);

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "user Login succesfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    })

}

async function logoutUser(req, res) {
    res.clearCookie("token");

    res.status(200).json({
        message: "user logout succesfully"
    })
}

async function myProfile(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please login first!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export default { registerUser, loginUser, logoutUser, myProfile };
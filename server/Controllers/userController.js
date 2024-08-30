const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// Function to create a JWT token
const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

// Function to register a new user
const registerUser = async (req, res) => {
    try {
        // Extract fields from request body
        const { firstName, lastName, dob, email, password } = req.body;

        // Check if all required fields are provided
        if (!firstName || !lastName || !dob || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        // Validate password length
        if (!validator.isLength(password, { min: 8 })) {
            return res.status(400).json({ error: "Password should be at least 8 characters long" });
        }

        // Validate Date of Birth
        if (!validator.isDate(dob)) {
            return res.status(400).json({ error: "Invalid Date of Birth" });
        }

        // Check if user already exists
        let user = await userModel.findOne({ email });
        if (user) return res.status(400).json({ error: "Email already exists" });

        // Create a new user
        user = new userModel({ firstName, lastName, dob, email, password });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user
        await user.save();

        // Create a token
        const token = createToken(user._id);

        // Respond with user data and token
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Create a token
        const token = createToken(user._id);

        // Respond with user data and token
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Extract the user ID or email from the request parameters or query
        const user = await userModel.findById(userId);
        // console.log(user)
        // console.log(userId)
        res.status(200).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const getUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Extract the user ID or email from the request parameters or query
        const users = await userModel.find();
        res.status(200).json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
module.exports = { registerUser , loginUser, findUser, getUser};

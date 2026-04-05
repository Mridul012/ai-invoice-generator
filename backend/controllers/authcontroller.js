const jwt = require("jsonwebtoken");

const User = require("../models/User");

const generatetoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

}

exports.registerUser = async (req, res) => {
    const {name,email,password} = req.body;

    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"Please provide all fields"});
        }

        const userexists = await User.findOne({email});
        if(userexists){
            return res.status(400).json({message:"User already exists"});
        }

        const user = await User.create({email,name,password});
        if(user){
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                token:generatetoken(user._id),
            });
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }



    }
    catch(err){
        console.error("Error in user registration", err);
        res.status(500).json({message:"Server error"});
    }}


exports.loginUser = async (req, res) => {
    const {email,password} = req.body;

    try{
        const user = await User.findOne({email}).select("+password");
        if(user && (await user.matchPassword(password))){
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                token:generatetoken(user._id),

                businessName:user.businessName,
                address:user.address || "",
                phone:user.phone
            });
        } 
        else{
            res.status(401).json({message:"Invalid email or password"});
        }

    }
    catch(err){
        console.error("Error in user login", err);
        res.status(500).json({message:"Server error"});
    }}

exports.getMe = async (req, res) => {


    try{
        const user = await User.findById(req.user._id);
        if(user){
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                businessName:user.businessName,
                address:user.address || "",
                phone:user.phone
            });
        } 
        else{
            res.status(404).json({message:"User not found"});
        }

    }
    catch(err){
        console.error("Error in user registration", err);
        res.status(500).json({message:"Server error"});
    }}




exports.updateUserProfile = async (req, res) => {


    try{
        const user = await User.findById(req.user._id);
        if(user){
            user.name = req.body.name || user.name;
            user.businessName = req.body.businessName || user.businessName;
            user.address = req.body.address || user.address;
            user.phone = req.body.phone || user.phone;


            const updatedUser = await user.save();

            res.json({
                _id:updatedUser._id,
                name:updatedUser.name,
                email:updatedUser.email,
                businessName:updatedUser.businessName,
                address:updatedUser.address || "",
                phone:updatedUser.phone,
            });
        }
        else{
            res.status(404).json({message:"User not found"});
        }

    }
    catch(err){
        console.error("Error in user registration", err);
        res.status(500).json({message:"Server error"});
    }}



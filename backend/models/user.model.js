import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const emailRegexPattern = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\\.[!#-'*+/-9=?A-Z^-~-]+)*|\"(\\[\\]!#-[^-~ \\t]|(\\\\[\\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\\.[!#-'*+/-9=?A-Z^-~-]+)*|\\[[\\t -Z^-~]*])");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            validate: {
                validator: function (value) {
                    return emailRegexPattern.test(value);
                },
                message: "Please enter a valid email"
            },
            unique: true,
        },
        password: {
            type: String,
            minLength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: ['superuser', 'admin', 'user'],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    },
    { timestamps: true }
);

// Hash password before saving 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Sign access token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
        expiresIn: "5m"
    });
};

// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: "3d"
    });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;

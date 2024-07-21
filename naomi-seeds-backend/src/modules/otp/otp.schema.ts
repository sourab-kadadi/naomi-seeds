import * as mongoose from 'mongoose';


export const otp = new mongoose.Schema ({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true
    },
    email: {
        type: String,
    },
    otp: {
    type: String,
    unique: true
    },
}, { timestamps: true, strict: true });

otp.index({createdAt: 1}, {expireAfterSeconds: 660});
mongoose.model("OTP", otp);
otp.on('index', function(error) {
    console.log(error.message);
});
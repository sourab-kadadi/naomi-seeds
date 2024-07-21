import * as mongoose from 'mongoose';
import { APPROVALSTATUS } from './payment.dto';

var media = new mongoose.Schema({ 
    filePath:{
        type: String,
        // required: true
    }, type: {
     type: String,
    //  required: true,
 }});

export const paymentSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'profile',
    },
    profileName: {
        type: String,
        required: true,
        trim: true,
    },
    createdByPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    createdByPersonName: {
        type: String,
        required: true,
        trim: true,
    },
    accountantId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        trim: true,
    },
    accountantName: {
        type: String,
        // required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true
    },
    categoryTypeId: {
        type: String,
        required: true
    },
    categoryType: {
        type: String,
        required: true
    },
    salesOfficerNote: {
        type: String,
    },
    accountantNote: {
        type: String,
    },
    paymentDate: {
        type: Date,
        required: true
    },
    image: {
        type: [media],
        // required: true
    },
    approvalStatus: {
        type: String,
        enum: [APPROVALSTATUS.PENDING, APPROVALSTATUS.RECEIVED, APPROVALSTATUS.REJECTED],
        default: APPROVALSTATUS.PENDING
    },
    approvalStatusUpdatedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
    },
    approvalStatusUpdatedByUserName: {
        type: String,
        trim: true,
    },
    ledgerCreditId: {
        type: String,
    },
    ledgerDebitId: {
        type: String,
    },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    },
}, { timestamps: true, strict: true }

)
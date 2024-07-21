import * as mongoose from 'mongoose';
import { ACCOUNTINGTYPE, PARTICULARTYPE } from './ledger.dto';

// const txnRef = new mongoose.Schema({ 
//     txnRefId:{
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         trim: true,
//     }, 
//     txnRefCollection: {
//      type: String,
//      required: true,
//  }});


export const ledgerSchema = new mongoose.Schema ({
    partyProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    partyName: {
        type: String,
        required: true,
        trim: true,
    },
    oppositePartyProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    oppositePartyName: {
        type: String,
        required: true,
        trim: true,
    },
    txnDate: {
        type: Date,
        required: true,
        trim: true,
    },
    txnRefId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    }, 
    txnRefCollection: {
     type: String,
     required: true,
 },
    accountingType: {
        type: String,
        required: true,
        enum: [ACCOUNTINGTYPE.DR, ACCOUNTINGTYPE.CR],
    },
    particularType: {
        type: String,
        required: true,
        enum: [PARTICULARTYPE.SALES, PARTICULARTYPE.PURCHASES, PARTICULARTYPE.SALES_RETURN, PARTICULARTYPE.SALES_RETURN_TO_COMPANY, PARTICULARTYPE.PAYMENT_MADE, PARTICULARTYPE.PAYMENT_RECEIVED, PARTICULARTYPE.IPT_SALES, PARTICULARTYPE.IPT_SALES_RETURN, PARTICULARTYPE.DISCOUNTS_GIVEN, PARTICULARTYPE.DISCOUNTS_RECEIVED, PARTICULARTYPE.IPT_GOODS_TRANSFER ],
    },
    vchType: {
        type: String,
        // required: true,
        trim: true,
    },
    vchNumber: {
        type: String,
        trim: true,
    },
    narration: {
        type: String,
        trim: true,
    },
    comment: {
        type: String,
        // required: true,
    },
    amount: {
        type: Number,
        trim: true,
    },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},  { timestamps: true });

ledgerSchema.index({particularType: 1});

ledgerSchema.on('index', function(error) {
    console.log(error.message);
  });
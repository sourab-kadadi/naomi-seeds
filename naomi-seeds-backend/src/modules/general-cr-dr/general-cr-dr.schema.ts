import * as mongoose from 'mongoose';
import { transactionApproval, typeOfEntry } from './general-cr-dr.dto';

const itemDetail = {
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
      },
    productName:  {
        type: String,
        trim: true,
    },
    crop:  {
        type: String,
        trim: true,
    },
    quantity:  {
        type: Number,
        required: true,
        trim: true,
    },
    rateDiff:  {
        type: Number,
        required: true,
        trim: true,
    },
    amount: { 
        type: Number,
        required: true,
        trim: true,
    }
}



export const generalCrDrSchema = new mongoose.Schema ({
    genCrDrNumber: {
        type: String,
        required: true,
        trim: true,
        unique:true
      },
    fromDistributorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
      },
    fromDistributorName: {
        type: String,
        required: true,
        trim: true,
      },
      fromDistributorRole: {
        type: String,
        required: true
      },
      toDistributorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
      },
    toDistributorName: {
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
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      trim: true,
  },
  adminName: {
      type: String,
      // required: true,
      trim: true,
  },
      salesPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
    },
    salesPersonName: {
        type: String,
        trim: true,
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
    },
    managerName: {
        type: String,
        trim: true,
    },
    genCrDrDate: {
        type: Date,
        required: true,
    },
    items: {
        type: [itemDetail]
    },
    totalValue: {
        type: Number,
        trim: true,
    },
    transactionApproval: {
        type: String,
        enum: [transactionApproval.PENDING ,transactionApproval.APPROVED ],
        default: transactionApproval.PENDING
    },
    // managerApprovalGenerateDC: {
    //     type: String,
    //     enum: ["PENDING", "APPROVED"],
    //     default: "PENDING"
    // },
    // salesOfficerApprovalStatus: {
    //     type: String,
    //     enum: ["PENDING", "SHIPPED", "OUT_FOR_DELIVERY"],
    //     default: "PENDING"
    // },
    // toDistributorConfirmation: {
    //     type: String,
    //     enum: ["PENDING", "RECEIVED"],
    //     default: "PENDING"
    // },
    // managerFinalApproval: {
    //     type: String,
    //     enum: ["PENDING", "APPROVED"],
    //     default: "PENDING"
    // },
    discountsPdfFileName: {
        type: String
    },
    debitsPdfFileName: {
        type: String
    },
    narration: {
        type: String
    },
    ledgerCreditId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    ledgerDebitId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    typeOfEntry: {
        type: String,
        enum: [typeOfEntry.DISCOUNTS_FOR_PRODUCT_PURCHASES, typeOfEntry.EXPENSE_INCURRED_ON_BEHALF_OF_DISTRIBUTOR,
            typeOfEntry.TRANSPORTATION_EXPENSE_CR_TO_DISTRIBUTOR, typeOfEntry.GENERAL_DISCOUNT
        ],
    },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    },
},{ timestamps: true, strict: true });

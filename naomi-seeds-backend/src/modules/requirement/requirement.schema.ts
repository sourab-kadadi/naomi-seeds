import * as mongoose from 'mongoose';


// const itemDetail = {
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         trim: true,
//       },
//     productName:  {
//         type: String,
//         trim: true,
//     },
//     quantity:  {
//         type: Number,
//         required: true,
//         trim: true,
//     },
//     quantityUnit:  {
//         type: String,
//         required: true,
//         default: "kg",
//         trim: true,
//     },
//     packingSize: {
//         type: Number,
//         trim: true,
//     },
//     packingSizeunit: {
//         type: String,
//     //    default: "kg"
//     },
//     dispatchedStatus: {
//         type: String,
//         enum: ["PENDING", "DISPATCHED", "REJECTED"],
//         default: "PENDING"
//     }
// }


export const requirementSchema = new mongoose.Schema ({
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
    salesPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        trim: true,
    },
    salesPersonName: {
        type: String,
        // required: true,
        trim: true,
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        trim: true,
    },
    managerName: {
        type: String,
        // required: true,
        trim: true,
    },
    requirementDate: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
      },
    productName:  {
        type: String,
        trim: true,
    },
    quantity:  {
        type: Number,
        required: true,
        trim: true,
    },
    quantityUnit:  {
        type: String,
        required: true,
        // enum: ["tonne", "kgs", "g"],
        enum: ["kgs"],
        default: "kgs",
        trim: true,
    },
    packingSize: {
        type: String,
    },
    // packingSizeunit: {
    //     type: String,
    //     // enum: ["kgs", "g"],
    // },
    dispatchedStatus: {
        type: String,
        enum: ["PENDING", "DISPATCHED", "REJECTED"],
        default: "PENDING"
    },



    // items: {
    //     type: [itemDetail]
    // },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    },
},{ timestamps: true, strict: true });

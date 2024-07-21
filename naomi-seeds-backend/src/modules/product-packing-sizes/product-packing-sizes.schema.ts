import * as mongoose from 'mongoose';
import { PackingSizes } from './product-packing-sizes.dto';


export const productPackingSizes = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    packingQty: {
        type: Number,
        trim: true,
        required: true,
        ref: 'quantity like 4, 3 etc'
    },
    packingUnit: {
        type: String,
        trim: true,
        required: true,
        enum: [PackingSizes.GMS, PackingSizes.KGS, PackingSizes.QUINTAL, PackingSizes.TONNE]
    },
    // packingQtyUnitDisplay: {
    //     type: String,
    //     trim: true,
    //     required: true,
    // },
    effectiveRatePerKg: {
        type: Number,
        required: true,
        ref: 'rate computed per kg basis for sale to distributor'
    },
    packetInvoicePrice: {
        type: Number,
        required: true,
        ref: 'invoice price per packet'
    },
    packetMRPPrice: {
        type: Number,
        // required: true,
        ref: 'MRP on the Packet'
    },
    lockedForEditingExceptAdmin: {
        type: Boolean,
        required: true,
        default: false,
        ref: 'if true, then all others having access cant edit the data'
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
}, { timestamps: true });




productPackingSizes.index({ productName: 1 });
productPackingSizes.on('index', function (error) {
    console.log(error.message);
});
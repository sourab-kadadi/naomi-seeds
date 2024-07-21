import * as mongoose from 'mongoose';
import { PackingSizes } from '../product-packing-sizes/product-packing-sizes.dto';
import { TypeOfSale } from './orders.dto';
import { OrderStatus } from './orders.enum';
// import { typeOfSale } from './ipt.dto';


const itemDetail = {
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    crop: {
        type: String,
        required: true,
        trim: true,
    },
    lotId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    lotNumber: {
        type: String,
        required: true,
        trim: true,
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
    packetMRPPrice: {
        type: Number,
        // required: true,
        ref: 'MRP on the Packet'
    },
    numberOfPacketsOrdered: {
        type: Number,
        required: true,
        trim: true,
    },
    itemQuantityInKgs: {
        type: Number,
        required: true,
        trim: true,
    },
    effectiveRatePerKgForSale: {
        type: Number,
        // required: true,
        ref: 'rate computed per kg basis for sale to Profile'
    },
    packetInvoicePriceForSale: {
        type: Number,
        // required: true,
        ref: 'invoice price per packet'
    },
    effectiveRatePerKgForReturn: {
        type: Number,
        // required: true,
        ref: 'rate computed per kg basis for return from Profile'
    },
    packetInvoicePriceForReturn: {
        type: Number,
        // required: true,
        ref: 'invoice price per packet for return'
    },
    itemAmountForReturn: {
        type: Number,
        // required: true,
        trim: true,
    },
    itemAmountForSale: {
        type: Number,
        // required: true,
        trim: true,
    }
}

const fromProfileInfo = {
    gstin: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    phoneNo: {
        type: String,
        trim: true,
    },
    completeAddress: {
        type: String,
        required: true,
        trim: true,
    },
    address1: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    taluka: {
        type: String,
        trim: true,
    },
    district: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    pincode: {
        type: String,
        trim: true,
    },
}

const toProfileInfo = {
    gstin: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    phoneNo: {
        type: String,
        trim: true,
    },
    completeAddress: {
        type: String,
        required: true,
        trim: true,
    },
    address1: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    taluka: {
        type: String,
        trim: true,
    },
    district: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    pincode: {
        type: String,
        trim: true,
    },
}

export const ordersSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    orderFromProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    orderFromProfileName: {
        type: String,
        required: true,
        trim: true,
    },
    orderFromProfileRole: {
        type: String,
        required: true
    },
    orderToProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    orderToProfileName: {
        type: String,
        required: true,
        trim: true,
    },
    orderToProfileRole: {
        type: String,
        required: true
    },
    //   plantManagerId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     // required: true,
    //     trim: true,
    // },
    // plantManagerName: {
    //     type: String,
    //     // required: true,
    //     trim: true,
    // },
    //   salesPersonId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     // required: true,
    //     trim: true,
    // },
    // salesPersonName: {
    //     type: String,
    //     // required: true,
    //     trim: true,
    // },
    // managerId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     // required: true,
    //     trim: true,
    // },
    // managerName: {
    //     type: String,
    //     // required: true,
    //     trim: true,
    // },
    orderDate: {
        type: Date,
        required: true,
    },
    orderType: {
        type: String,
        required: true,
        enum: [TypeOfSale.COMPANY_SALE, TypeOfSale.IPT, TypeOfSale.SALES_RETURN],
    },
    items: {
        type: [itemDetail]
    },
    totalUnits: {
        type: Number,
        trim: true,
    },
    totalQuantity: {
        type: Number,
        ref: 'in kgs',
        trim: true,
    },
    totalValueReturn: {
        type: Number,
        trim: true,
    },
    totalValueSale: {
        type: Number,
        trim: true,
    },
    rrOrLrNum: {
        type: String,
        trim: true,
    },
    vehicleNo: {
        type: String,
        trim: true,
    },
    transport: {
        type: String,
        trim: true,
    },
    driverName: {
        type: String,
        trim: true,
    },
    driverContact: {
        type: Number,
        trim: true,
    },
    freightTotal: {
        type: Number,
        trim: true,
    },
    frightPaidAdvance: {
        type: Number,
        trim: true,
    },
    frightToPay: {
        type: Number,
        trim: true,
    },
    fromProfileApproval: {
        type: String,
        enum: [OrderStatus.PENDING, OrderStatus.APPROVED, OrderStatus.NOT_APPLICABLE, OrderStatus.REJECT],
        default: OrderStatus.PENDING
    },
    managerApprovalGenerateDC: {
        type: String,
        enum: [OrderStatus.PENDING, OrderStatus.APPROVED, OrderStatus.NOT_APPLICABLE, OrderStatus.REJECT],
        default: OrderStatus.PENDING
    },
    salesOfficerApprovalStatus: {
        type: String,
        enum: [OrderStatus.PENDING, OrderStatus.APPROVED, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.NOT_APPLICABLE, OrderStatus.REJECT],
        default: OrderStatus.APPROVED
    },
    toProfileConfirmation: {
        type: String,
        enum: [OrderStatus.PENDING, OrderStatus.APPROVED, OrderStatus.NOT_APPLICABLE, OrderStatus.REJECT],
        default: OrderStatus.PENDING
    },
    managerFinalApproval: {
        type: String,
        enum: [OrderStatus.PENDING, OrderStatus.APPROVED, OrderStatus.NOT_APPLICABLE, OrderStatus.REJECT],
        default: OrderStatus.PENDING
    },


// track the user ids of all the ones approving the orders

    delivaryChallanNumber: {
        type: String
    },
    dcPdfFileName: {
        type: String
    },
    invoiceNumber: {
        type: String
    },
    invoicePdfFileName: {
        type: String
    },
    creditNoteNumber: {
        type: String
    },
    creditNotePdfFileName: {
        type: String
    },
    fromProfileInfoTxn: {
        type: fromProfileInfo,
    },
    toProfileInfoTxn: {
        type: toProfileInfo,
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
    ledgerCreditIdIPTPart2: {
        type: mongoose.Schema.Types.ObjectId,
    },
    ledgerDebitIdIPTPart2: {
        type: mongoose.Schema.Types.ObjectId,
    },
    salesOrderRefIDForSalesReturn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "for sales Return capture the original order ID"
    },
    salesOrderRefForSalesReturn: {
        type: String,
        ref: "for sales Return"
    },
    createdByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Save the userId who created the order"
    },
    createdByUserName: {
        type: String,
        required: true,
        ref: "Save the userName who created the order"
    },
    modifiedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Save the userId who Modified the order"
    },
    modifiedByUserName: {
        type: String,
        // required: true,
        ref: "Save the userName who modified the order"
    },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    },
}, { timestamps: true, strict: true });

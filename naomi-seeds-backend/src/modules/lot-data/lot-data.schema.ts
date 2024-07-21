import * as mongoose from 'mongoose';
import { CropType } from '../catalog/catalog.interface';
import { PackingSizes } from '../product-packing-sizes/product-packing-sizes.dto';
import { EItemStatus } from './lot-data.dto';


const lotProductionDetails = {
    processingPlantNo: {
        type: String,
        required: true,
        trim: true,
    },
    totalQtyOfLotsInKgs: {
        type: Number,
        required: true,
        trim: true,
    },
    numberOfPackets: {
        type: Number,
        required: true,
        trim: true,
    },
    dateOfTest: {
        type: Date,
        required: true,
    },
    lableNoFrom: {
        type: Number, 
        required: true,
        trim: true,
    },
    labelNoTo: {
        type: Number,
        trim: true,
        required: true,
    },
    missingNo: {
        type: Number,
        trim: true,
    },
    dateOfPacking: {
        type: Date,
        required: true,
        // trim: true,
    },
    validUpto: {
        type: Date,
        required: true,
        // trim: true,
    },
    seedGrowerNameAndAddress: {
        type: String,
        trim: true,
        required: true,
    },
    seedPurchasedFrom: {
        type: String,
        trim: true,
        required: true,
    },
    sowingSeason: {
        type: String,
        trim: true,
        required: true,
    },
    seedProductionSupervisor: {
        type: String,
        trim: true,
        required: true,
    },
    seedProcessingSupervisor: {
        type: String,
        trim: true,
        required: true,
    }
}


const truthfulLabel = {
    germinationInPercentageMin: {
        type: Number,
        trim: true,
    },
    geneticPurityInPercentageMin: {
        type: Number,
        trim: true,
    },
    physicalPuritySeedInPercentageMin: {
        type: Number,
        trim: true,
    },
    inertMatterNotMoreThanPercentMax: {
        type: Number,
        trim: true,
    },
    moistureInPercentageMax: {
        type: Number,
        trim: true,
    },
    otherCropSeedsNotMoreThanPerKgMax: {
        type: Number,
        trim: true,
    },
    weedSeedsPerKgMax: {
        type: Number,
        trim: true,
    },
    maleSeedUsed: {
        type: String,
        trim: true,
    },
    femaleSeedUsed: {
        type: String,
        trim: true,
    }
}

const specialFeatures = {
    name: {
        type: String
    }
}

const morphologicalCharacters = new mongoose.Schema({
    key: {
        type: String,
    },
    value: {
        type: String,
    }
});

var media = new mongoose.Schema({
    filePath: {
        type: String,
        // required: true
    },
    type: {
        type: String,
        // required: true
    }
});

const productData = {
    image: {
        type: [media],
    },
    morphologicalCharacters: {
        type: [morphologicalCharacters]
    },
    specialFeaturesUSPS: {
        type: [specialFeatures],
        // default: undefined
    },
}

export const lotDataSchema = new mongoose.Schema ({
    lotNo: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
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
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    cropName: {
        type: String,
        required: true,
        trim: true,
    },
    cropType: {
        type: String,
        enum: [CropType.FIELD_CROPS, CropType.VEGETABLE_CROPS],
        required: true,
    },
    productPackingSizeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    productData: {
        type: productData,
        ref: 'as it is from the catalog schema'
    },
    hsnCode: {
        type: String,
        required: true,
    },
    lotProductionDetails: {
        type: lotProductionDetails,
        // required: true
    },
    truthfulLabel: {
        type: truthfulLabel,
        // required: true
        ref: 'as it is from the catalog schema'
    },
    // packingQty: {
    //     type: Number,
    //     trim: true,
    //     required: true,
    //     ref: 'quantity like 4, 3 etc'
    // },
    // packingUnit: {
    //     type: String,
    //     trim: true,
    //     required: true,
    //     enum: [PackingSizes.GMS, PackingSizes.KGS, PackingSizes.QUINTAL, PackingSizes.TONNE]
    // },
    // effectiveRatePerKg: {
    //     type: Number,
    //     required: true,
    //     ref: 'rate computed per kg basis for sale to distributor'
    // },
    // packetInvoicePrice: {
    //     type: Number,
    //     required: true,
    //     ref: 'invoice price per packet'
    // },
    // packetMRPPrice: {
    //     type: Number,
    //     // required: true,
    //     ref: 'MRP on the Packet'
    // },
    
    // availabilityStatus: {
    //     type: String,
    //     enum: [EItemStatus.QUANTITYAVAILABLE, EItemStatus.NOQUANTITY],
    //     required: true,
    //     default: EItemStatus.QUANTITYAVAILABLE
    // },
    lotValidityAvailable: {
        type: Boolean,
        required: true,
        default: true,
    },
    lotDataEditable: {
        type: Boolean,
        required: true,
        default: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }

},  { timestamps: true });

lotDataSchema.index({lotNo: 1});

lotDataSchema.on('index', function(error) {
    console.log(error.message);
  });
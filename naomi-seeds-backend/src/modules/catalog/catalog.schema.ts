import * as mongoose from 'mongoose';
import { CropType } from './catalog.interface';


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

export const catalog = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    crop: {
        type: String,
        trim: true,
        required: true
    },
    cropType: {
        type: String,
        enum: [CropType.FIELD_CROPS, CropType.VEGETABLE_CROPS],
    },
    image: {
        type: [media],
        // required: true
    },
    hsnCode: {
        type: String,
        required: true,
        trim: true,
    },
    morphologicalCharacters: {
        type: [morphologicalCharacters]
    },
    specialFeaturesUSPS: {
        type: [specialFeatures],
        default: undefined
    },
    truthfulLabel: {
        type: truthfulLabel,
    },
    productAvailableForCurrentSeason: {
        type: Boolean,
        default: true
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




catalog.index({ name: 1 });
catalog.on('index', function (error) {
    console.log(error.message);
});
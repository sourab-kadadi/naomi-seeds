import * as mongoose from 'mongoose';
import { CropType } from './product-category.interface';


var media = new mongoose.Schema({ 
    filePath:{
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
    });



export const productCategory = new mongoose.Schema ({
    cropName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    cropType: {
        type: String,
        required: true,
        enum: [CropType.VEGETABLE_CROPS, CropType.FIELD_CROPS],
    },
    image : {
        type: media,
        required: true
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
},  { timestamps: true });










productCategory.index({crop: 1});


productCategory.on('index', function(error) {
    console.log(error.message);
  });
import * as mongoose from 'mongoose';
import { dropDownCategory } from './drop-downs.dto';


export const dropDownsGeneral = new mongoose.Schema ({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        ref: 'unique'
    },
    displayName: {
        type: String,
        trim: true,
        required: true,
        ref: 'for display'
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    dropDownFor: {
        type: String,
        required: true,
        enum: [dropDownCategory.PAYMENTS_RECEIVED_CATEGORIZATION, dropDownCategory.SALES_RETURN, dropDownCategory.LEDGER_DISTRIBUTOR,
        dropDownCategory.LEDGER_COMPANY, dropDownCategory.STATE, dropDownCategory.DISTRICT, dropDownCategory.ZONE, dropDownCategory.SEASON, dropDownCategory.FY  
        ],
    },   
    parentDropdownName: {
        type: String,
        ref: 'for subgrouping ex...state and district'
    },   
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},  { timestamps: true });










dropDownsGeneral.index({name: 1});


dropDownsGeneral.on('index', function(error) {
    console.log(error.message);
  });
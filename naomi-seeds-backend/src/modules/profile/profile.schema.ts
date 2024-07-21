import * as mongoose from 'mongoose';
import { ProfileRole } from './profile-role.enum';
import { ACCOUNTINGTYPE } from '../ledger/ledger.dto';

const location = new mongoose.Schema({
  type: { type: String, default: 'Point' },
  coordinates: { type: [Number], require: true, index: '2dsphere' },
});


var accountingInfo = {
  accountNumber: {
    type: String
  },
  accountName: {
    type: String
  },
  openingAccountStatementAmount: {
    type: Number,
  },
  openingAccountStatementAmountCrDr: {
    type: String,
    enum: [ACCOUNTINGTYPE.DR, ACCOUNTINGTYPE.CR],
  },
  openingAccountStatementDate: {
    type: Date,
  }
}

var addressDetails = new mongoose.Schema({
  address1: {
    type: String,
    // required: true,
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
});


export const Profile = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  profileRole: {
    type: String,
    enum: [ProfileRole.COMPANY, ProfileRole.DISTRIBUTOR, ProfileRole.STORAGE],
    required: true,
  },
  joinDate: {
    type: Date
  },
  zone: {
    type: String,
    trim: true,
  },
  firstLevelReportingUserID: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: "reporting to sales officer UserId"
  },
  firstLevelReportingUserName: {
    type: String,
    trim: true,
    ref: "reporting to sales officer User Name"
  },
  secondLevelReportingUserID: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: "reporting to Manager UserId"
  },
  secondLevelReportingUserName: {
    type: String,
    trim: true,
    ref: "reporting to Manager User Name"
  },
  thirdLevelReportingUserID: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: "reporting to Senior Manager UserId"
  },
  thirdLevelReportingUserName: {
    type: String,
    trim: true,
    ref: "reporting to Senior Manager User Name"
  },
  gstin: {
    type: String,
    trim: true,
  },
  location: {
    type: location
  },
  addressDetails: {
    type: addressDetails,
    // required: true,
  },
  completeAddress: {
    type: String,
    // required: true,
  },
  accountingInfo: {
    type: accountingInfo
  },
  status: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    setDefaultsOnInsert: true,
    default: Date.now,
  },
},
  { timestamps: true, strict: true }
);

Profile.index({ companyName: 1 });

Profile.on('index', function (error) {
  console.log(error.message);
});

import * as mongoose from 'mongoose';
import { PERMISSION_CATEGORIES, UserTypeInternalOrExternal } from './roles-permissions.enum';


const pagePermissionLevels = {
  CAN_CREATE: {
    type: Boolean
  },
  CAN_EDIT: {
    type: Boolean
  },
  CAN_READ: {
    type: Boolean
  },
  CAN_DELETE: {
    type: Boolean
  }
}

// make the changes in profile page as well when changed here
const permissionsData = {
  products: {
    type: pagePermissionLevels,
  },
  productPackingSize: {
    type: pagePermissionLevels,
  },
  productsCategory: {
    type: pagePermissionLevels,
  },
  lotData: {
    type: pagePermissionLevels,
  },
  salesOrders: {
    type: pagePermissionLevels,
  },
  requirementData: {
    type: pagePermissionLevels,
  },
  paymentsReceived: {
    type: pagePermissionLevels,
  },
  users: {
    type: pagePermissionLevels,
  },
  profilePage: {
    type: pagePermissionLevels,
  },
  rolesAndPermissionsPageAccess: {
    type: pagePermissionLevels,
  },

}

export const rolesPermissionsSchema = new mongoose.Schema({
  roleName: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  userTypeInternalOrExternal: {
    type: String,
    trim: true,
    enum: [UserTypeInternalOrExternal.ADMIN, 
      UserTypeInternalOrExternal.INTERNAL_USER, UserTypeInternalOrExternal.EXTERNAL_USER]
  },
  roleSeniorityLevel: {
    type: Number,
    unique: true,
    trim: true,
  },
  permissionsData: {
    type: permissionsData,
    ref: "make changes in user page as well"
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  // updatedBy: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     // required: true,
  //     trim: true,
  // },
  // updatedByName: {
  //     type: String,
  //     // required: true,
  //     trim: true,
  // },
  createdAt: {
    type: Date,
    setDefaultsOnInsert: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    // setDefaultsOnInsert: true,
    default: Date.now
  },
}, { timestamps: true, strict: true });


rolesPermissionsSchema.index({ roleName: 1 });

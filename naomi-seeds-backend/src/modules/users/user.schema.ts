import * as mongoose from 'mongoose';
import { UserTypeInternalOrExternal } from '../roles-permissions/roles-permissions.enum';

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
  
  // make the changes in roles and permissions page as well when changed here
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
  

export const user = new mongoose.Schema ({
    firstName: {
        type: String,
        required: true
       },
       lastName: {
        type: String,
        // required: true
       },
    psw: {
        type: String
       },
    email: {
         type: String,
         required: true,
        unique: true
        },
    phoneNo: {
        type: Number,
        required: true,
        // unique: true
       },
    emailIDVerified: {
        type: Boolean,
        default: false
    },
    phoneNoVerified: {
        type: Boolean,
        default: false
    },
    birthDay: {
        type: Date
    },
    userJoiningDate: {
      type: Date
  },
    roles: {
      type: [String],
      // enum: ['ADMIN', 'MANAGER', 'DIRECTOR', 'OPERATIONAL_MANAGER', 'SALES_OFFICER',  'ACCOUNTANT', 'DISTRIBUTOR', 'COMPANY', 'PLANT_MANAGER'],
      required: true,
    },
    roleGroupRefId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true
      },
    permissionsData: {
        type: permissionsData
      },
      userTypeInternalOrExternal: {
        type: String,
        trim: true,
        enum: [UserTypeInternalOrExternal.ADMIN, 
            UserTypeInternalOrExternal.INTERNAL_USER, UserTypeInternalOrExternal.EXTERNAL_USER]
      },
      userLinkToProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'which profile the user is linked'
      },
      userLinkToProfileCompanyName: {
        type: String,
        trim: true,
        ref: 'which profile the user is linked'
      },
      zone: {
        type: String,
        trim: true,
        ref: 'which profile the user is linked'
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
    },
    lastActiveDate: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},{ timestamps: true, strict: true })




user.index({email: 1})
mongoose.model("users", user);
user.on('index', function(error) {
    console.log(error.message);
  });

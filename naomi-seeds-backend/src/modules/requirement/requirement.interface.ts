import { Document } from 'mongoose';
import { DISPATCHEDSTATUS } from './requirement.dto';

export interface RequirementData extends Document {
    readonly toDistributorId: any;
    readonly toDistributorName: string;
    readonly salesPersonId: any;
    readonly salesPersonName: string;
    readonly managerId: any;
    readonly managerName: string;
    readonly requirementDate: Date;
    readonly productId: any;
    readonly productName: string;
    readonly quantity: number;
    readonly quantityUnit: string;
    readonly packingSize: string;
    // readonly packingSizeunit: string;
    readonly dispatchedStatus: DISPATCHEDSTATUS
    // readonly items: ItemDetails[]; 
}

// export interface ItemDetails {
//     readonly productId: any;
//     readonly productName: string;
//     readonly quantity: number;
//     readonly quantityUnit: string;
//     readonly packingSize: number;
//     readonly packingSizeunit: string;
//     readonly dispatchedStatus: DISPATCHEDSTATUS
// }

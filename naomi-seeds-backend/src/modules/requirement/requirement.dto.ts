import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { RequirementData } from "./requirement.interface";


export class CreateRequirementDto {
    toDistributorId: any;
    toDistributorName: string;
    salesPersonId: any;
    salesPersonName: string;
    managerId: any;
    managerName: string;
    items: ItemDetails[];
}


export class ItemDetails {
    productId: any;
    productName: string;
    quantity: number;
    quantityUnit: string;
    packingSize: string;
    // packingSizeunit: string;
    dispatchedStatus: DISPATCHEDSTATUS
}




export class CreateRequirementDto1 {
    toDistributorId: any;
    toDistributorName: string;
    salesPersonId: any;
    salesPersonName: string;
    managerId: any;
    managerName: string;
    requirementDate: Date;
    productId: any;
    productName: string;
    quantity: number;
    quantityUnit: string;
    packingSize: string;
    // packingSizeunit: string;
    dispatchedStatus: DISPATCHEDSTATUS
    // items: ItemDetails[];
}


// export class ItemDetails {
//     productId: any;
//     productName: string;
//     quantity: number;
//     quantityUnit: string;
//     packingSize: number;
//     packingSizeunit: string;
//     dispatchedStatus: DISPATCHEDSTATUS
// }


export enum DISPATCHEDSTATUS {
    // ACTIVE = "ACTIVE",
    // INACTIVE = "INACTIVE",
    PENDING = 'PENDING', 
    DISPATCHED = "DISPATCHED",
    REJECTED = "REJECTED",
}

export enum IRequirementDataMessage {
    createdSuccess = "Requirement Created Successfully",
    updateSuccess = "Requirement Details Updated Successfully",
    deleteSuccess = "Requirement Details Deleted Successfully",
    foundSuccess = "Requirement Details Found Successfully",
    notFound = "Requirement Details Not Found",
    failedUnauthorisedAccessCreate = "Unauthorised Access, Requirement Data Creation failed",
    // failedUnauthorisedAccessUpdate = "Unauthorised Access, Lot Data Updation failed",
    // failedUnauthorisedAccessDelete = "Unauthorised Access, Lot Data deletion failed",
    failedUnauthorisedAccessFind = "Unauthorised Access, Lot Data access failed",

}

export class RequirementDatafindOneByIdRes extends IModuleRes {
    data: RequirementData;
}

export class IRequirementDatafindManyRes extends IModuleRes  {
    data: CreateRequirementDto1[];
    totalCount: number;
}

export enum IDashBoardSummary {
    dashBoardSummarySuccess = 'Dashboard summary fetched Successfully',
    dashBoardSummaryFailed = 'Overview is not available for this period. Please check the selected dates !!!',
    dateError = 'Please select the From and To date correctly !!'
  }
  
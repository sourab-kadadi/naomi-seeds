import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { CropType } from "../catalog/catalog.interface";
import { LotData } from "./lot-data.interface";

export class CreateLotDataDtoInput {
    lotNo: string;
    productId: any;
    productName?: string;
    cropId?: any;
    cropName?: string;
    cropType?: CropType;
    productPackingSizeId: any;
    productData?: productData;
    hsnCode?: string;
    lotProductionDetails: lotProductionDetails;
    truthfulLabel?: truthfulLabel;
    // packingQty?: number;
    // packingUnit?: string;
    // effectiveRatePerKg?: number;
    // packetInvoicePrice?: number;
    // packetMRPPrice?: number;
    lotValidityAvailable: boolean;
    lotDataEditable: boolean;
    status: boolean;
    createdAt: Date;
}



export class UploadLotData {
    lotNo: string;
    productId: any;
    // productName: string;
    // crop: string;
    // cropId: any;
    // cropName: string;
    // cropType: CropType;
    productPackingSizeId: any;
    // productData: productData;
    lotProductionDetails: lotProductionDetails;
    // truthfulLabel: truthfulLabel;
    // packingQty: number;
    // packingUnit: string;
    // effectiveRatePerKg: number;
    // packetInvoicePrice: number;
    // packetMRPPrice: number;
    lotValidityAvailable: boolean;
    status: boolean;
    // createdAt: Date;
}









// export class UpdateLotDataQuantityAvailabilityDto {
//     availabilityStatus: EItemStatus;
// }




export interface productData {
    image: Media,
    morphologicalCharacters: MorphologicalCharacters[],
    specialFeaturesUSPS: SpecialFeatures[],
}  



export interface SpecialFeatures {
   name: string;
 }

export interface Media {
    filePath: string,
    type: string,
}

export interface MorphologicalCharacters {
  key: string,
  value: string,
}

export interface truthfulLabel {
  germinationInPercentageMin: number,
  geneticPurityInPercentageMin: number,
  physicalPuritySeedInPercentageMin: number,
  inertMatterNotMoreThanPercentMax: number,
  moistureInPercentageMax: number,
  otherCropSeedsNotMoreThanPerKgMax: number,
  weedSeedsPerKgMax: number,
  maleSeedUsed: string,
  femaleSeedUsed: string,
}

export interface lotProductionDetails {
    processingPlantNo: string,
    totalQtyOfLotsInKgs: number,
    numberOfPackets: number,
    dateOfTest: Date,
    lableNoFrom: number,
    labelNoTo: number,
    missingNo: number,
    dateOfPacking: Date,
    validUpto: Date,
    seedGrowerNameAndAddress: String,
    seedPurchasedFrom: string,
    sowingSeason: string,
    seedProductionSupervisor: string,
    seedProcessingSupervisor: string,
 }


//   export enum EItemStatus {
//     QUANTITYAVAILABLE = 'QUANTITYAVAILABLE', 
//     NOQUANTITY = "NOQUANTITY",
// }



export enum EItemStatus {
    // ACTIVE = "ACTIVE",
    // INACTIVE = "INACTIVE",
    QUANTITYAVAILABLE = 'QUANTITYAVAILABLE', 
    NOQUANTITY = "NOQUANTITY",
}






export enum ILotDataMessage {
    createdSuccess = "Lot Created Successfully",
    updateSuccess = "Lot Details Updated Successfully",
    deleteSuccess = "Lot Details Deleted Successfully",
    foundSuccess = "Lot Details Found Successfully",
    notFound = "Lot Details Not Found",
    failedUnauthorisedAccessCreate = "Unauthorised Access, Lot Data Creation failed",
    failedUnauthorisedAccessUpdate = "Unauthorised Access, Lot Data Updation failed",
    failedUnauthorisedAccessDelete = "Unauthorised Access, Lot Data deletion failed",
    failedUnauthorisedAccessFind = "Unauthorised Access, Lot Data access failed",

}

export class LotDatafindOneByIdRes extends IModuleRes {
    data: LotData;
}

export class ILotDatafindManyRes extends IModuleRes  {
    data: LotData[];
    totalCount: number;
}

export class ILotDatafindManyDropDownRes extends IModuleRes {
    data: LotData[];
}

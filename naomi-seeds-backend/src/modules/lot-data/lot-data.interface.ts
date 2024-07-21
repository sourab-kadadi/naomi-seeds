import { Document } from 'mongoose';
import { CropType } from '../catalog/catalog.interface';

export interface LotData extends Document {
    readonly lotNo: string;
    readonly productId: any;
    readonly productName: string;
    readonly crop: string;
    readonly cropId: any;
    readonly cropName: string;
    readonly cropType: CropType;
    readonly productPackingSizeId: any;
    readonly productData: productData;
    readonly hsnCode: string;
    readonly lotProductionDetails: lotProductionDetails;
    readonly truthfulLabel: truthfulLabel;
    // readonly packingQty: number;
    // readonly packingUnit: string;
    // readonly effectiveRatePerKg: number;
    // readonly packetInvoicePrice: number;
    // readonly packetMRPPrice: number;
    readonly lotValidityAvailable: boolean;
    readonly lotDataEditable: boolean;
    readonly status: boolean;
    readonly createdAt: Date;

}

export interface productData {
    readonly image: Media,
    readonly morphologicalCharacters: MorphologicalCharacters[],
    readonly specialFeaturesUSPS: SpecialFeatures[],
}  



export interface SpecialFeatures {
    name: string;
  }

 export interface Media {
    readonly filePath: string,
    readonly type: string,
}

export interface MorphologicalCharacters {
  readonly key: string,
  readonly value: string,
}

export interface truthfulLabel {
  readonly germinationInPercentageMin: number,
  readonly geneticPurityInPercentageMin: number,
  readonly physicalPuritySeedInPercentageMin: number,
  readonly inertMatterNotMoreThanPercentMax: number,
  readonly moistureInPercentageMax: number,
  readonly otherCropSeedsNotMoreThanPerKgMax: number,
  readonly weedSeedsPerKgMax: number,
  readonly maleSeedUsed: string,
  readonly femaleSeedUsed: string,
}

export interface lotProductionDetails {
    readonly processingPlantNo: string,
    readonly totalQtyOfLotsInKgs: number,
    readonly numberOfPackets: number,
    readonly dateOfTest: Date,
    readonly lableNoFrom: number,
    readonly labelNoTo: number,
    readonly missingNo: number,
    readonly dateOfPacking: Date,
    readonly validUpto: Date,
    readonly seedGrowerNameAndAddress: String,
    readonly seedPurchasedFrom: string,
    readonly sowingSeason: string,
    readonly seedProductionSupervisor: string,
    readonly seedProcessingSupervisor: string,
  }


  export enum EItemStatus {
    QUANTITYAVAILABLE = 'QUANTITYAVAILABLE', 
    NOQUANTITY = "NOQUANTITY",
}
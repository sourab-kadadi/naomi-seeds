import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { Catalog, CropType } from "./catalog.interface";

export class CreateCatalogDto {
    @IsNotEmpty()
    name: string;
    cropId: any;
    cropName: string;
    cropType: CropType;
    image: Media;
    hsnCode: string;
    morphologicalCharacters: MorphologicalCharacters[];
    specialFeaturesUSPS: SpecialFeatures[];
    truthfulLabel: truthfulLabel;
    productAvailableForCurrentSeason?: boolean;
    status?: boolean;
}

export class Media {
    filePath: string;
    type: string;
}



export class UpdateCatalogDto {
    @IsNotEmpty()
    name: string;
    cropId: any;
    crop: string;
    cropType: CropType;
    image: Media;
    hsnCode: string;
    morphologicalCharacters: MorphologicalCharacters[];
    specialFeaturesUSPS: SpecialFeatures[];
    truthfulLabel: truthfulLabel;
    productAvailableForCurrentSeason?: boolean;
    status?: boolean;
}


export class truthfulLabel {
    germinationInPercentageMin: number;
    geneticPurityInPercentageMin: number;
    physicalPuritySeedInPercentageMin: number;
    inertMatterNotMoreThanPercentMax: number;
    moistureInPercentageMax: number;
    otherCropSeedsNotMoreThanPerKgMax: number;
    weedSeedsPerKgMax: number;
    maleSeedUsed: string;
    femaleSeedUsed: string;
}


export class MorphologicalCharacters {
    key: string;
    value: string
}

export class SpecialFeatures {
    name: string;
}


// export enum EItemStatus {
//     ACTIVE = "ACTIVE",
//     INACTIVE = "INACTIVE",
//     NOQUANTITY = "NOQUANTITY",
//     KILL = "KILL"
// }

export enum ICatalogMessage {
    createdSuccess = "Product Created Successfully",
    updateSuccess = "Product Details Update Successfully",
    deleteSuccess = "Product Details Deleted Successfully",
    foundSuccess = "Product Found Successully",
    notFound = "Product Not Found"
}

export class ICatalogfindManyRes extends IModuleRes {
    data: Catalog[];
    totalCount: number;
}

export class ICatalogfindManyDropDownRes extends IModuleRes {
    data: Catalog[];
}

export class CatalogfindOneByIdRes extends IModuleRes {
    data: Catalog;
}


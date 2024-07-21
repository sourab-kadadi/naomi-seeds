import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { ProductCategory } from "./product-category.interface";
// import { Catalog, CropType } from "./catalog.interface";

export class CreateProductCategoryDto {
    @IsNotEmpty()
    cropName: string;
     @IsNotEmpty()
     cropType: string;
     image: Media;
     status?: boolean;    
    }

export class Media {
     filePath: string;
     type: string;
}



export class UpdateProductCategoryDto {
    @IsNotEmpty()
    cropName: string;
     @IsNotEmpty()
     cropType: string;
     image: Media;
     status?: boolean;    
}




export class ProductCategoryfindOneByIdRes extends IModuleRes {
    data: ProductCategory;
}

export enum EItemStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum IProductCategoryMessage {
    createdSuccess = "Details Created Successfully",
    updateSuccess = "Details Update Successfully",
    deleteSuccess = "Details Deleted Successfully",
    foundSuccess = "Details Found Successully",
    notFound = "Details Not Found"
}

export class IProductCategoryfindManyRes extends IModuleRes  {
    data: ProductCategory[];
    totalCount: number;
}

export class IProductCategoryDropDownRes extends IModuleRes  {
    data: ProductCategory[];
}


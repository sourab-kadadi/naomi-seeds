
import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { ProductPackingSizes } from "./product-packing-sizes.interface";


export class CreatePackingSizesDto {
      productId: any;
      packingQty: number;
      packingUnit: PackingSizes;
      // packingQtyUnitDisplay: string;
      effectiveRatePerKg: number;
      packetInvoicePrice: number;
      packetMRPPrice?: number;
      lockedForEditingExceptAdmin?: boolean;
      status?: boolean;
}


export class UpdatePackingSizesDto {
  productId: any;
  packingQty: number;
  packingUnit: PackingSizes;
  // packingQtyUnitDisplay: string;
  effectiveRatePerKg: number;
  packetInvoicePrice: number;
  packetMRPPrice?: number;
  lockedForEditingExceptAdmin?: boolean;
  status?: boolean;
}


export enum PackingSizes {
    GMS = "GMS",
    KGS = "KGS",
    QUINTAL = "QUINTAL",
    TONNE = "TONNE"
  }


 export enum IProductPackingSizeMessage {
    createdSuccess = "Packing Size Created Successfully",
    updateSuccess = "Packing Size Details Update Successfully",
    deleteSuccess = "Packing Size Details Deleted Successfully",
    foundSuccess = "Packing Size Found Successully",
    notFound = "Packing Size Not Found"
}

export class IProductPackingSizesfindManyRes extends IModuleRes {
    data: CreatePackingSizesDto[];
    totalCount: number;
}

export class ProductPackingSizesfindOneByIdRes extends IModuleRes {
    data: CreatePackingSizesDto;
}

export class IProductPackingSizesDropDownRes extends IModuleRes  {
  data: ProductPackingSizes[];
}

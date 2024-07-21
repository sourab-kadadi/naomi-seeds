import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { DropDownsGeneral } from "./drop-downs.interface";

export class CreateDropDownsGeneralDto {
    @IsNotEmpty()
     name: string;
     displayName: string;
     status: boolean;
     dropDownFor: string;
     parentDropdownName?: string
    }

export class UpdateDropDownsGeneralDto {
    @IsNotEmpty()
     name: string;
     displayName: string;
     status: boolean;
     dropDownFor: string;
     parentDropdownName?: string;
}


export enum dropDownCategory {
    PAYMENTS_RECEIVED_CATEGORIZATION = "PAYMENTS_RECEIVED_CATEGORIZATION",
    SALES_RETURN = "SALES_RETURN",
    LEDGER_DISTRIBUTOR = "LEDGER_DISTRIBUTOR",
    LEDGER_COMPANY = "LEDGER_COMPANY",
    STATE = "STATE",
    DISTRICT = "DISTRICT",
    ZONE = "ZONE",
    SEASON = "SEASON",
    FY = "FY"
  }
  

export class DropDownfindOneByIdRes extends IModuleRes {
    data: DropDownsGeneral;
}


export enum IMessage {
    createdSuccess = "Created Successfully",
    updateSuccess = "Details Update Successfully",
    deleteSuccess = "Details Deleted Successfully",
    foundSuccess = "Found Successully",
    notFound = "Not Found"
}
export class IDropDownfindManyRes extends IModuleRes  {
    data: CreateDropDownsGeneralDto[];
    totalCount: number;
}

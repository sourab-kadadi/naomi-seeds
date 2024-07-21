import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { LedgerItem } from "./ledger.interface";
// import { LotData } from "./lot-data.interface";


export class createLedgerStatementDto {
    @IsNotEmpty()
    partyProfileId: any;
    @IsNotEmpty()
    partyName: string;
    oppositePartyProfileId: any;
    oppositePartyName: string;
    txnDate:  Date;
    @IsNotEmpty()   
    txnRefId: any;
    @IsNotEmpty()    
    txnRefCollection: String;
    accountingType:  String;  
    particularType:  String;   
    vchType?:  String;   
    vchNumber?:  String;
    narration?:  String;   
    comment?:  String;  
    @IsNotEmpty()
    amount:  Number;    
}


// details not captured correctly in this check again
export class createLedgerStatementDtoCredit {
    @IsNotEmpty()
    partyProfileId: any;
    @IsNotEmpty()
    txnDate:  Date;
    @IsNotEmpty()   
    txnRefId: any;
    @IsNotEmpty()    
    txnRefCollection: String;
    accountingType:  String;  
    particularType:  String;   
    vchType?:  Number;   
    vchNumber?:  String;
    narration?:  String;   
    comment:  String;  
    @IsNotEmpty()
    amount:  Number;    
    createdAt:  Date;
}

export class updateLedgerStatementDto {
    @IsNotEmpty()
    partyProfileId: any;
    @IsNotEmpty()
    txnDate:  Date;
    @IsNotEmpty()   
    txnRefId: any;
    @IsNotEmpty()    
    txnRefCollection: String;
    accountingType:  String;  
    particularType:  String;   
    vchType:  Number;   
    vchNumber:  String;
    narration:  Number;   
    comment:  Date;  
    @IsNotEmpty()
    amount:  Number;    
    createdAt:  Date;
}


export enum ACCOUNTINGTYPE {
    DR = 'DR', 
    CR = 'CR',
}

export enum PARTICULARTYPE {
    SALES = 'SALES', 
    PURCHASES = 'PURCHASES', //in ipt and also normal purchases
    SALES_RETURN = 'SALES_RETURN', //for company
    SALES_RETURN_TO_COMPANY = 'SALES_RETURN_TO_COMPANY', //for distributor
    PAYMENT_MADE = 'PAYMENT_MADE',  // for distributor
    PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
    IPT_SALES = 'IPT_SALES',    //in IPT for company
    IPT_SALES_RETURN = 'IPT_SALES_RETURN',  //in IPT for company
    IPT_GOODS_TRANSFER = 'IPT_GOODS_TRANSFER',    // In IPT from distributor
    DISCOUNTS_GIVEN = 'DISCOUNTS_GIVEN', 
    DISCOUNTS_RECEIVED = 'DISCOUNTS_RECEIVED', 
}



export enum ILedgerDataMessage {
    createdSuccess = "Ledger account item Created Successfully",
    updateSuccess = "Ledger account item Updated Successfully",
    deleteSuccess = "Ledger account item Deleted Successfully",
    foundSuccess = "Ledger account item Found Successfully",
    notFound = "Ledger account item Not Found",
    failedUnauthorisedAccessCreate = "Unauthorised Access, Ledger account Creation failed",
    // failedUnauthorisedAccessUpdate = "Unauthorised Access, Lot Data Updation failed",
    // failedUnauthorisedAccessDelete = "Unauthorised Access, Lot Data deletion failed",
    // failedUnauthorisedAccessFind = "Unauthorised Access, Lot Data access failed",

}

export class LedgerfindOneByIdRes extends IModuleRes {
    data: LedgerItem;
}

export class ILedgerDatafindManyRes extends IModuleRes  {
    data: createLedgerStatementDto[];
    info: any;
    totalCount: number;
}

// export class ILedgerSaveRes {
//     ledgerId: string;
//     invoiceNumber: string;
//     invoicePdfFileName: string;
//   }

export enum IDashBoardSummary {
    dashBoardSummarySuccess = 'Dashboard summary fetched Successfully',
    dashBoardSummaryFailed = 'Overview is not available for this period. Please check the selected dates !!!',
    dateError = 'Please select the From and To date correctly !!'
  }
  




  
  export class IDashboardSummaryRes extends IModuleRes {
    data: any;
  }
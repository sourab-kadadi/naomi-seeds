import { Document } from 'mongoose';


export interface LedgerItem extends Document {
    readonly partyProfileId: any;
    readonly txnDate:  Date;   
    readonly txnRefId: any;    
    readonly txnRefCollection: String;
    readonly accountingType:  String;  
    readonly particularType:  String;   
    readonly vchType :  String;   
    readonly vchNumber:  String;
    readonly narration:  String;   
    readonly comment:  Date;  
    readonly amount:  Number;    
    readonly createdAt:  Date;
}
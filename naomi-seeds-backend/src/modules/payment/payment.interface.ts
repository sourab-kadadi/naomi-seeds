import { Document } from 'mongoose';

export interface Payment extends Document {
    readonly distributorId: any;
    readonly distributorName: string;
    readonly salesPersonId: any;
    readonly salesPersonName: string;
    readonly managerId: any;
    readonly managerName: string;
    readonly adminId: any;
    readonly adminName: string;
    readonly amount: number;
    readonly categoryType: string;
    readonly categoryTypeId: string;
    readonly salesOfficerNote: string;
    readonly accountantNote: string;
    readonly paymentReceivedDate: Date;
    readonly image: Media;
    readonly approvalStatus: String; 
    readonly approvalStatusUpdatedByUserId: String;
    readonly approvalStatusUpdatedByUserName: String;
    readonly createdAt: Date;
}

export interface Media {
    readonly filePath: string,
    // readonly type: string,
}
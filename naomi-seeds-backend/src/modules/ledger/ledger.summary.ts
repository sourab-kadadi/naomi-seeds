export class ledgerSummaryDistributor {
    profileId: string;
    profileName?: string;
    dateFrom?: Date;
    dateTo?: Date;
    grossPurchases: number;
    creditNoteReceived: number;
    creditNoteReceivedForIptTransfer: number;
    creditNoteReceivedForSalesReturn: number;
    netPurchases: number;
    otherCredits: number;
    otherDebits: number;
    paymentsMade: number;
    discountReceived: number;
    pendingPayable: number;
}
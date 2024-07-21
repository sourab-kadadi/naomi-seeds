// export class project =    {
//                 "partyName": 1,
//                 "txnDate": 1,
//                 "accountingType": 1,
//                 "amount": 1,
//                 "narration": 1,
//                 "txnRefId": 1,
//                 "particularType": 1,
//                 "vchType": 1,
//                 "vchNumber": 1,
//                 "comment": 1,
//                 "openingAccountStatementAmount": 1, 
//                 "openingAccountStatementDate" : 1,
//                 "ipt_details.items": 1,
//                 // "runningBalance": 1,
//               //   "runningBalance": {
//               //     $sum: { // calculate the sum of all "total" values
//               //         $cond: {
//               //             if: { $eq: [ "$accountingType", "Dr" ] }, // in case of "DEBIT", we want the stored value for "total"
//               //             then: "$amount", 
//               //             else: { $multiply: [ "$amount", -1 ] } // otherwise we want the stored value for "total" times -1
//               //         }
//               //     }
//               // }
//               }
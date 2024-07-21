import { Document } from 'mongoose';
import { PackingSizes } from './product-packing-sizes.dto';

export interface ProductPackingSizes extends Document {
  readonly productId: any;
  readonly packingQty: number;
  readonly packingUnit: PackingSizes;
  // readonly packingQtyUnitDisplay: string;
  readonly effectiveRatePerKg: number;
  readonly packetInvoicePrice: number;
  readonly packetMRPPrice?: number;
  readonly lockedForEditingExceptAdmin?: boolean;
  readonly status?: boolean;
}



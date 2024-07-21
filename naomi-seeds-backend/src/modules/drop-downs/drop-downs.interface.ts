import { Document } from 'mongoose';

export interface DropDownsGeneral extends Document {
  readonly name: string;
  readonly displayName: string;
  readonly status: boolean;
  readonly dropDownFor: string;
  readonly parentDropdownName?: string;
  readonly createdAt: string;  
}




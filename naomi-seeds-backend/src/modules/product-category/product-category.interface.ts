import { Document } from 'mongoose';

export interface ProductCategory extends Document {
  readonly cropName: string;
  readonly image: Media;
  readonly status: boolean;
  readonly cropType: CropType;
  readonly createdAt: string;  
}


export enum CropType {
  FIELD_CROPS = "Field Crops",
  VEGETABLE_CROPS = "Vegetable Crops"
}


export interface Media {
    readonly filePath: string,
    readonly type: string,
}


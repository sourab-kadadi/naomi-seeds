import { Document } from 'mongoose';

export interface Catalog extends Document {
  readonly name: string;
  readonly cropId: any;
  readonly crop: string;
  readonly cropType: CropType;
  readonly image: Media;
  readonly hsnCode: string;
  readonly morphologicalCharacters: MorphologicalCharacters[];
  readonly specialFeaturesUSPS: SpecialFeatures[];
  readonly truthfulLabel: truthfulLabel;
  readonly productAvailableForCurrentSeason: boolean;
  readonly status: boolean;
  readonly createdAt: string;  
}


export interface SpecialFeatures {
  name: string;
}

export enum CropType {
  FIELD_CROPS = "Field Crops",
  VEGETABLE_CROPS = "Vegetable Crops"
}


export interface Media {
    readonly filePath: string,
    readonly type: string,
}

export interface MorphologicalCharacters {
  readonly key: string,
  readonly value: string,
}

export interface truthfulLabel {
  readonly germinationInPercentageMin: number,
  readonly geneticPurityInPercentageMin: number,
  readonly physicalPuritySeedInPercentageMin: number,
  readonly inertMatterNotMoreThanPercentMax: number,
  readonly moistureInPercentageMax: number,
  readonly otherCropSeedsNotMoreThanPerKgMax: number,
  readonly weedSeedsPerKgMax: number,
  readonly maleSeedUsed: string,
  readonly femaleSeedUsed: string,
}


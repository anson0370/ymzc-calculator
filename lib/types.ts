export type Vegetable = {
  name: string;
  harvestTime: number;
  waterKeepTime: number;
}

export type ClacResult1 = { fullWaterTime: Date, oneWaterTime: Date, lastWaterTime: Date };
export type ClacResult2 = { fullWaterTime: Date, lastWaterTime: Date };

export type ClacHistoryItem = ({
  type: 'R1',
  result: ClacResult1,
} | {
  type: 'R2',
  result: ClacResult2,
}) & {
  vegetable: string;
  baseTime: Date;
  comment?: string;
}

export type ClacHistories = ClacHistoryItem[];

export type Vegetable = {
  name: string;
  harvestTime: number;
  waterKeepTime: number;
}

export type ClacResult1 = {
  // 满水收获时间
  fullWaterTime: Date,
  // 只浇第一水收获时间
  oneWaterTime: Date,
  // 只浇第一水和最后一水收获时间
  twoWaterTime?: Date,
  // 倒二浇时间
  lastWaterTime: Date,
  // 浇水序列
  waterTimes?: Date[],
};
export type ClacResult2 = {
  // 满水收获时间
  fullWaterTime: Date,
  // 只浇最后一水收获时间
  endWaterTime?: Date,
  // 倒二浇时间
  lastWaterTime: Date,
  // 浇水序列
  waterTimes?: Date[],
};

export type ClacHistoryItem = ({
  type: 'R1',
  result: ClacResult1,
} | {
  type: 'R2',
  result: ClacResult2,
} | {
  type: 'R3',
  result: ClacResult1,
}) & {
  vegetable: string;
  baseTime: Date;
  comment?: string;
}

export type ClacHistories = ClacHistoryItem[];

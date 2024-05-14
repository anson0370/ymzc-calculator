export function realHarvestTime(harvestTime: number, waterLackTime: number, invalidWaterTime?: number): number {
  if (invalidWaterTime != null) {
    // 如果剩余时间已经不能浇水了，那就直接返回剩余时间
    if (harvestTime + waterLackTime < invalidWaterTime) {
      return harvestTime;
    }
  }
  return Math.round((harvestTime - (waterLackTime * 0.25)) / 1.25);
};

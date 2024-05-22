export function calcRealHarvestTime(harvestTime: number, waterLackTime: number, invalidWaterTime?: number): number {
  if (invalidWaterTime != null) {
    // 如果剩余时间已经不能浇水了，那就直接返回剩余时间
    if (harvestTime + waterLackTime < invalidWaterTime) {
      return harvestTime;
    }
  }
  return Math.round((harvestTime - (waterLackTime * 0.25)) / 1.25);
};

export function calcWaterList(realHarvestTime: number, waterLackTime: number, waterKeepTime: number): number[] {
  const invalidWaterTime = Math.floor(waterKeepTime / 10);

  const result: number[] = [];
  let lastWaterTime = waterKeepTime - waterLackTime;

  do {
    // 如果超过了倒二浇时间，那就用倒二浇时间和最后收获时间，并跳出循环
    if (lastWaterTime > (realHarvestTime - invalidWaterTime)) {
      // 如果没超过最后收获时间，就要加上倒二浇时间，否则直接加上最后收获时间就行了
      if (lastWaterTime < realHarvestTime) {
        result.push(realHarvestTime - invalidWaterTime);
      }
      result.push(realHarvestTime);
      break;
    }
    result.push(lastWaterTime);
    lastWaterTime += waterKeepTime;
  } while (true);

  return result;
}

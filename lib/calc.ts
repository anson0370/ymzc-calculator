export function realHarvestTime(harvestTime: number, waterKeepTime: number): number {
  return Math.round((harvestTime - (waterKeepTime * 0.25)) / 1.25);
};

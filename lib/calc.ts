export function realHarvestTime(harvestTime: number, waterLackTime: number): number {
  return Math.round((harvestTime - (waterLackTime * 0.25)) / 1.25);
};

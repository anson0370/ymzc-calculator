import { Vegetable } from "./types";

const timebase60 = {
  harvestTime: 60,
  waterKeepTime: 20,
};

const timebase360 = {
  harvestTime: 360,
  waterKeepTime: 120,
};

const timebase720 = {
  harvestTime: 720,
  waterKeepTime: 240,
};

const timebase960 = {
  harvestTime: 960,
  waterKeepTime: 320,
};

const timebase1920 = {
  harvestTime: 1920,
  waterKeepTime: 640,
};

export const vegetables: Vegetable[] = [
  {
    name: '1小时作物',
    ...timebase60,
  }, {
    name: '6小时作物',
    ...timebase360,
  }, {
    name: '12小时作物',
    ...timebase720,
  }, {
    name: '16小时作物（金币作物）',
    ...timebase960,
  }, {
    name: '1天8小时作物',
    ...timebase1920,
  },
];

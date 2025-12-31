
export enum AppScene {
  START = 0,
  CHOOSE_TRAVEL = 1,
  SKY_TRAVEL = 2,
  ARRIVAL_LAHORE = 3,
  MOON_GARDEN = 4,
  FOOD_MOMENT = 5,
  MINI_GAME = 6,
  PASSWORD = 7,
  DUA_GENERATOR = 8,
  SAME_CITY = 9,
  LETTER = 10,
  THREE_WISHES = 11,
  TIME_BRIDGE = 12,
  TREASURE_BOX = 13,
  CREDITS = 14,
  FINAL = 15
}

export type TravelMode = 'plane' | 'bike' | 'car' | 'train';

export interface Dua {
  text: string;
}

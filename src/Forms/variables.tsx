export const multiplier: Mult = {
  annually: 1 / 12,
  monthly: 1,
  weekly: 52 / 12,
  daily: 365 / 12,
};
export interface Mult {
  annually: number;
  monthly: number;
  weekly: number;
  daily: number;
}
export interface CapRates {
  start: number;
  end: number;
  england: Max;
  scotland: Max;
  northern_ireland: Max;
}
export interface Max {
  max_week: number;
  max_total: number;
}
export const rates = new Array<CapRates>(
  {
    start: new Date(2021, 3, 6).getTime(),
    end: new Date(2022, 3, 5).getTime(),
    england: {
      max_week: 544,
      max_total: 16320,
    },
    scotland: {
      max_week: 544,
      max_total: 16320,
    },
    northern_ireland: {
      max_week: 566,
      max_total: 16980,
    },
  },
  {
    start: new Date(2022, 3, 6).getTime(),
    end: new Date(2023, 3, 5).getTime(),
    england: {
      max_week: 571,
      max_total: 17130,
    },
    scotland: {
      max_week: 571,
      max_total: 17130,
    },
    northern_ireland: {
      max_week: 566,
      max_total: 16980,
    },
  }
);

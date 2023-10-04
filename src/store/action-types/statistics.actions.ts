import { IStatistics } from '../../interfaces/kpis.interface';

export enum StatisticsActions {
  FETCH_STATISTICS = "FETCH_STATISTICS",
}

export type IStatisticsActions = {
  type: StatisticsActions;
  payload: Partial<IStatistics> | object | string | number | [];
};

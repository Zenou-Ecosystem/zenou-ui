import { IStatistics } from '../../interfaces/kpis.interface';
import { IStatisticsActions, StatisticsActions } from '../action-types/statistics.actions';

export const statisticsReducer = (state: IStatistics | null = null, action: IStatisticsActions) => {
  switch (action.type) {
    case StatisticsActions.FETCH_STATISTICS:
      state = action.payload as IStatistics;
      break;
  }
  return state;
}

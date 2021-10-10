import { CsvData } from '../../helpers/parse-data';
import { DiffState, Sides } from '../useDiffData';
import { addData } from './addData';
import { diffData } from './diffData';
import { organizeData } from './organizeData';
import { removeAllData } from './removeAllData';
import { removeData } from './removeData';

export enum DiffActionTypes {
  AddData = 'ADD_DATA',
  LoadingData = 'LOADING_DATA',
  RemoveAllData = 'REMOVE_ALL_DATA',
  RemoveData = 'REMOVE_DATA',
  UpdateDateRange = 'UPDATE_DATE_RANGE',
  UpdateTitle = 'UPDATE_TITLE',
}

type DiffActions =
  | { type: DiffActionTypes.LoadingData }
  | { type: DiffActionTypes.AddData; side: Sides; data: CsvData[] }
  | { type: DiffActionTypes.RemoveAllData; side: Sides }
  | { type: DiffActionTypes.RemoveData; side: Sides; data: CsvData }
  | { type: DiffActionTypes.UpdateDateRange; range: DiffState['dateRange'] }
  | { type: DiffActionTypes.UpdateTitle; side: Sides; title: string };

export type DiffReducer = (state: DiffState, action: DiffActions) => DiffState;
const reducer: DiffReducer = (state, action) => {
  switch (action.type) {
    case DiffActionTypes.LoadingData:
      return { ...state, loading: true };

    case DiffActionTypes.AddData:
      const added = addData(state, action.side, action.data);
      const organizedAdded = organizeData(added, action.side);
      return diffData(organizedAdded);

    case DiffActionTypes.RemoveData:
      const removed = removeData(state, action.side, action.data);
      const organizedRemoved = organizeData(removed, action.side);
      return diffData(organizedRemoved);

    case DiffActionTypes.RemoveAllData:
      const removeAll = removeAllData(state, action.side);
      return diffData(removeAll);

    case DiffActionTypes.UpdateTitle:
      return {
        ...state,
        [action.side]: { ...state[action.side], title: action.title },
      };

    case DiffActionTypes.UpdateDateRange:
      const newDateState = { ...state, dateRange: action.range };
      return diffData(newDateState);
  }
};

export default reducer;

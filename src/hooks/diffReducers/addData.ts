import { CsvData } from '../../helpers/parse-data';
import { DiffState, Sides } from '../useDiffData';

export const addData = (
  state: DiffState,
  side: Sides,
  data: CsvData[],
): DiffState => {
  const newSideData = [...state[side].data, ...data];
  return {
    ...state,
    [side]: { ...state[side], data: newSideData },
    loading: false,
  };
};

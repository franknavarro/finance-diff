import { CsvData } from '../../helpers/parse-data';
import { DiffState, Sides } from '../useDiffData';

export const removeData = (
  state: DiffState,
  side: Sides,
  data: CsvData,
): DiffState => {
  const newSideData = [...state[side].data];
  const index = newSideData.findIndex((d) => {
    const check =
      d.amount === data.amount && d.description === data.description;
    if (!d.date || !data.date) return check;
    return check && d.date === data.date;
  });

  if (index === -1) return state;

  newSideData.splice(index, 1);
  return {
    ...state,
    [side]: { ...state[side], data: newSideData },
    loading: false,
  };
};

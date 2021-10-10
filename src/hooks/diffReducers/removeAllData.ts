import { sideTitle } from '../../helpers/sideTitle';
import { DiffState, Sides } from '../useDiffData';

export const removeAllData = (state: DiffState, side: Sides): DiffState => ({
  ...state,
  [side]: { ...state[side], data: [], title: sideTitle(side) },
  loading: false,
});

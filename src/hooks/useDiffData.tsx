import diffReducer, { DiffReducer } from './diffReducers';
import {
  createContext,
  Dispatch,
  FC,
  ReducerAction,
  useContext,
  useReducer,
} from 'react';
import { CsvData } from '../helpers/parse-data';
import { sideTitle } from '../helpers/sideTitle';
import { DateRange } from '@mui/lab/DateRangePicker';

export enum Sides {
  Left = 'left',
  Right = 'right',
}

export enum DiffTypes {
  Added,
  Removed,
  Same,
}

export interface DiffCsvData extends CsvData {
  diff: DiffTypes;
}

type SidesData = {
  [key in Sides]: {
    title: string;
    data: CsvData[];
    diff: DiffCsvData[];
  };
};

export interface DiffState extends SidesData {
  loading: boolean;
  diffCount: number;
  dateRange: DateRange<Date>;
}

const DEFAULT_DIFF_STATE = (): DiffState => ({
  [Sides.Left]: { title: sideTitle(Sides.Left), data: [], diff: [] },
  [Sides.Right]: { title: sideTitle(Sides.Right), data: [], diff: [] },
  loading: false,
  diffCount: 0,
  dateRange: [null, null],
});

interface DiffContextType extends DiffState {
  dispatch: Dispatch<ReducerAction<DiffReducer>>;
}

const DiffContext = createContext<DiffContextType>({
  ...DEFAULT_DIFF_STATE(),
  dispatch: () => {},
});

export const useDiffData = () => {
  return useContext(DiffContext);
};

export const DiffProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(diffReducer, null, DEFAULT_DIFF_STATE);
  return (
    <DiffContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </DiffContext.Provider>
  );
};

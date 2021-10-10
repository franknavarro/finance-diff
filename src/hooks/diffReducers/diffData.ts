import { diffArrays } from 'diff';
import { CsvData } from '../../helpers/parse-data';
import { DiffCsvData, DiffState, DiffTypes, Sides } from '../useDiffData';

type DiffReducer = {
  left: DiffCsvData[];
  leftStart: number;
  right: DiffCsvData[];
  rightStart: number;
  diffCount: number;
};

const fillEmptyDiff = (amount: number) =>
  Array(amount).fill({
    amount: 0,
    description: '',
    date: undefined,
    diff: DiffTypes.Removed,
  });

const addDiffToData = (
  data: CsvData[],
  startIndex: number,
  endIndex: number,
  type: DiffTypes,
): DiffCsvData[] =>
  data
    .slice(startIndex, endIndex)
    .map<DiffCsvData>((d) => ({ ...d, diff: type }));

export const diffData = (state: DiffState): DiffState => {
  const [startDate, endDate] = state.dateRange;
  const filterDatesData = (data: CsvData) => {
    const date = data.date?.getTime();
    if (!startDate || !endDate || !date) return true;
    return date <= endDate.getTime() && date >= startDate.getTime();
  };

  let left = state[Sides.Left].data.filter(filterDatesData);
  let right = state[Sides.Right].data.filter(filterDatesData);

  const diff = diffArrays(left, right, {
    comparator: (left, right) => left.amount === right.amount,
  });

  const newDiffs = diff.reduce<DiffReducer>(
    (prev, data) => {
      if (data.count) {
        if (data.added) {
          prev.diffCount += data.count;
          const leftFill = fillEmptyDiff(data.count);
          const rightEnd = prev.rightStart + data.count;
          const rightFill = addDiffToData(
            right,
            prev.rightStart,
            rightEnd,
            DiffTypes.Added,
          );

          return {
            ...prev,
            left: [...prev.left, ...leftFill],
            right: [...prev.right, ...rightFill],
            rightStart: rightEnd,
          };
        } else if (data.removed) {
          prev.diffCount += data.count;
          const rightFill = fillEmptyDiff(data.count);
          const leftEnd = prev.leftStart + data.count;
          const leftFill = addDiffToData(
            left,
            prev.leftStart,
            leftEnd,
            DiffTypes.Added,
          );

          return {
            ...prev,
            leftStart: leftEnd,
            left: [...prev.left, ...leftFill],
            right: [...prev.right, ...rightFill],
          };
        }

        const rightEnd = prev.rightStart + data.count;
        const rightFill = addDiffToData(
          right,
          prev.rightStart,
          rightEnd,
          DiffTypes.Same,
        );
        const leftEnd = prev.leftStart + data.count;
        const leftFill = addDiffToData(
          left,
          prev.leftStart,
          leftEnd,
          DiffTypes.Same,
        );

        return {
          ...prev,
          leftStart: leftEnd,
          left: [...prev.left, ...leftFill],
          rightStart: rightEnd,
          right: [...prev.right, ...rightFill],
        };
      }
      return prev;
    },
    { diffCount: 0, left: [], leftStart: 0, right: [], rightStart: 0 },
  );

  return {
    ...state,
    diffCount: newDiffs.diffCount,
    [Sides.Left]: { ...state[Sides.Left], diff: newDiffs.left },
    [Sides.Right]: { ...state[Sides.Right], diff: newDiffs.right },
  };
};

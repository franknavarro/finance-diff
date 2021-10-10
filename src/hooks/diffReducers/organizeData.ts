import { DiffState, Sides } from '../useDiffData';

export const organizeData = (state: DiffState, side: Sides): DiffState => {
  const sideData = [...state[side].data];
  sideData.sort((a, b) => {
    const amountDiff = a.amount - b.amount;
    if (amountDiff || !a.date || !b.date) return amountDiff;
    return a.date.getTime() - b.date.getTime();
  });
  return {
    ...state,
    [side]: { ...state[side], data: sideData },
    loading: false,
  };
};

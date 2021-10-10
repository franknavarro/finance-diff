import { Sides } from '../hooks/useDiffData';

export const sideTitle = (side: Sides) =>
  ({
    [Sides.Left]: 'Bank',
    [Sides.Right]: 'Spendee',
  }[side]);

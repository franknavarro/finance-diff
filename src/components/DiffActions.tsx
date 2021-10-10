import ArrowIcon from '@mui/icons-material/KeyboardBackspace';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';
import {
  DiffCsvData,
  DiffTypes,
  Sides,
  useDiffData,
} from '../hooks/useDiffData';
import { CsvData } from '../helpers/parse-data';
import { DiffActionTypes } from '../hooks/diffReducers';

const TableCell = styled(MuiTableCell)({
  padding: 6.51,
  height: 53,
  border: 'none',
});

const FowardArrowIcon = styled(ArrowIcon)({
  transform: 'rotate(180deg)',
});

const SpacedStack = styled(Stack)({
  justifyContent: 'space-around',
});

const DiffActions: FC = () => {
  const { dispatch, [Sides.Left]: left, [Sides.Right]: right } = useDiffData();

  const addData = (side: Sides, data: CsvData) => {
    dispatch({ type: DiffActionTypes.LoadingData });
    dispatch({ type: DiffActionTypes.AddData, side, data: [data] });
  };

  const removeData = (side: Sides | 'both', data: CsvData) => {
    dispatch({ type: DiffActionTypes.LoadingData });
    if (side === 'both') {
      dispatch({ type: DiffActionTypes.RemoveData, side: Sides.Left, data });
      dispatch({ type: DiffActionTypes.RemoveData, side: Sides.Right, data });
    } else {
      dispatch({ type: DiffActionTypes.RemoveData, side, data });
    }
  };

  const renderButtons = (leftDiff: DiffCsvData, rightDiff: DiffCsvData) => {
    switch (leftDiff.diff) {
      case DiffTypes.Removed:
        return (
          <>
            <IconButton onClick={() => removeData(Sides.Right, rightDiff)}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => addData(Sides.Left, rightDiff)}>
              <ArrowIcon />
            </IconButton>
          </>
        );
      case DiffTypes.Added:
        return (
          <>
            <IconButton onClick={() => addData(Sides.Right, leftDiff)}>
              <FowardArrowIcon />
            </IconButton>
            <IconButton onClick={() => removeData(Sides.Left, leftDiff)}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      case DiffTypes.Same:
        return;
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>{'\u00a0'}</TableCell>
          </TableRow>
          {left.diff.map((leftDiff, index) => (
            <TableRow key={index}>
              <TableCell>
                <SpacedStack direction="row">
                  {renderButtons(leftDiff, right.diff[index])}
                </SpacedStack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DiffActions;

import {
  Paper,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';
import { DiffCsvData, DiffTypes } from '../hooks/useDiffData';

const TableCell = styled(MuiTableCell)({
  color: 'inherit',
  width: '1%',
});

const ResponsiveTableCell = styled(MuiTableCell)({
  color: 'inherit',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: 0,
});

interface DiffTableProps {
  data: DiffCsvData[];
}

const diffStyles = {
  [DiffTypes.Added]: {
    backgroundColor: 'success.main',
    color: 'success.contrastText',
  },
  [DiffTypes.Removed]: {
    backgroundColor: 'error.main',
    color: 'error.contrastText',
  },
  [DiffTypes.Same]: {},
};

const DiffTable: FC<DiffTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <ResponsiveTableCell>Description</ResponsiveTableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d, i) => (
            <TableRow sx={diffStyles[d.diff]} key={i}>
              <TableCell>
                {d.date
                  ? `${
                      d.date.getMonth() + 1
                    }/${d.date.getDate()}/${d.date.getFullYear()}`
                  : '\u00a0'}
              </TableCell>
              <ResponsiveTableCell>
                {d.description || '\u00a0'}
              </ResponsiveTableCell>
              <TableCell align="right">
                {d.amount ? d.amount.toFixed(2) : '\u00a0'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DiffTable;

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Container as MuiContainer,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FC, useCallback } from 'react';
import DiffActions from './components/DiffActions';
import DiffTable from './components/DiffTable';
import FileButton from './components/FileButton';
import TitleBar from './components/TitleBar';
import { sideTitle } from './helpers/sideTitle';
import { parseData } from './helpers/parse-data';
import { DiffActionTypes } from './hooks/diffReducers';
import { Sides, useDiffData } from './hooks/useDiffData';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';

const Container = styled(MuiContainer)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  maxHeight: '100%',
  '& > *': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const GridItem = styled(Grid)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const App: FC = () => {
  const state = useDiffData();
  const {
    dateRange,
    diffCount,
    dispatch,
    loading,
    left,
    right,
  } = useDiffData();

  const addFile = useCallback(
    async (side: Sides, files: FileList | null) => {
      const file = files?.item(0);
      console.log({ file, side });
      if (!file) return;

      dispatch({ type: DiffActionTypes.LoadingData });
      const data = await parseData(file);
      dispatch({ type: DiffActionTypes.AddData, side, data });
    },
    [dispatch],
  );

  const removeData = useCallback(
    (side: Sides) => {
      dispatch({ type: DiffActionTypes.LoadingData });
      dispatch({ type: DiffActionTypes.RemoveAllData, side });
    },
    [dispatch],
  );

  const addButtons = (side: Sides) => {
    const sideWord = sideTitle(side);
    return (
      <Grid item xs={5}>
        <Stack sx={{ justifyContent: 'space-around' }} direction="row">
          <FileButton
            accept=".csv"
            id={`${side}-diff-add-csv`}
            onChange={(files) => addFile(side, files)}
            startIcon={<AddIcon />}
            disabled={loading}
          >
            Add {sideWord} CSV Data
          </FileButton>
          {!!state[side].data.length && (
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => removeData(side)}
            >
              Delete {sideWord} Data
            </Button>
          )}
        </Stack>
      </Grid>
    );
  };

  return (
    <>
      {!!diffCount && <TitleBar />}
      <Container maxWidth="xl">
        <div
          style={{
            width: '100%',
            display: 'flex',
            flex: diffCount ? 0 : 1,
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6">Diff Count: {diffCount}</Typography>
          {!!diffCount && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                startText="Transactions Start"
                endText="Transactions End"
                value={dateRange}
                onChange={(range) =>
                  dispatch({ type: DiffActionTypes.UpdateDateRange, range })
                }
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}>to</Box>
                    <TextField {...endProps} />
                  </>
                )}
              />
            </LocalizationProvider>
          )}
        </div>
        {!!diffCount && (
          <Grid sx={{ flex: 1, overflowY: 'auto' }} container spacing={2}>
            <GridItem item xs={5}>
              <DiffTable data={left.diff} />
            </GridItem>
            <GridItem item xs={2}>
              <DiffActions />
            </GridItem>
            <GridItem item xs={5}>
              <DiffTable data={right.diff} />
            </GridItem>
          </Grid>
        )}
        <Grid container spacing={2}>
          {addButtons(Sides.Left)}
          <GridItem item xs={2}></GridItem>
          {addButtons(Sides.Right)}
        </Grid>
      </Container>
    </>
  );
};

export default App;

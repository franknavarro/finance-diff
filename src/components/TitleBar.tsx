import {
  AppBar as MuiAppBar,
  Container,
  Grid,
  Input as MuiInput,
  Toolbar,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { FC } from 'react';
import { DiffActionTypes } from '../hooks/diffReducers';
import { Sides, useDiffData } from '../hooks/useDiffData';

const AppBar = styled(MuiAppBar)({
  margin: 0,
});

const Input = styled(MuiInput)(({ theme }) => ({
  color: 'inherit',
  fontSize: theme.typography.h4.fontSize,
  '&:before': {
    borderBottomColor: alpha(theme.palette.primary.contrastText, 0.42),
  },
  '&:hover:not(.Mui-disabled):before': {
    borderBottomColor: alpha(theme.palette.primary.contrastText, 0.87),
  },
  '& input': {
    textAlign: 'center',
  },
}));

const TitleBar: FC = () => {
  const state = useDiffData();

  const renderTextField = (side: Sides) => {
    return (
      <Grid item xs={5}>
        <Input
          id={`${side}-title`}
          fullWidth
          value={state[side].title}
          onChange={(event) =>
            state.dispatch({
              type: DiffActionTypes.UpdateTitle,
              side,
              title: event.target.value,
            })
          }
        />
      </Grid>
    );
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ padding: '0 !important' }}>
        <div style={{ width: '100%' }}>
          <Container maxWidth="xl">
            <Grid container spacing={2}>
              {renderTextField(Sides.Left)}
              <Grid item xs={2}></Grid>
              {renderTextField(Sides.Right)}
            </Grid>
          </Container>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;

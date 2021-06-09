import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Title from './Title';
import Button from '@material-ui/core/Button';
import { green, purple } from '@material-ui/core/colors';

const handleClick = () => {
  window.location.href = "/#/erc20";
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Total Capital Raise</Title>
      <Typography component="p" variant="h4">
        $2,000,000 
      </Typography>
      <Divider variant="middle" />
      <Typography component="p" variant="h6">
        $1,000 per share
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        Min. Investment $10,000 USD
      </Typography>
      <div>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        Secondary Trading
      </Button>
      </div>
    </React.Fragment>
  );
}

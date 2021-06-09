import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name: string, data: string) {
    return { name, data };
  }  

  const rows = [
    createData('Company Name', 'Securitize Demo -ERSD'),
    createData('CEZA DATO Approval Date', '29 April 2020'),
    createData('Company Number', 'WC-2323'),
    createData('Registered Address', 'c/o Walkers Corporate Limited, Cayman Corporate Centre, 27 Hospital Road, George Town, Grand Cayman KY1-9008, Cayman Islands'),
    createData('Token Name', 'ERSD'),
    createData('Security Type', 'Asset Backed Security Token'),
    createData('Category', 'Investment'),
    createData('Total Token Supply', '5,000,000 ERSD'),
    createData('Tokens for Sale', '2,000,000'),
    createData('Token Price', '1 ERSD = $1.00 USDT'),
    createData('Start Sale', 'TBD 2020'),
    createData('Stop Sale', 'TBD 2020'),
    createData('Platform', 'Ethereum'),
    createData('Token Type', 'Securitize - DSERC20'),
    createData('Valuation Firm', 'Gravel Consulting'),
    createData('Audit Firm', 'Sidney Austin'),
    createData('Legal Consel (British Virgin Islands)', 'Walkers'),
  
  ];

export default function TermsSheet() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Key Terms</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

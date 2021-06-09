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
    createData('Company Name', 'First Shot Centers, LLC'),
    createData('CEZA DATO Approval Date', 'April 2021'),
    createData('Registered Address', '4102-2000 Eashion Show Drive, Las Vagas, NV'),
    createData('Token Name', 'FirstShot Centers (FST)'),
    createData('Contract Address', '0x6D1c15725e3979F654Bd929E1cCAD48708bd4284'),
    createData('Security Type', 'Asset Backed Security Token'),
    createData('Category', 'Commercial Real Estate'),
    createData('Total Token Supply', '100,000,000 FST'),
    createData('Tokens for Sale', '100,000,000'),
    createData('Offering Price', '1 FST = $1.00 USDT'),
    createData('Start Sale', 'TBD 2021'),
    createData('Stop Sale', 'TBD 2021'),
    createData('Platform', 'Ethereum'),
    createData('Token Type', 'Securitize - DSERC20'),
    createData('Legal Consel (Cayman Islands)', 'Walkers'),
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

import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Title from './Title';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 650,
  },
}));

function createData(name: string, data: string) {
  return { name, data };
}

const rows = [
  createData('Company Name', 'HCS Whiskey Fund'),
  createData('CEZA DATO Approval Date', '29 April 2020'),
  createData('Company Number', 'WC-2323'),
  createData('Registered Address', 'c/o Walkers Corporate Limited, Cayman Corporate Centre, 27 Hospital Road, George Town, Grand Cayman KY1-9008, Cayman Islands'),
  createData('Token Name', 'HCS Whiskey Fund (HCS)'),
  createData('Security Type', 'Asset Backed Security Token'),
  createData('Category', 'Investment'),
  createData('Total Token Supply', '25,000,000 HCS'),
  createData('Tokens for Sale', '5,000,000'),
  createData('Token Price', '1 HCS = $2.00 USDT'),
  createData('Start Sale', 'TBD 2020'),
  createData('Stop Sale', 'TBD 2020'),
  createData('Platform', 'Ethereum'),
  createData('Token Type', 'Securitize - DSERC20'),
  createData('Valuation Firm', 'Gravel Consulting'),
  createData('Audit Firm', 'Sidney Austin'),
  createData('Legal Consel (Cayman Islands)', 'Walkers'),

];

export default function ProfileDetails() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Investment Detail" {...a11yProps(0)} />
          <Tab label="Term Sheet" {...a11yProps(1)} />
          <Tab label="Document Downloads" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        The Fund is designed to achieve the following:
        <br></br><br></br>
        <ul>
        <li>Exposure to Fine Scottish Single Cask Whisky as an asset class</li>
        <li>Lower barriers to entry through “Fractionalized” ownership (vs. whole barrels)</li>
        <li>Diversification by investing in multi-barrel portfolio (vs. single barrels)</li>
        <li>Liquidity via secondary market trading</li>
        <li>Stable funding source for long term “buy and hold” strategy via closed-end
        structure</li>
        <li>Expertise of the region’s leading independent bottler (IB), Howard Cai.</li>
        <li>Maximize ultimate selling price of assets through use of Howard Cai® Selected brand and existing distribution network of high-end restaurants, casino hotels & duty free shops such as The Whisky Dungeon by Howard Cai®</li>
        <li>Enhanced security and transparency via Fintech atop traditional, proven
        Cayman SPC structure.</li>
        <li>Best-in-class compliance and integrity enhanced by best-in-class advisors</li>
        </ul>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={2}>
       <p>Document Downloads</p>
        <a href="#">Audited Financial Statement</a><br></br>
        <a href="#">Private Placement Memorandum</a><br></br>
        <a href="#">Valuation Report</a><br></br>
        <a href="#">CEZA DATO Approval Certification</a><br></br>
      </TabPanel>
    </div>
    </React.Fragment>
  );
}

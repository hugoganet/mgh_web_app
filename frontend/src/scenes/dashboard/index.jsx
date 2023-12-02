/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import Header from '../../components/Header';

const Dashboard = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome to the Dashboard" />
      </Box>
    </Box>
  );
};

export default Dashboard;

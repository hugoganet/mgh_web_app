/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';

const Asin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [asins, setAsins] = useState([]);

  const fetchAsins = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/asins`);
      setAsins(response.data);
    } catch (error) {
      console.error('Error fetching ASIN data:', error);
    }
  };

  useEffect(() => {
    fetchAsins();
  }, []);

  const columns = [
    { field: 'asin', headerName: 'ASIN', flex: 1 },
    { field: 'asinName', headerName: 'Name', flex: 2 },
    // Add other columns based on the properties of the ASIN schema
    // ...
  ];

  return (
    <Box m="20px">
      <Header title="ASIN" subtitle="List of all ASINs." />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={asins}
          columns={columns}
          pageSize={50}
          rowsPerPageOptions={[25, 50, 100]}
          checkboxSelection
          disableSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={row => row.asinId}
        />
      </Box>
    </Box>
  );
};

export default Asin;

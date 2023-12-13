/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';

const Stock = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [eans, setEans] = useState([]);

  useEffect(() => {
    const fetchEans = async () => {
      try {
        const response = await axios.get('http://localhost:3001/eans');
        setEans(response.data);
      } catch (error) {
        console.error('Error fetching EAN data:', error);
      }
    };
    fetchEans();
  }, []);

  const columns = [
    {
      field: 'ean',
      headerName: 'EAN',
      cellClassName: 'name-column--cell',
      flex: 1,
    },
    { field: 'productName', headerName: 'Product Name', flex: 2 },
    // Assuming you have the logic to map 'brandId' to 'brandName'
    { field: 'brandName', headerName: 'Brand Name', flex: 1 },
    { field: 'createdAt', headerName: 'Created At', flex: 1 },
    { field: 'updatedAt', headerName: 'Updated At', flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="EAN STOCK" subtitle="List of all EANs." />
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
          rows={eans}
          columns={columns}
          getRowId={row => row.ean} // Use the ean field as the row id
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Stock;

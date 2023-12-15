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

  const [eans, setEans] = useState([]); // State for storing EAN data from the API

  const [totalEans, setTotalEans] = useState(0); // State for the total count of EANs (for pagination)

  // State for the pagination model (page and pageSize)
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
    page: 0, // DataGrid uses a zero-based index for pages
  });

  // Function to fetch EANs from the API based on the current pagination model
  const fetchEans = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/eans?page=${paginationModel.page + 1}&limit=${
          paginationModel.pageSize
        }`,
      );
      setEans(response.data.data);
      setTotalEans(response.data.total);
    } catch (error) {
      console.error('Error fetching EAN data:', error);
    }
  };

  useEffect(() => {
    fetchEans();
  }, [paginationModel]);

  // Handle changes to the pagination model
  const handlePaginationModelChange = newModel => {
    setPaginationModel(newModel);
  };

  // Column configuration for the DataGrid
  const columns = [
    {
      field: 'ean',
      headerName: 'EAN',
      cellClassName: 'name-column--cell',
      flex: 1,
    },
    { field: 'productName', headerName: 'Product Name', flex: 2 },
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
          rowCount={totalEans}
          paginationModel={paginationModel}
          paginationMode="server"
          slots={{ toolbar: GridToolbar }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[25, 50, 100]}
          getRowId={row => row.ean}
        />
      </Box>
    </Box>
  );
};

export default Stock;

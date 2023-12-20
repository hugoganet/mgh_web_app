/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Dialog, DialogContent } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';

const Sku = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [skus, setSkus] = useState([]);
  const [error, setError] = useState('');

  const fetchSkus = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/skus`);
      setSkus(response.data);
    } catch (error) {
      console.error('Error fetching SKU data:', error);
      setError('Failed to load SKU data'); // Set a user-friendly error message
      return []; // Return an empty array in case of error
    }
  };

  // const fetchAsinWarehouseQuantities = async () => {
  //   try {
  //     const response = await axios.get(
  //       'http://localhost:3001/asinwarehousequantity',
  //     );
  //     return response.data; // Assuming the response data is the array of warehouse quantities
  //   } catch (error) {
  //     console.error('Error fetching ASIN data:', error);
  //     setError('Failed to load ASIN data'); // Set a user-friendly error message
  //     return []; // Return an empty array in case of error
  //   }
  // };

  // const fetchAndCombineData = async () => {
  //   const [asinsData, asinWarehouseQuantities] = await Promise.all([
  //     fetchSkus(),
  //     fetchAsinWarehouseQuantities(),
  //   ]);

  //   // Combine the data
  //   const combinedData = asinsData.map(asin => {
  //     const warehouseQuantity = asinWarehouseQuantities.find(
  //       q => q.asinId === asin.asinId,
  //     );
  //     return {
  //       ...asin,
  //       totalWarehouseQuantity: warehouseQuantity
  //         ? warehouseQuantity.totalWarehouseQuantity
  //         : 0,
  //     };
  //   });

  //   setAsins(combinedData);
  // };

  useEffect(() => {
    fetchSkus();
  }, []);

  const columns = [
    { field: 'sku', headerName: 'SKU', flex: 1 },
    { field: 'countryCode', headerName: 'Country', flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="SKU" subtitle="List of all SKUs." />
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
            justifyContent: 'center', // Center align the column headers
            whiteSpace: 'normal', // Allow text to wrap
            lineHeight: 'normal', // Adjust line height for wrapped text
            textAlign: 'center', // Center align the text
            '& .MuiDataGrid-columnHeaderTitle': {
              overflow: 'hidden', // Hide overflow
              textOverflow: 'ellipsis', // Use ellipsis for overflowed text
              whiteSpace: 'normal', // Allow text to wrap
              lineHeight: 'normal', // Adjust line height for wrapped text
              textAlign: 'center', // Center align the text
            },
          },
        }}
      >
        <DataGrid
          rows={skus}
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
          getRowId={row => row.skuId}
        />
      </Box>
    </Box>
  );
};

export default Sku;

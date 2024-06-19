/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';
import { fetchSkus } from '../../data/fetchSkus';

const Sku = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSkus = async () => {
    try {
      const data = await fetchSkus();
      setSkus(data);
    } catch (error) {
      console.error('Error fetching SKU data:', error);
      setError('Failed to load SKU data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkus();
  }, []);

  const columns = [
    { field: 'sku', headerName: 'SKU', flex: 2 },
    { field: 'countryCode', headerName: 'Country', flex: 1 },
    { field: 'fnsku', headerName: 'FNSKU', flex: 1 },
    {
      field: 'skuAcquisitionCostExc',
      headerName: 'Acquisition Cost (Excl)',
      type: 'number',
      flex: 1,
    },
    {
      field: 'skuAcquisitionCostInc',
      headerName: 'Acquisition Cost (Incl)',
      type: 'number',
      flex: 1,
    },
    {
      field: 'skuAfnTotalQuantity',
      headerName: 'AFN Total Quantity',
      type: 'number',
      flex: 1,
    },
    {
      field: 'skuAverageSellingPriceInc',
      headerName: 'Average Selling Price Inc.',
      type: 'number',
      flex: 1,
    },
    {
      field: 'skuAverageNetMargin',
      headerName: 'Average Net Margin',
      type: 'number',
      flex: 1,
    },
    {
      field: 'skuAverageNetMarginPercentage',
      headerName: 'Net Margin %',
      type: 'number',
      valueFormatter: params => `${(params.value * 100).toFixed(2)}%`,
      flex: 1,
    },
    {
      field: 'skuAverageReturnOnInvestmentRate',
      headerName: 'ROI Rate',
      type: 'number',
      valueFormatter: params => `${(params.value * 100).toFixed(2)}%`,
      flex: 1,
    },
    {
      field: 'skuAverageDailyReturnOnInvestmentRate',
      headerName: 'Daily ROI Rate',
      type: 'number',
      valueFormatter: params => `${(params.value * 100).toFixed(2)}%`,
      flex: 1,
    },
    { field: 'isActive', headerName: 'Active', type: 'boolean', flex: 1 },
    {
      field: 'numberOfActiveDays',
      headerName: 'Active Days',
      type: 'number',
      flex: 1,
    },
    {
      field: 'numberOfUnitSold',
      headerName: 'Units Sold',
      type: 'number',
      flex: 1,
    },
    {
      field: 'skuAverageUnitSoldPerDay',
      headerName: 'Avg Units Sold/Day',
      type: 'number',
      flex: 1,
    },
    {
      field: 'skuRestockAlertQuantity',
      headerName: 'Restock Alert Qty',
      type: 'number',
      flex: 1,
    },
    { field: 'skuIsTest', headerName: 'Test SKU', type: 'boolean', flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="SKU" subtitle="List of all SKUs." />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="75vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
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
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            checkboxSelection
            disableSelectionOnClick
            pageSizeOptions={[25, 50, 100]}
            getRowId={row => row.skuId}
          />
        </Box>
      )}
    </Box>
  );
};

export default Sku;

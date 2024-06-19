/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import { fetchAsinSourcingCatalog } from '../../data/asinSourcingCatalogData';

const List = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [asinSourcingCatalog, setAsinSourcingCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAndSetData = async () => {
    try {
      const data = await fetchAsinSourcingCatalog();
      setAsinSourcingCatalog(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ASIN Sourcing Catalog data:', error);
      setError('Failed to load ASIN Sourcing Catalog data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetData();
  }, []);

  const columns = [
    { field: 'asinSourcingCatalogId', headerName: 'ID', flex: 1 },
    { field: 'keepaDataId', headerName: 'Keepa Data ID', flex: 1 },
    { field: 'ean', headerName: 'EAN', flex: 1 },
    {
      field: 'productCategoryRank',
      headerName: 'Category Rank',
      type: 'number',
      flex: 1,
    },
    {
      field: 'averageSellingPriceInc',
      headerName: 'Avg Selling Price',
      type: 'number',
      flex: 1,
    },
    {
      field: 'estimAsinAcquisitionCostExc',
      headerName: 'Est. Acquisition Cost Excl',
      type: 'number',
      flex: 1,
    },
    {
      field: 'estimAsinAcquisitionCostInc',
      headerName: 'Est. Acquisition Cost Incl',
      type: 'number',
      flex: 1,
    },
    {
      field: 'minimumSellingPriceLocalAndPanEu',
      headerName: 'Min Selling Price Local & Pan EU',
      type: 'number',
      flex: 1,
    },
    {
      field: 'minimumSellingPriceEfn',
      headerName: 'Min Selling Price EFN',
      type: 'number',
      flex: 1,
    },
    {
      field: 'estimMonthlyRevenu',
      headerName: 'Est. Monthly Revenue',
      type: 'number',
      flex: 1,
    },
    {
      field: 'estimMonthlyMarginExc',
      headerName: 'Est. Monthly Margin Excl',
      type: 'number',
      flex: 1,
    },
    {
      field: 'estimAcquisitionCostExc',
      headerName: 'Est. Acquisition Cost Excl',
      type: 'number',
      flex: 1,
    },
    {
      field: 'estimPersonalMonthlyQuantitySold',
      headerName: 'Est. Personal Monthly Quantity Sold',
      type: 'number',
      flex: 1,
    },
    {
      field: 'pvMoyenConstate',
      headerName: 'PV Moyen Constate',
      type: 'number',
      flex: 1,
    },
    { field: 'fbaFees', headerName: 'FBA Fees', type: 'number', flex: 1 },
    { field: 'prepFees', headerName: 'Prep Fees', type: 'number', flex: 1 },
    {
      field: 'transportFees',
      headerName: 'Transport Fees',
      type: 'number',
      flex: 1,
    },
    { field: 'isHazmat', headerName: 'Is Hazmat', type: 'boolean', flex: 1 },
    {
      field: 'estimMonthlyQuantitySold',
      headerName: 'Est. Monthly Quantity Sold',
      type: 'number',
      flex: 1,
    },
    {
      field: 'estimNumberOfSeller',
      headerName: 'Est. Number of Sellers',
      type: 'number',
      flex: 1,
    },
    {
      field: 'desiredNumberOfWeeksCovered',
      headerName: 'Desired Number of Weeks Covered',
      type: 'number',
      flex: 1,
    },
  ];

  return (
    <Box m="20px" height="100%" width="100%">
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Box
          height="100%"
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
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
            '& .MuiDataGrid-columnHeaderTitle': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              lineHeight: 'normal',
              textAlign: 'center',
            },
          }}
        >
          <DataGrid
            rows={asinSourcingCatalog}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[25, 50, 100]}
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={row => row.asinSourcingCatalogId}
          />
        </Box>
      )}
    </Box>
  );
};

export default List;

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';
import { fetchEans } from '../../services/eanService';

const Ean = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [eans, setEans] = useState([]);
  const [warehouseColumns, setWarehouseColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEans = async () => {
    try {
      const data = await fetchEans();
      setEans(data.data);

      if (data.warehouses && warehouseColumns.length === 0) {
        const newColumns = data.warehouses.map(warehouseName => ({
          field: `stock_${warehouseName}`,
          headerName: `Stock ${warehouseName}`,
          type: 'number',
          valueGetter: params => {
            const warehouseStock = params.row.WarehouseStocks.find(
              ws => ws.Warehouse.warehouseName === warehouseName,
            );
            return warehouseStock ? warehouseStock.warehouseInStockQuantity : 0;
          },
        }));
        setWarehouseColumns(newColumns);
      }
    } catch (error) {
      console.error('Error fetching EAN data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEans();
  }, []);

  const baseColumns = [
    {
      field: 'ean',
      headerName: 'EAN',
      flex: 1,
    },
    { field: 'productName', headerName: 'Product Name', flex: 2 },
  ];

  const columns = [...baseColumns, ...warehouseColumns];

  return (
    <Box m="20px">
      <Header title="EAN" subtitle="List of all EANs." />
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
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            checkboxSelection={true}
            disableSelectionOnClick
            pageSizeOptions={[25, 50, 100]}
            getRowId={row => row.ean}
          />
        </Box>
      )}
    </Box>
  );
};

export default Ean;

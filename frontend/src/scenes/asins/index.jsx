/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';
import { fetchAsins, fetchAsinWarehouseQuantities } from '../../data/asinData';

const Asin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [asins, setAsins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for controlling the visibility and content of the image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  // Function to open the modal with the selected image
  const openImageModal = imageUrl => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  // Function to close the modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageUrl('');
  };

  const fetchAndCombineData = async () => {
    try {
      const [asinsData, asinWarehouseQuantities] = await Promise.all([
        fetchAsins(),
        fetchAsinWarehouseQuantities(),
      ]);

      // Combine the data
      const combinedData = asinsData.map(asin => {
        const warehouseQuantity = asinWarehouseQuantities.find(
          q => q.asinId === asin.asinId,
        );
        return {
          ...asin,
          totalWarehouseQuantity: warehouseQuantity
            ? warehouseQuantity.totalWarehouseQuantity
            : 0,
        };
      });

      setAsins(combinedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ASIN data:', error);
      setError('Failed to load ASIN data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndCombineData();
  }, []);

  const columns = [
    {
      field: 'urlImage',
      headerName: 'Image',
      flex: 1,
      renderCell: params => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            cursor: 'pointer', // Change cursor to indicate clickable
          }}
          onClick={() => openImageModal(params.value)}
        >
          {params.value ? (
            <img
              src={params.value}
              alt={params.row.asinName}
              style={{ maxHeight: '50px', maxWidth: '100%' }}
            />
          ) : (
            'No Image'
          )}
        </Box>
      ),
    },
    { field: 'asin', headerName: 'ASIN', flex: 1 },
    { field: 'asinName', headerName: 'Name', flex: 2 },
    { field: 'countryCode', headerName: 'Country', flex: 1 },
    { field: 'productCategoryId', headerName: 'Product Category ID', flex: 1 },
    {
      field: 'productCategoryRankId',
      headerName: 'Product Category Rank ID',
      flex: 1,
    },
    {
      field: 'productTaxCategoryId',
      headerName: 'Product Tax Category ID',
      flex: 1,
    },
    { field: 'asinPreparation', headerName: 'Preparation', flex: 1 },
    {
      field: 'urlAmazon',
      headerName: 'Amazon URL',
      flex: 1,
      renderCell: params => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          Amazon
        </a>
      ),
    },
    {
      field: 'asinNumberOfActiveSku',
      headerName: 'Number of Active SKU',
      type: 'number',
      flex: 1,
    },
    {
      field: 'asinAverageUnitSoldPerDay',
      headerName: 'Avg. Units Sold/Day',
      type: 'number',
      flex: 1,
    },
    {
      field: 'isBatteryRequired',
      headerName: 'Battery Required',
      type: 'boolean',
      flex: 1,
    },
    { field: 'isHazmat', headerName: 'Hazmat', type: 'boolean', flex: 1 },
    {
      field: 'totalWarehouseQuantity',
      headerName: 'Warehouse Stock',
      type: 'number',
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="ASIN" subtitle="List of all ASINs." />
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
        <>
          <Dialog open={isImageModalOpen} onClose={closeImageModal}>
            <DialogContent>
              <img
                src={selectedImageUrl}
                alt="Selected"
                style={{ width: '100%' }}
              />
            </DialogContent>
          </Dialog>
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
        </>
      )}
    </Box>
  );
};

export default Asin;

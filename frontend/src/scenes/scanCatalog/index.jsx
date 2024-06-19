/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { Box, Button, useTheme, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import List from './list';
import uploadKeepaData from '../../services/uploadKeepaDataService';
import uploadCatalog from '../../services/uploadCatalogService';

const ScanCatalog = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInputKeepa = useRef(null);
  const fileInputCatalog = useRef(null);

  const handleFileChangeKeepa = async event => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await uploadKeepaData(file);
        console.log('Keepa data upload successful:', result);
      } catch (error) {
        console.error('Keepa data upload failed:', error.message);
      }
    }
  };

  const handleFileChangeCatalog = async event => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log('File selected:', file);
        const result = await uploadCatalog(file);
        console.log('Catalog upload successful:', result);
      } catch (error) {
        console.error('Catalog upload failed:', error.message);
      }
    } else {
      console.error('No file selected.');
    }
  };

  return (
    <Box m="20px">
      <Header
        title="SCAN CATALOG"
        subtitle="Find the right product in a glimpse."
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <input
          type="file"
          onChange={handleFileChangeKeepa}
          style={{ display: 'none' }}
          ref={fileInputKeepa}
        />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: colors.blueAccent[800],
            },
          }}
          onClick={() => fileInputKeepa.current.click()}
        >
          <DownloadOutlinedIcon sx={{ mr: '10px' }} />
          Upload Keepa Data
        </Button>
        <input
          type="file"
          onChange={handleFileChangeCatalog}
          style={{ display: 'none' }}
          ref={fileInputCatalog}
        />
        <Button
          sx={{
            backgroundColor: colors.greenAccent[700],
            color: colors.grey[100],
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: colors.greenAccent[800],
            },
          }}
          onClick={() => fileInputCatalog.current.click()}
        >
          <DownloadOutlinedIcon sx={{ mr: '10px' }} />
          Upload Catalog
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" height="75vh">
        <Typography variant="body1" mb="20px">
          Upload the Keepa data and the catalog to start scanning the catalog.
        </Typography>
        <Box flex={1}>
          <List />
        </Box>
      </Box>
    </Box>
  );
};

export default ScanCatalog;

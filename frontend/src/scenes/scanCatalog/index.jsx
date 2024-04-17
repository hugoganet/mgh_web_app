/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { uploadKeepaData } from '../../services/uploadKeepaDataService';

const ScanCatalog = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInput = useRef(null); // Create a ref using useRef hook

  const handleFileChange = async event => {
    const file = event.target.files[0]; // Handle file selection
    if (file) {
      try {
        const result = await uploadKeepaData(file); // Use the upload service
        alert('Upload successful: ' + JSON.stringify(result));
      } catch (error) {
        alert('Upload failed: ' + error.message);
      }
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="SCAN CATALOG"
          subtitle="Find the right product in a glimpse."
        />
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInput}
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
          onClick={() => fileInput.current.click()} // Access the ref's current value to trigger click
        >
          <DownloadOutlinedIcon sx={{ mr: '10px' }} />
          Upload Keepa Data
        </Button>
      </Box>
    </Box>
  );
};

export default ScanCatalog;

/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const ScanCatalog = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fileInput = useRef(null); // Create a ref using useRef hook
  const [file, setFile] = useState(null);

  const handleFileChange = event => {
    setFile(event.target.files[0]); // Handle file selection
  };

  const handleUpload = async () => {
    if (!file) {
      alert('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      alert('Upload successful');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed');
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
          Upload Catalog
        </Button>
      </Box>
    </Box>
  );
};

export default ScanCatalog;

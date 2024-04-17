const uploadCatalog = async file => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:3001/uploadatalog', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const result = await response.json();
      return result; // Return result for further processing or confirmation messages
    } else {
      throw new Error('Failed to upload catalog file: ' + response.statusText);
    }
  } catch (error) {
    console.error('Error uploading catalog file:', error);
    throw error; // Re-throw to handle it in the component
  }
};

export default uploadCatalog;

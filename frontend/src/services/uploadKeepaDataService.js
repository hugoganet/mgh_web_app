const uploadKeepaData = async file => {
  const formData = new FormData();
  formData.append('file', file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout after 10 seconds

  try {
    const response = await fetch('http://localhost:3001/uploadKeepaData', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log('uploadKeepaData response:', response);

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Failed to upload file: ' + response.statusText);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default uploadKeepaData;

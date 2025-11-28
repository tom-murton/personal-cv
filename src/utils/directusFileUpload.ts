/**
 * Custom fetch implementation that supports upload progress tracking
 */
export const customFetch = async (
  url: string, 
  options: any = {}
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    
    // Set headers
    if (options.headers) {
      Object.keys(options.headers).forEach(key => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }
    
    // Handle progress if needed
    if (options.onUploadProgress && xhr.upload) {
      xhr.upload.onprogress = options.onUploadProgress;
    }
    
    // Handle completion
    xhr.onload = () => {
      const response = new Response(xhr.response, {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: new Headers(
          xhr.getAllResponseHeaders()
            .split('\r\n')
            .filter(Boolean)
            .reduce((acc, header) => {
              const [key, value] = header.split(': ');
              return { ...acc, [key]: value };
            }, {})
        )
      });
      
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(response);
      } else {
        reject(response);
      }
    };
    
    // Handle errors
    xhr.onerror = () => {
      console.error(`Network request failed to ${url}`);
      reject(new TypeError(`Network request failed to ${url}. This could be a CORS issue or the server is unreachable.`));
    };
    
    xhr.ontimeout = () => {
      console.error(`Network request timed out for ${url}`);
      reject(new TypeError(`Network request to ${url} timed out. The server might be slow or unresponsive.`));
    };
    
    // Send
    xhr.responseType = 'blob';
    xhr.send(options.body);
  });
};

/**
 * Upload a file to Directus
 * @param file The file to upload
 * @param token Directus API token
 * @param directusUrl Directus base URL (default: https://cms.tommurton.com)
 * @param onProgress Optional progress callback
 * @returns The uploaded file data from Directus
 */
export const uploadFileToDirectus = async (
  file: File,
  token: string,
  directusUrl: string = 'https://cms.tommurton.com',
  onProgress?: (progress: number) => void
): Promise<any> => {
  if (!token) {
    throw new Error("API token is required for file uploads");
  }
  
  if (!file) {
    throw new Error("No file was provided for upload");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await customFetch(`${directusUrl}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
    
    const blob = await response.blob();
    const text = await blob.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      console.error("Raw response content:", text.substring(0, 200) + (text.length > 200 ? '...' : ''));
      return { 
        success: true, 
        data: { 
          id: 'unknown', 
          message: 'File uploaded, but response could not be parsed as JSON' 
        } 
      };
    }
  } catch (error) {
    console.error("File upload error:", error);
    
    if (error instanceof Response) {
      const errorBlob = await error.blob();
      const errorText = await errorBlob.text();
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.errors && errorJson.errors.length > 0) {
          throw new Error(`Upload failed: ${errorJson.errors[0].message}`);
        } else {
          throw new Error(`Upload failed with status ${error.status}: ${errorJson.message || error.statusText}`);
        }
      } catch (parseError) {
        // If we can't parse the error as JSON, use a basic error message
        if (error.status === 401) {
          throw new Error(`Upload failed: Invalid or expired API token (HTTP 401)`);
        } else if (error.status === 403) {
          throw new Error(`Upload failed: API token doesn't have permission to upload files (HTTP 403)`);
        } else if (error.status === 507) {
          throw new Error(`Upload failed: Storage limit exceeded (HTTP 507)`);
        } else {
          throw new Error(`Upload failed with status ${error.status}: ${error.statusText}`);
        }
      }
    }
    
    // For non-Response errors
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(`Cannot connect to Directus at ${directusUrl}. Check if the server is running and accessible.`);
    }
    
    throw error;
  }
};

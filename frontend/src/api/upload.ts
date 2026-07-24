import { getAccessToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface UploadData {
  publicId: string;
  imageUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: UploadData;
  errors?: Array<{ field?: string; message: string }>;
}

/**
 * Upload Image API with real-time progress tracking, retries, and error handling
 */
export async function uploadImageApi(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('image', file);

    xhr.open('POST', `${API_BASE_URL}/api/upload/image`, true);

    // Inject Auth token if logged in
    const token = getAccessToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    // Track upload progress
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response: UploadResponse = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && response.success) {
          resolve(response);
        } else {
          const errorMsg = response.message || `Upload failed with status code ${xhr.status}`;
          const err: any = new Error(errorMsg);
          err.status = xhr.status;
          err.errors = response.errors || [];
          reject(err);
        }
      } catch {
        reject(new Error('Failed to parse upload server response'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error. Unable to connect to backend server.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Upload timed out. Please try uploading again.'));
    };

    // Timeout after 30 seconds
    xhr.timeout = 30000;

    xhr.send(formData);
  });
}

/**
 * Delete Image API from Cloudinary by public ID
 */
export async function deleteImageApi(publicId: string): Promise<{ success: boolean; message: string }> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const encodedId = encodeURIComponent(publicId);
  const response = await fetch(`${API_BASE_URL}/api/upload/${encodedId}`, {
    method: 'DELETE',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete image');
  }

  return data;
}

import { useState, useCallback } from 'react';
import { uploadToBunny, uploadMultipleToBunny, deleteFromBunny, generateBunnyPath } from '@/lib/bunny';
import { toast } from 'sonner';

interface UploadProgress {
  file: string;
  progress: number;
}

interface UseBunnyUploadOptions {
  category?: 'profile' | 'course' | 'certificate' | 'assessment' | 'general';
  onSuccess?: (urls: string[]) => void;
  onError?: (error: Error) => void;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
}

export function useBunnyUpload(options: UseBunnyUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const {
    category = 'general',
    onSuccess,
    onError,
    maxFileSize = 10, // 10MB default
    acceptedFileTypes = ['image/*', 'video/*', 'application/pdf'],
  } = options;

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxFileSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB`);
      return false;
    }

    // Check file type
    const isAcceptedType = acceptedFileTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAcceptedType) {
      toast.error(`File type ${file.type} is not accepted`);
      return false;
    }

    return true;
  }, [maxFileSize, acceptedFileTypes]);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setIsUploading(true);
    setUploadProgress(prev => [...prev, { file: file.name, progress: 0 }]);

    try {
      // Generate a unique path for the file
      const path = generateBunnyPath(category, file.name);
      
      // Simulate progress (since we can't get real progress from the API)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map(p => 
            p.file === file.name 
              ? { ...p, progress: Math.min(p.progress + 10, 90) }
              : p
          )
        );
      }, 200);

      const url = await uploadToBunny(file, path);
      
      clearInterval(progressInterval);
      
      // Set progress to 100%
      setUploadProgress(prev => 
        prev.map(p => 
          p.file === file.name 
            ? { ...p, progress: 100 }
            : p
        )
      );

      setUploadedUrls(prev => [...prev, url]);
      toast.success(`${file.name} uploaded successfully`);
      
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
      
      if (onError) {
        onError(error as Error);
      }
      
      return null;
    } finally {
      setIsUploading(false);
      // Clean up progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.file !== file.name));
      }, 2000);
    }
  }, [category, validateFile, onError]);

  const uploadFiles = useCallback(async (files: File[]): Promise<string[]> => {
    const validFiles = files.filter(validateFile);
    
    if (validFiles.length === 0) {
      toast.error('No valid files to upload');
      return [];
    }

    setIsUploading(true);
    
    try {
      const urls = await uploadMultipleToBunny(validFiles, category);
      setUploadedUrls(prev => [...prev, ...urls]);
      
      toast.success(`${urls.length} files uploaded successfully`);
      
      if (onSuccess) {
        onSuccess(urls);
      }
      
      return urls;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
      
      if (onError) {
        onError(error as Error);
      }
      
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [category, validateFile, onSuccess, onError]);

  const deleteFile = useCallback(async (url: string): Promise<boolean> => {
    try {
      await deleteFromBunny(url);
      setUploadedUrls(prev => prev.filter(u => u !== url));
      toast.success('File deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
      return false;
    }
  }, []);

  const clearUploads = useCallback(() => {
    setUploadedUrls([]);
    setUploadProgress([]);
  }, []);

  return {
    uploadFile,
    uploadFiles,
    deleteFile,
    clearUploads,
    isUploading,
    uploadProgress,
    uploadedUrls,
  };
}
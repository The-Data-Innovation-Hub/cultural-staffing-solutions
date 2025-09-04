import React, { useCallback, useState } from 'react';
import { Upload, X, File, Image, Video, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useBunnyUpload } from '@/hooks/useBunnyUpload';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/bunny';

interface BunnyFileUploadProps {
  category?: 'profile' | 'course' | 'certificate' | 'assessment' | 'general';
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  onUploadComplete?: (urls: string[]) => void;
  showPreview?: boolean;
  className?: string;
}

export function BunnyFileUpload({
  category = 'general',
  maxFiles = 5,
  maxFileSize = 10,
  acceptedFileTypes = ['image/*', 'video/*', 'application/pdf'],
  onUploadComplete,
  showPreview = true,
  className,
}: BunnyFileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    uploadFiles,
    deleteFile,
    isUploading,
    uploadProgress,
    uploadedUrls,
    clearUploads,
  } = useBunnyUpload({
    category,
    maxFileSize,
    acceptedFileTypes,
    onSuccess: onUploadComplete,
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    const filesArray = Array.from(files).slice(0, maxFiles);
    setSelectedFiles(filesArray);
  }, [maxFiles]);

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      await uploadFiles(selectedFiles);
      setSelectedFiles([]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getPreviewUrl = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed p-8 text-center transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          'hover:border-primary/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleChange}
          className="hidden"
          id="file-upload"
        />
        
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center space-y-2"
        >
          <Upload className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum {maxFiles} files, up to {maxFileSize}MB each
          </p>
          <p className="text-xs text-muted-foreground">
            Accepted: {acceptedFileTypes.join(', ')}
          </p>
        </label>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files</h4>
          {selectedFiles.map((file, index) => {
            const previewUrl = getPreviewUrl(file);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-2 border rounded-lg"
              >
                {showPreview && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  getFileIcon(file)
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSelectedFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          
          <Button
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Upload Progress</h4>
          {uploadProgress.map((progress, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{progress.file}</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedUrls.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Uploaded Files</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearUploads}
            >
              Clear All
            </Button>
          </div>
          {uploadedUrls.map((url, index) => {
            const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-2 border rounded-lg bg-muted/50"
              >
                {showPreview && isImage ? (
                  <img
                    src={getOptimizedImageUrl(url, { width: 40, height: 40, quality: 80 })}
                    alt={`Upload ${index + 1}`}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <File className="h-4 w-4" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{url}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteFile(url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
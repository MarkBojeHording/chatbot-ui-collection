import React, { useState, useCallback } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { UploadedFile } from '../../types';
import { ApiService } from '../../services/api';

const DocumentManager: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
      return 'Only PDF, TXT, and MD files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const uploadFiles = async (fileList: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert('Upload errors:\n' + errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    // Add files to state with uploading status
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress and call API
    for (const newFile of newFiles) {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === newFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          ));
        }, 200);

        // Create FileList with single file for API call
        const singleFileList = new DataTransfer();
        const originalFile = validFiles.find(f => f.name === newFile.name);
        if (originalFile) {
          singleFileList.items.add(originalFile);
        }

        await ApiService.uploadDocuments(singleFileList.files);

        clearInterval(progressInterval);
        
        setFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: 'error', progress: 0 }
            : f
        ));
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
    e.target.value = ''; // Reset input
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-gray-400" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
        <p className="text-sm text-gray-500">Upload documents to enhance AI responses</p>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Supports PDF, TXT, and MD files up to 10MB each
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.txt,.md"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {files.map((file) => (
                <div key={file.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status)}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManager;
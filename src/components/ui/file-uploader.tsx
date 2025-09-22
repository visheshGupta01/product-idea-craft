import React, { useRef, useState } from "react";
import { Upload, FileText, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from '@/config/api';

export interface UploadedFile {
  name: string;
  extractedText: string;
  size: number;
}

interface FileUploaderProps {
  onFileUploaded: (file: UploadedFile) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileName: string) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  uploadedFiles,
  onRemoveFile,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // apiClient POST request
      const response = await apiClient.post(API_ENDPOINTS.UPLOAD.PDF, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;

      if (result.success) {
        const uploadedFile: UploadedFile = {
          name: file.name,
          extractedText: result.text,
          size: file.size,
        };
        onFileUploaded(uploadedFile);
        toast.success(`${file.name} uploaded successfully!`);
      } else {
        toast.error(result.message || "Failed to extract text from PDF");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="p-2 w-[40px] h-[40px] flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload PDF file"
        >
          {isUploading ? (
            <Loader2 className="w-[20px] h-[20px] text-gray-700 animate-spin" />
          ) : (
            <FileText className="w-[20px] h-[20px] text-gray-700" />
          )}
        </button>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="absolute top-14 right-3 bg-white border border-gray-200 rounded-md shadow-lg p-2 min-w-[200px] z-10">
          <div className="text-xs text-gray-600 mb-2">Uploaded Files:</div>
          {uploadedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between gap-2 text-xs p-1 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                <span className="truncate" title={file.name}>
                  {file.name}
                </span>
              </div>
              <button
                onClick={() => onRemoveFile(file.name)}
                className="text-red-500 hover:text-red-700 flex-shrink-0"
                title="Remove file"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

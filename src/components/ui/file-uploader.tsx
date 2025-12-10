import React, { useRef, useState } from "react";
import { Upload, FileText, Loader2, X, Check, Paperclip } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

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
  iconColor?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  uploadedFiles,
  onRemoveFile,
  disabled = false,
  iconColor
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
      const response = await apiClient.post(
        API_ENDPOINTS.UPLOAD.PDF,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;

      //console.log(result);

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
      //console.error("File upload error:", error);
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
    <>
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
        className=" mr-4 pr-2 flex items-center justify-center rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload PDF file"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 text-sidebar-accent animate-spin text-white" />
        ) : (
          <Paperclip className={`w-5 h-5 text-[#5C5C5C] ${iconColor}`}/>
        )}
      </button>
    </>
  );
};

import React, { useRef, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onTextExtracted,
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

      const response = await fetch("http://localhost:8000/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onTextExtracted(result.message);
        toast.success("PDF text extracted successfully!");
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
        className="p-2 w-[50px] h-[50px] flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload PDF file"
      >
        {isUploading ? (
          <Loader2 className="w-[20px] h-[20px] text-gray-700 animate-spin" />
        ) : (
          <FileText className="w-[20px] h-[20px] text-gray-700" />
        )}
      </button>
    </>
  );
};
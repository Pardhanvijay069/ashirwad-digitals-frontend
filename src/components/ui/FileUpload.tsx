import { useCallback, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  value?: File[];
  error?: string;
  label?: string;
  hint?: string;
  className?: string;
}

export function FileUpload({
  accept,
  maxSize,
  maxFiles = 1,
  multiple = false,
  onChange,
  value = [],
  error,
  label,
  hint,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const newFiles = Array.from(fileList).slice(0, maxFiles - value.length);
      onChange([...value, ...newFiles]);
    },
    [onChange, value, maxFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}

      {/* Drop zone */}
      {value.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
            isDragging
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
              : 'border-surface-300 hover:border-primary-400 hover:bg-surface-50 dark:border-surface-600 dark:hover:border-primary-500 dark:hover:bg-surface-800/50',
            error && 'border-danger-500'
          )}
        >
          <Upload className="mb-3 h-8 w-8 text-surface-400" />
          <p className="mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">
            {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          {hint && (
            <p className="text-xs text-surface-500">{hint}</p>
          )}
          {maxSize && (
            <p className="mt-1 text-xs text-surface-400">Max size: {formatSize(maxSize)}</p>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* File list */}
      {value.length > 0 && (
        <div className="mt-3 space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 dark:border-surface-700 dark:bg-surface-800"
            >
              <span className="text-surface-500">{getFileIcon(file)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-surface-700 dark:text-surface-300">
                  {file.name}
                </p>
                <p className="text-xs text-surface-400">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="rounded-md p-1 text-surface-400 hover:bg-surface-200 hover:text-surface-600 dark:hover:bg-surface-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">{error}</p>
      )}
    </div>
  );
}

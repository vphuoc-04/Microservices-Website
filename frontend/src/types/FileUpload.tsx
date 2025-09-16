export interface FileUpload {
    id: number;
    originalFilename: string;
    storedFilename: string;
    filePath: string;
    fileSize: number;
    contentType: string;
    fileExtension: string;
    uploadedBy: number;
    uploadCategory: string;
    description: string;
    isPublic: boolean;
    thumbnailPath: string;
    metadata: string;
    createdAt: string;
    updatedAt: string;
    downloadUrl?: string;
    thumbnailUrl?: string;
}

export interface FileUploadRequest {
    files: File[];
    uploadCategory?: string;
    description?: string;
    isPublic?: boolean;
    uploadedBy?: number;
}

export interface FileUpdateRequest {
    description?: string;
    isPublic?: boolean;
    uploadCategory?: string;
}

export interface FileUploadResponse {
    success: boolean;
    data?: FileUpload[];
    message?: string;
    error?: string;
}

export interface FileStats {
    fileCount: number;
    totalSize: number;
}

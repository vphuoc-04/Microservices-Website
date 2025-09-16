import { uploadServiceInstance, serviceConfig } from "../configs/axios";
import { FileUpload, FileUploadRequest } from "../types/FileUpload";

const model = "upload";

const uploadFiles = async (request: FileUploadRequest): Promise<FileUpload[]> => {
    const formData = new FormData();
    request.files.forEach((file) => formData.append("files", file));
    if (request.uploadCategory) formData.append("uploadCategory", request.uploadCategory);
    if (request.description) formData.append("description", request.description);
    if (request.isPublic !== undefined) formData.append("isPublic", String(request.isPublic));
    if (request.uploadedBy !== undefined) formData.append("uploadedBy", String(request.uploadedBy));

    const response = await uploadServiceInstance.post("/upload/files", formData);
    return (response.data?.data ?? []) as FileUpload[];
};

const uploadSingleFile = async (
    file: File,
    uploadCategory?: string,
    description?: string,
    isPublic: boolean = false,
    uploadedBy?: number
): Promise<FileUpload> => {
    const formData = new FormData();
    formData.append("file", file);
    if (uploadCategory) formData.append("uploadCategory", uploadCategory);
    if (description) formData.append("description", description);
    formData.append("isPublic", String(isPublic));
    if (uploadedBy !== undefined) formData.append("uploadedBy", String(uploadedBy));

    const response = await uploadServiceInstance.post("/upload/file", formData);
    return response.data?.data as FileUpload;
};

const getFileById = async (id: number): Promise<FileUpload> => {
    const res = await uploadServiceInstance.get(`/upload/files/${id}`);
    return res.data?.data as FileUpload;
};

const getFileByStoredFilename = async (storedFilename: string): Promise<FileUpload> => {
    const res = await uploadServiceInstance.get(`/upload/files/filename/${storedFilename}`);
    return res.data?.data as FileUpload;
};

const deleteFile = async (id: number): Promise<void> => {
    await uploadServiceInstance.delete(`/upload/files/${id}`);
};

const deleteFilePermanently = async (id: number): Promise<void> => {
    await uploadServiceInstance.delete(`/upload/files/${id}/permanent`);
};

const createDownloadUrlByStoredFilename = (storedFilename: string): string => {
    return `${serviceConfig.uploadServiceBaseURL}/upload/files/filename/${storedFilename}/download`;
};

const createThumbnailUrlByStoredFilename = (storedFilename: string): string => {
    return `${serviceConfig.uploadServiceBaseURL}/upload/files/filename/${storedFilename}/thumbnail`;
};

const createDownloadUrlById = (id: number): string => {
    const token = localStorage.getItem("token");
    return `${serviceConfig.uploadServiceBaseURL}/upload/files/${id}/download?token=${token}`;
};

export {
    model,
    uploadFiles,
    uploadSingleFile,
    getFileById,
    getFileByStoredFilename,
    deleteFile,
    deleteFilePermanently,
    createDownloadUrlByStoredFilename,
    createThumbnailUrlByStoredFilename,
    createDownloadUrlById
};

export const uploadService = {
    uploadFiles,
    uploadSingleFile,
    getFileById,
    getFileByStoredFilename,
    deleteFile,
    deleteFilePermanently,
    createDownloadUrlByStoredFilename,
    createThumbnailUrlByStoredFilename,
    createDownloadUrlById
};



package com.example.upload_service.services.interfaces;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.example.upload_service.enums.FileUploadType;
import com.example.upload_service.requests.FileUpdateRequest;
import com.example.upload_service.requests.FileUploadRequest;
import com.example.upload_service.resources.FileUploadResource;

public interface FileUploadServiceInterface {
    
    List<FileUploadResource> uploadFiles(FileUploadRequest request);
    
    FileUploadResource uploadSingleFile(MultipartFile file, String uploadCategory, FileUploadType uploadType, String description, 
                                      Boolean isPublic, Long uploadedBy);
    
    FileUploadResource getFileById(Long id);
    
    FileUploadResource getFileByStoredFilename(String storedFilename);
    
    Page<FileUploadResource> getFilesByUser(Long uploadedBy, Pageable pageable);
    
    Page<FileUploadResource> getFilesByCategory(String uploadCategory, Pageable pageable);
    
    Page<FileUploadResource> getFilesByType(FileUploadType uploadType, Pageable pageable);
    
    Page<FileUploadResource> getPublicFiles(Pageable pageable);
    
    // Page<FileUploadResource> getAllFiles(Pageable pageable);
    
    Page<FileUploadResource> getFilesWithFilters(Long uploadedBy, String uploadCategory, 
                                               Boolean isPublic, String contentType, FileUploadType uploadType, Pageable pageable);
    
    FileUploadResource updateFile(Long id, FileUpdateRequest request);
    
    void deleteFile(Long id);
    
    void deleteFilePermanently(Long id);
    
    byte[] downloadFile(Long id);
    
    byte[] downloadFileByStoredFilename(String storedFilename);
    
    byte[] getThumbnail(Long id);
    
    byte[] getThumbnailByStoredFilename(String storedFilename);
    
    List<FileUploadResource> getFilesByDateRange(String startDate, String endDate);
    
    Long getUserFileCount(Long uploadedBy);
    
    Long getUserTotalFileSize(Long uploadedBy);
    
    boolean validateFileType(String contentType, String filename);
    
    boolean validateFileSize(Long fileSize);
}

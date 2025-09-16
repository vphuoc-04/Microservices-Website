package com.example.upload_service.resources;

import java.time.LocalDateTime;

import com.example.upload_service.entities.FileUpload;
import com.example.upload_service.enums.FileUploadType;

import lombok.Data;

@Data
public class FileUploadResource {
    private Long id;
    private String originalFilename;
    private String storedFilename;
    private String filePath;
    private Long fileSize;
    private String contentType;
    private String fileExtension;
    private Long uploadedBy;
    private String uploadCategory;
    private FileUploadType uploadType;
    private String description;
    private Boolean isPublic;
    private String thumbnailPath;
    private String metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String downloadUrl;
    private String thumbnailUrl;
    
    public static FileUploadResource fromEntity(FileUpload fileUpload) {
        FileUploadResource resource = new FileUploadResource();
        resource.setId(fileUpload.getId());
        resource.setOriginalFilename(fileUpload.getOriginalFilename());
        resource.setStoredFilename(fileUpload.getStoredFilename());
        resource.setFilePath(fileUpload.getFilePath());
        resource.setFileSize(fileUpload.getFileSize());
        resource.setContentType(fileUpload.getContentType());
        resource.setFileExtension(fileUpload.getFileExtension());
        resource.setUploadedBy(fileUpload.getUploadedBy());
        resource.setUploadCategory(fileUpload.getUploadCategory());
        resource.setUploadType(fileUpload.getUploadType());
        resource.setDescription(fileUpload.getDescription());
        resource.setIsPublic(fileUpload.getIsPublic());
        resource.setThumbnailPath(fileUpload.getThumbnailPath());
        resource.setMetadata(fileUpload.getMetadata());
        resource.setCreatedAt(fileUpload.getCreatedAt());
        resource.setUpdatedAt(fileUpload.getUpdatedAt());
        return resource;
    }
}

package com.example.upload_service.requests;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.upload_service.enums.FileUploadType;

import lombok.Data;

@Data
public class FileUploadRequest {
    private List<MultipartFile> files;
    private String uploadCategory;
    private FileUploadType uploadType;
    private String description;
    private Boolean isPublic = false;
    private Long uploadedBy;
}

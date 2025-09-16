package com.example.upload_service.requests;

import com.example.upload_service.enums.FileUploadType;

import lombok.Data;

@Data
public class FileUpdateRequest {
    private String description;
    private Boolean isPublic;
    private String uploadCategory;
    private FileUploadType uploadType;
}

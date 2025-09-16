package com.example.upload_service.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.upload_service.entities.FileUpload;
import com.example.upload_service.enums.FileUploadType;
import com.example.upload_service.repositories.FileUploadRepository;
import com.example.upload_service.requests.FileUpdateRequest;
import com.example.upload_service.requests.FileUploadRequest;
import com.example.upload_service.resources.FileUploadResource;
import com.example.upload_service.services.interfaces.FileUploadServiceInterface;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService implements FileUploadServiceInterface {
    
    private final FileUploadRepository fileUploadRepository;
    
    @Value("${file.upload.path}")
    private String uploadPath;
    
    @Value("${file.upload.allowed-extensions}")
    private String allowedExtensions;
    
    @Value("${file.upload.max-size}")
    private Long maxFileSize;
    
    @Value("${file.upload.thumbnail.enabled}")
    private Boolean thumbnailEnabled;
    
    @Value("${file.upload.thumbnail.width}")
    private Integer thumbnailWidth;
    
    @Value("${file.upload.thumbnail.height}")
    private Integer thumbnailHeight;
    
    @Override
    public List<FileUploadResource> uploadFiles(FileUploadRequest request) {
        List<FileUploadResource> uploadedFiles = new ArrayList<>();
        
        for (MultipartFile file : request.getFiles()) {
            try {
                FileUploadResource uploadedFile = uploadSingleFile(
                    file, 
                    request.getUploadCategory(), 
                    request.getUploadType(),
                    request.getDescription(), 
                    request.getIsPublic(), 
                    request.getUploadedBy()
                );
                uploadedFiles.add(uploadedFile);
            } catch (Exception e) {
                log.error("Error uploading file: {}", file.getOriginalFilename(), e);
                throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
            }
        }
        
        return uploadedFiles;
    }
    
    @Override
    public FileUploadResource uploadSingleFile(MultipartFile file, String uploadCategory, FileUploadType uploadType, String description, 
                                             Boolean isPublic, Long uploadedBy) {
        try {
            validateFile(file);
            
            String originalFilename = file.getOriginalFilename();
            String fileExtension = FilenameUtils.getExtension(originalFilename);
            String storedFilename = generateUniqueFilename(originalFilename);
            
            Path uploadDir = Paths.get(uploadPath, resolveDirectory(uploadCategory, uploadType));
            Files.createDirectories(uploadDir);
            
            Path filePath = uploadDir.resolve(storedFilename);
            Files.copy(file.getInputStream(), filePath);
            
            String thumbnailPath = null;
            if (thumbnailEnabled && isImageFile(file.getContentType())) {
                thumbnailPath = generateThumbnail(filePath, uploadDir, storedFilename);
            }
            
            FileUpload fileUpload = new FileUpload();
            fileUpload.setOriginalFilename(originalFilename);
            fileUpload.setStoredFilename(storedFilename);
            fileUpload.setFilePath(filePath.toString());
            fileUpload.setFileSize(file.getSize());
            fileUpload.setContentType(file.getContentType());
            fileUpload.setFileExtension(fileExtension);
            fileUpload.setUploadedBy(uploadedBy);
            fileUpload.setUploadCategory(uploadCategory);
            fileUpload.setUploadType(resolveUploadType(uploadType, file.getContentType(), fileExtension));
            fileUpload.setDescription(description);
            fileUpload.setIsPublic(isPublic != null ? isPublic : false);
            fileUpload.setThumbnailPath(thumbnailPath);
            fileUpload.setMetadata(generateMetadata(file));
            
            FileUpload savedFile = fileUploadRepository.save(fileUpload);
            
            return FileUploadResource.fromEntity(savedFile);
            
        } catch (IOException e) {
            log.error("Error saving file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
        }
    }
    
    @Override
    public FileUploadResource getFileById(Long id) {
        FileUpload fileUpload = fileUploadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        
        if (fileUpload.getIsDeleted()) {
            throw new RuntimeException("File has been deleted");
        }
        
        return FileUploadResource.fromEntity(fileUpload);
    }
    
    @Override
    public FileUploadResource getFileByStoredFilename(String storedFilename) {
        FileUpload fileUpload = fileUploadRepository.findByStoredFilenameAndIsDeletedFalse(storedFilename)
            .orElseThrow(() -> new RuntimeException("File not found: " + storedFilename));
        
        return FileUploadResource.fromEntity(fileUpload);
    }
    
    @Override
    public Page<FileUploadResource> getFilesByUser(Long uploadedBy, Pageable pageable) {
        Page<FileUpload> files = fileUploadRepository.findByUploadedByAndIsDeletedFalse(uploadedBy, pageable);
        return files.map(FileUploadResource::fromEntity);
    }
    
    @Override
    public Page<FileUploadResource> getFilesByCategory(String uploadCategory, Pageable pageable) {
        Page<FileUpload> files = fileUploadRepository.findByUploadCategoryAndIsDeletedFalse(uploadCategory, pageable);
        return files.map(FileUploadResource::fromEntity);
    }
    
    @Override
    public Page<FileUploadResource> getFilesByType(FileUploadType uploadType, Pageable pageable) {
        Page<FileUpload> files = fileUploadRepository.findByUploadTypeAndIsDeletedFalse(uploadType, pageable);
        return files.map(FileUploadResource::fromEntity);
    }
    
    @Override
    public Page<FileUploadResource> getPublicFiles(Pageable pageable) {
        Page<FileUpload> files = fileUploadRepository.findByIsPublicTrueAndIsDeletedFalse(pageable);
        return files.map(FileUploadResource::fromEntity);
    }
    
    // @Override
    // public Page<FileUploadResource> getAllFiles(Pageable pageable) {
    //     Page<FileUpload> files = fileUploadRepository.findAll(pageable);
    //     return files.map(file -> {
    //         if (!file.getIsDeleted()) {
    //             return FileUploadResource.fromEntity(file);
    //         }
    //         return null;
    //     }).filter(Objects::nonNull);
    // }
    
    @Override
    public Page<FileUploadResource> getFilesWithFilters(Long uploadedBy, String uploadCategory, 
                                                      Boolean isPublic, String contentType, FileUploadType uploadType, Pageable pageable) {
        Page<FileUpload> files = fileUploadRepository.findWithFilters(uploadedBy, uploadCategory, isPublic, contentType, uploadType, pageable);
        return files.map(FileUploadResource::fromEntity);
    }
    
    @Override
    public FileUploadResource updateFile(Long id, FileUpdateRequest request) {
        FileUpload fileUpload = fileUploadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        
        if (fileUpload.getIsDeleted()) {
            throw new RuntimeException("File has been deleted");
        }
        
        if (request.getDescription() != null) {
            fileUpload.setDescription(request.getDescription());
        }
        if (request.getIsPublic() != null) {
            fileUpload.setIsPublic(request.getIsPublic());
        }
        if (request.getUploadCategory() != null) {
            fileUpload.setUploadCategory(request.getUploadCategory());
        }
        if (request.getUploadType() != null) {
            fileUpload.setUploadType(request.getUploadType());
        }
        
        FileUpload updatedFile = fileUploadRepository.save(fileUpload);
        return FileUploadResource.fromEntity(updatedFile);
    }
    
    @Override
    public void deleteFile(Long id) {
        FileUpload fileUpload = fileUploadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        
        fileUpload.setIsDeleted(true);
        fileUpload.setDeletedAt(LocalDateTime.now());
        fileUploadRepository.save(fileUpload);
    }
    
    @Override
    public void deleteFilePermanently(Long id) {
        FileUpload fileUpload = fileUploadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        
        try {
            // Delete physical file
            Files.deleteIfExists(Paths.get(fileUpload.getFilePath()));
            
            // Delete thumbnail if exists
            if (fileUpload.getThumbnailPath() != null) {
                Files.deleteIfExists(Paths.get(fileUpload.getThumbnailPath()));
            }
            
            // Delete from database
            fileUploadRepository.delete(fileUpload);
            
        } catch (IOException e) {
            log.error("Error deleting file: {}", fileUpload.getOriginalFilename(), e);
            throw new RuntimeException("Failed to delete file: " + fileUpload.getOriginalFilename(), e);
        }
    }
    
    @Override
    public byte[] downloadFile(Long id) {
        FileUpload fileUpload = fileUploadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        
        if (fileUpload.getIsDeleted()) {
            throw new RuntimeException("File has been deleted");
        }
        
        try {
            return Files.readAllBytes(Paths.get(fileUpload.getFilePath()));
        } catch (IOException e) {
            log.error("Error reading file: {}", fileUpload.getOriginalFilename(), e);
            throw new RuntimeException("Failed to read file: " + fileUpload.getOriginalFilename(), e);
        }
    }
    
    @Override
    public byte[] downloadFileByStoredFilename(String storedFilename) {
        FileUpload fileUpload = fileUploadRepository.findByStoredFilenameAndIsDeletedFalse(storedFilename)
            .orElseThrow(() -> new RuntimeException("File not found: " + storedFilename));
        
        try {
            return Files.readAllBytes(Paths.get(fileUpload.getFilePath()));
        } catch (IOException e) {
            log.error("Error reading file: {}", fileUpload.getOriginalFilename(), e);
            throw new RuntimeException("Failed to read file: " + fileUpload.getOriginalFilename(), e);
        }
    }
    
    @Override
    public byte[] getThumbnail(Long id) {
        FileUpload fileUpload = fileUploadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        
        if (fileUpload.getIsDeleted()) {
            throw new RuntimeException("File has been deleted");
        }
        
        if (fileUpload.getThumbnailPath() == null) {
            throw new RuntimeException("Thumbnail not available for this file");
        }
        
        try {
            return Files.readAllBytes(Paths.get(fileUpload.getThumbnailPath()));
        } catch (IOException e) {
            log.error("Error reading thumbnail: {}", fileUpload.getThumbnailPath(), e);
            throw new RuntimeException("Failed to read thumbnail", e);
        }
    }
    
    @Override
    public byte[] getThumbnailByStoredFilename(String storedFilename) {
        FileUpload fileUpload = fileUploadRepository.findByStoredFilenameAndIsDeletedFalse(storedFilename)
            .orElseThrow(() -> new RuntimeException("File not found: " + storedFilename));
        
        if (fileUpload.getThumbnailPath() == null) {
            throw new RuntimeException("Thumbnail not available for this file");
        }
        
        try {
            return Files.readAllBytes(Paths.get(fileUpload.getThumbnailPath()));
        } catch (IOException e) {
            log.error("Error reading thumbnail: {}", fileUpload.getThumbnailPath(), e);
            throw new RuntimeException("Failed to read thumbnail", e);
        }
    }
    
    @Override
    public List<FileUploadResource> getFilesByDateRange(String startDate, String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate + " 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        LocalDateTime end = LocalDateTime.parse(endDate + " 23:59:59", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        List<FileUpload> files = fileUploadRepository.findByCreatedAtBetween(start, end);
        return files.stream()
            .filter(file -> !file.getIsDeleted())
            .map(FileUploadResource::fromEntity)
            .collect(Collectors.toList());
    }
    
    @Override
    public Long getUserFileCount(Long uploadedBy) {
        return fileUploadRepository.countByUploadedBy(uploadedBy);
    }
    
    @Override
    public Long getUserTotalFileSize(Long uploadedBy) {
        Long totalSize = fileUploadRepository.sumFileSizeByUploadedBy(uploadedBy);
        return totalSize != null ? totalSize : 0L;
    }
    
    @Override
    public boolean validateFileType(String contentType, String filename) {
        String extension = FilenameUtils.getExtension(filename).toLowerCase();
        List<String> allowedExts = Arrays.asList(allowedExtensions.split(","));
        return allowedExts.contains(extension);
    }
    
    @Override
    public boolean validateFileSize(Long fileSize) {
        return fileSize <= maxFileSize;
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        if (!validateFileType(file.getContentType(), file.getOriginalFilename())) {
            throw new RuntimeException("File type not allowed");
        }
        
        if (!validateFileSize(file.getSize())) {
            throw new RuntimeException("File size exceeds maximum allowed size");
        }
    }
    
    private String generateUniqueFilename(String originalFilename) {
        String extension = FilenameUtils.getExtension(originalFilename);
        String baseName = FilenameUtils.getBaseName(originalFilename);
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return baseName + "_" + timestamp + "_" + uuid + "." + extension;
    }
    
    private String generateThumbnail(Path filePath, Path uploadDir, String storedFilename) throws IOException {
        String thumbnailFilename = "thumb_" + storedFilename;
        Path thumbnailPath = uploadDir.resolve(thumbnailFilename);
        
        Thumbnails.of(filePath.toFile())
            .size(thumbnailWidth, thumbnailHeight)
            .toFile(thumbnailPath.toFile());
        
        return thumbnailPath.toString();
    }
    
    private boolean isImageFile(String contentType) {
        return contentType != null && contentType.startsWith("image/");
    }
    
    private String generateMetadata(MultipartFile file) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("originalSize", file.getSize());
        metadata.put("uploadTime", LocalDateTime.now().toString());
        metadata.put("contentType", file.getContentType());

        try {
            return new ObjectMapper().writeValueAsString(metadata);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize metadata to JSON, falling back to empty object", e);
            return "{}";
        }
    }

    private String resolveDirectory(String uploadCategory, FileUploadType uploadType) {
        String category = uploadCategory != null ? uploadCategory : "general";
        String typeFolder = uploadType != null ? uploadType.name().toLowerCase() : "other";
        return Paths.get(category, typeFolder).toString();
    }

    private FileUploadType resolveUploadType(FileUploadType providedType, String contentType, String extension) {
        if (providedType != null) return providedType;
        if (contentType != null && contentType.startsWith("image/")) {
            if (thumbnailEnabled) {
                return FileUploadType.IMAGE;
            }
            return FileUploadType.IMAGE;
        }
        if (contentType != null && contentType.startsWith("video/")) return FileUploadType.VIDEO;
        List<String> docExts = Arrays.asList("pdf","doc","docx","xls","xlsx","ppt","pptx","txt");
        if (extension != null && docExts.contains(extension.toLowerCase())) return FileUploadType.DOCUMENT;
        return FileUploadType.OTHER;
    }
}

package com.example.upload_service.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.common_lib.resources.ApiResource;
import com.example.common_lib.services.JwtService;
import com.example.upload_service.enums.FileUploadType;
import com.example.upload_service.requests.FileUpdateRequest;
import com.example.upload_service.requests.FileUploadRequest;
import com.example.upload_service.resources.FileUploadResource;
import com.example.upload_service.services.interfaces.FileUploadServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/upload")
public class FileUploadController {
    
    private final FileUploadServiceInterface fileUploadService;
    private final JwtService jwtService;
    
    @PostMapping("/files")
    public ResponseEntity<?> uploadFiles(@ModelAttribute FileUploadRequest request, @RequestHeader(value = "Authorization", required = false) String bearerToken) {
        try {
            if (request.getUploadedBy() == null && bearerToken != null && bearerToken.startsWith("Bearer ")) {
                String token = bearerToken.substring(7);
                String userId = jwtService.getUserIdFromJwt(token);
                if (userId != null) {
                    request.setUploadedBy(Long.valueOf(userId));
                }
            }
            List<FileUploadResource> uploadedFiles = fileUploadService.uploadFiles(request);
            return ResponseEntity.ok(ApiResource.ok(uploadedFiles, "Files uploaded successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResource.error("BAD_REQUEST", e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }
    
    @PostMapping("/file")
    public ResponseEntity<?> uploadSingleFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "uploadCategory", required = false) String uploadCategory,
            @RequestParam(value = "uploadType", required = false) FileUploadType uploadType,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "isPublic", defaultValue = "false") Boolean isPublic,
            @RequestParam(value = "uploadedBy", required = false) Long uploadedBy,
            @RequestHeader(value = "Authorization", required = false) String bearerToken) {
        try {
            if (uploadedBy == null && bearerToken != null && bearerToken.startsWith("Bearer ")) {
                String token = bearerToken.substring(7);
                String userId = jwtService.getUserIdFromJwt(token);
                if (userId != null) {
                    uploadedBy = Long.valueOf(userId);
                }
            }
            FileUploadResource uploadedFile = fileUploadService.uploadSingleFile(
                file, uploadCategory, uploadType, description, isPublic, uploadedBy);
            return ResponseEntity.ok(ApiResource.ok(uploadedFile, "File uploaded successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResource.error("BAD_REQUEST", e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }
    
    @GetMapping("/files/{id}")
    public ResponseEntity<?> getFileById(@PathVariable Long id) {
        try {
            FileUploadResource file = fileUploadService.getFileById(id);
            return ResponseEntity.ok(ApiResource.ok(file, "File fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResource.error("NOT_FOUND", "File not found", HttpStatus.NOT_FOUND));
        }
    }
    
    @GetMapping("/files/filename/{storedFilename}")
    public ResponseEntity<?> getFileByStoredFilename(@PathVariable String storedFilename) {
        try {
            FileUploadResource file = fileUploadService.getFileByStoredFilename(storedFilename);
            return ResponseEntity.ok(ApiResource.ok(file, "File fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResource.error("NOT_FOUND", "File not found", HttpStatus.NOT_FOUND));
        }
    }
    
    @GetMapping("/files/user/{uploadedBy}")
    public ResponseEntity<?> getFilesByUser(
            @PathVariable Long uploadedBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FileUploadResource> files = fileUploadService.getFilesByUser(uploadedBy, pageable);
            return ResponseEntity.ok(ApiResource.ok(files, "Files fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResource.error("BAD_REQUEST", e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }
    
    @GetMapping("/files/category/{uploadCategory}")
    public ResponseEntity<?> getFilesByCategory(
            @PathVariable String uploadCategory,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FileUploadResource> files = fileUploadService.getFilesByCategory(uploadCategory, pageable);
            return ResponseEntity.ok(ApiResource.ok(files, "Files fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResource.error("BAD_REQUEST", e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }
    
    @GetMapping("/files/public")
    public ResponseEntity<?> getPublicFiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FileUploadResource> files = fileUploadService.getPublicFiles(pageable);
            return ResponseEntity.ok(ApiResource.ok(files, "Files fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResource.error("BAD_REQUEST", e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }
    
    // @GetMapping("/files")
    // public ResponseEntity<Page<FileUploadResource>> getAllFiles(
    //         @RequestParam(defaultValue = "0") int page,
    //         @RequestParam(defaultValue = "10") int size) {
    //     try {
    //         Pageable pageable = PageRequest.of(page, size);
    //         Page<FileUploadResource> files = fileUploadService.getAllFiles(pageable);
    //         return ResponseEntity.ok(files);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    //     }
    // }
    
    @GetMapping("/files/filter")
    public ResponseEntity<?> getFilesWithFilters(
            @RequestParam(value = "uploadedBy", required = false) Long uploadedBy,
            @RequestParam(value = "uploadCategory", required = false) String uploadCategory,
            @RequestParam(value = "isPublic", required = false) Boolean isPublic,
            @RequestParam(value = "contentType", required = false) String contentType,
            @RequestParam(value = "uploadType", required = false) FileUploadType uploadType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FileUploadResource> files = fileUploadService.getFilesWithFilters(
                uploadedBy, uploadCategory, isPublic, contentType, uploadType, pageable);
            return ResponseEntity.ok(ApiResource.ok(files, "Files fetched successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResource.error("BAD_REQUEST", e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }
    
    @PutMapping("/files/{id}")
    public ResponseEntity<?> updateFile(
            @PathVariable Long id,
            @RequestBody FileUpdateRequest request) {
        try {
            FileUploadResource updatedFile = fileUploadService.updateFile(id, request);
            return ResponseEntity.ok(ApiResource.ok(updatedFile, "File updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResource.error("NOT_FOUND", "File not found", HttpStatus.NOT_FOUND));
        }
    }
    
    @DeleteMapping("/files/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        try {
            fileUploadService.deleteFile(id);
            return ResponseEntity.ok(ApiResource.message("File deleted successfully", HttpStatus.OK));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResource.error("NOT_FOUND", "File not found", HttpStatus.NOT_FOUND));
        }
    }
    
    @DeleteMapping("/files/{id}/permanent")
    public ResponseEntity<?> deleteFilePermanently(@PathVariable Long id) {
        try {
            fileUploadService.deleteFilePermanently(id);
            return ResponseEntity.ok(ApiResource.message("File deleted permanently", HttpStatus.OK));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResource.error("NOT_FOUND", "File not found", HttpStatus.NOT_FOUND));
        }
    }
    
    @GetMapping("/files/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        try {
            byte[] fileContent = fileUploadService.downloadFile(id);
            FileUploadResource fileInfo = fileUploadService.getFileById(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(fileInfo.getContentType()));
            headers.setContentDispositionFormData("attachment", fileInfo.getOriginalFilename());
            headers.setContentLength(fileContent.length);
            
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/files/filename/{storedFilename}/download")
    public ResponseEntity<byte[]> downloadFileByStoredFilename(@PathVariable String storedFilename) {
        try {
            byte[] fileContent = fileUploadService.downloadFileByStoredFilename(storedFilename);
            FileUploadResource fileInfo = fileUploadService.getFileByStoredFilename(storedFilename);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(fileInfo.getContentType()));
            headers.setContentDispositionFormData("attachment", fileInfo.getOriginalFilename());
            headers.setContentLength(fileContent.length);
            
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/files/{id}/thumbnail")
    public ResponseEntity<byte[]> getThumbnail(@PathVariable Long id) {
        try {
            byte[] thumbnailContent = fileUploadService.getThumbnail(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            headers.setContentLength(thumbnailContent.length);
            
            return new ResponseEntity<>(thumbnailContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/files/filename/{storedFilename}/thumbnail")
    public ResponseEntity<byte[]> getThumbnailByStoredFilename(@PathVariable String storedFilename) {
        try {
            byte[] thumbnailContent = fileUploadService.getThumbnailByStoredFilename(storedFilename);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            headers.setContentLength(thumbnailContent.length);
            
            return new ResponseEntity<>(thumbnailContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/files/date-range")
    public ResponseEntity<List<FileUploadResource>> getFilesByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            List<FileUploadResource> files = fileUploadService.getFilesByDateRange(startDate, endDate);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    // @GetMapping("/files/user/{uploadedBy}/stats")
    // public ResponseEntity<Object> getUserFileStats(@PathVariable Long uploadedBy) {
    //     try {
    //         Long fileCount = fileUploadService.getUserFileCount(uploadedBy);
    //         Long totalSize = fileUploadService.getUserTotalFileSize(uploadedBy);
            
    //         return ResponseEntity.ok(new Object() {
    //             public final Long fileCount = fileCount;
    //             public final Long totalSize = totalSize;
    //         });
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    //     }
    // }
}

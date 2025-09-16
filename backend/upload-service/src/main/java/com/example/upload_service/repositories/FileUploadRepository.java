package com.example.upload_service.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.upload_service.entities.FileUpload;
import com.example.upload_service.enums.FileUploadType;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
    
    Optional<FileUpload> findByStoredFilenameAndIsDeletedFalse(String storedFilename);
    
    List<FileUpload> findByUploadedByAndIsDeletedFalse(Long uploadedBy);
    
    Page<FileUpload> findByUploadedByAndIsDeletedFalse(Long uploadedBy, Pageable pageable);
    
    List<FileUpload> findByUploadCategoryAndIsDeletedFalse(String uploadCategory);
    
    Page<FileUpload> findByUploadCategoryAndIsDeletedFalse(String uploadCategory, Pageable pageable);
    
    Page<FileUpload> findByUploadTypeAndIsDeletedFalse(FileUploadType uploadType, Pageable pageable);
    
    List<FileUpload> findByIsPublicTrueAndIsDeletedFalse();
    
    Page<FileUpload> findByIsPublicTrueAndIsDeletedFalse(Pageable pageable);
    
    @Query("SELECT f FROM FileUpload f WHERE f.isDeleted = false AND " +
           "(:uploadedBy IS NULL OR f.uploadedBy = :uploadedBy) AND " +
           "(:uploadCategory IS NULL OR f.uploadCategory = :uploadCategory) AND " +
           "(:isPublic IS NULL OR f.isPublic = :isPublic) AND " +
           "(:contentType IS NULL OR f.contentType LIKE %:contentType%) AND " +
           "(:uploadType IS NULL OR f.uploadType = :uploadType)")
    Page<FileUpload> findWithFilters(@Param("uploadedBy") Long uploadedBy,
                                   @Param("uploadCategory") String uploadCategory,
                                   @Param("isPublic") Boolean isPublic,
                                   @Param("contentType") String contentType,
                                   @Param("uploadType") FileUploadType uploadType,
                                   Pageable pageable);
    
    @Query("SELECT f FROM FileUpload f WHERE f.isDeleted = false AND f.createdAt BETWEEN :startDate AND :endDate")
    List<FileUpload> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(f) FROM FileUpload f WHERE f.isDeleted = false AND f.uploadedBy = :uploadedBy")
    Long countByUploadedBy(@Param("uploadedBy") Long uploadedBy);
    
    @Query("SELECT SUM(f.fileSize) FROM FileUpload f WHERE f.isDeleted = false AND f.uploadedBy = :uploadedBy")
    Long sumFileSizeByUploadedBy(@Param("uploadedBy") Long uploadedBy);
}

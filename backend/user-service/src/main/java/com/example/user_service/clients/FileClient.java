package com.example.user_service.clients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FileClient {

    private final RestTemplate restTemplate;

    @Value("${upload.service.base-url:http://localhost:8085/api/v1}")
    private String uploadServiceBaseUrl;

    public FileInfo getFileById(Long id) {
        if (id == null) return null;
        try {
            String url = uploadServiceBaseUrl + "/upload/files/" + id;
            ResponseEntity<ApiEnvelope<FileInfo>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiEnvelope<FileInfo>>() {}
            );
            ApiEnvelope<FileInfo> body = response.getBody();
            return body != null ? body.data : null;
        } catch (Exception e) {
            return null;
        }
    }

    public String buildDownloadUrlById(Long id) {
        if (id == null) return null;
        return uploadServiceBaseUrl + "/upload/files/" + id + "/download";
    }

    public void deleteFilePermanently(Long id, String bearerToken) {
        if (id == null) return;
        try {
            String url = uploadServiceBaseUrl + "/upload/files/" + id + "/permanent";
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            if (bearerToken != null && !bearerToken.isBlank()) {
                headers.add("Authorization", bearerToken);
            }
            org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);
            restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
        } catch (Exception ignored) {}
    }

    // --- Helper DTOs ---
    public static class FileInfo {
        public Long id;
        public String storedFilename;
        public String contentType;
    }

    public static class ApiEnvelope<T> {
        public boolean success;
        public T data;
    }
}



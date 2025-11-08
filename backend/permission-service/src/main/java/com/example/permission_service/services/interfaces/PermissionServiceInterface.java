package com.example.permission_service.services.interfaces;

import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;

import com.example.permission_service.entities.Permission;

import jakarta.servlet.http.HttpServletRequest;

public interface PermissionServiceInterface {
    Page<Permission> paginate(Map<String, String[]> parameters, HttpServletRequest request);
    Optional<Permission> findById(Long id);
    Permission save(Permission permission);
}

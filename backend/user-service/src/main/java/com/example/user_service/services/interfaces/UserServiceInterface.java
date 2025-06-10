package com.example.user_service.services.interfaces;

import java.util.Map;

import org.springframework.data.domain.Page;

import com.example.user_service.entities.User;
import com.example.auth_service.requests.LoginRequest;
import com.example.auth_service.requests.RegisterRequest;

public interface UserServiceInterface {
    Object validateRegistration(RegisterRequest request);
    Object authenticate(LoginRequest request);
    Page<User> paginate(Map<String, String[]> parameters);
}

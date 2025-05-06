package com.example.backend.modules.users.services.interfaces;

import java.util.Map;

import org.springframework.data.domain.Page;

import com.example.backend.modules.users.entities.User;
import com.example.backend.modules.users.requests.LoginRequest;
import com.example.backend.modules.users.requests.RegisterRequest;

public interface UserServiceInterface {
    Object validateRegistration(RegisterRequest request);
    Object authenticate(LoginRequest request);
    Page<User> paginate(Map<String, String[]> parameters);
}

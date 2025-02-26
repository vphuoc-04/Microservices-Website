package com.example.backend.modules.users.services.interfaces;

import com.example.backend.modules.users.requests.LoginRequest;
import com.example.backend.modules.users.requests.RegisterRequest;

public interface UserServiceInterface {
    Object validateRegistration(RegisterRequest request);
    Object authenticate(LoginRequest request);
}

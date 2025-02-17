package com.example.backend.modules.users.controllers;

import org.springframework.http.ResponseCookie;

import java.time.Duration;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.modules.users.requests.LoginRequest;
import com.example.backend.modules.users.resources.LoginResource;
import com.example.backend.modules.users.services.interfaces.UserServiceInterface;
import com.example.backend.resources.ApiResource;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {
    private final UserServiceInterface userService;
    public AuthController(
        UserServiceInterface userService
    ){
        this.userService = userService;
    }
    @PostMapping("login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Object result = userService.authenticate(request);
        if (result instanceof LoginResource loginResource) {
            ResponseCookie cookie = ResponseCookie.from("cookies", loginResource.getToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofMinutes(5)) 
                .build();

            ApiResource<LoginResource> response = ApiResource.ok(loginResource, "SUCCESS");

            return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString()) 
                .body(response);
        }
        if (result instanceof ApiResource apiResource) {
            return ResponseEntity.unprocessableEntity().body(apiResource);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Network error");
    }
}

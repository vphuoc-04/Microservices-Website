package com.example.backend.modules.users.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.modules.users.entities.User;
import com.example.backend.modules.users.entities.UserCatalogue;
import com.example.backend.modules.users.repositories.UserCatalogueRepository;
import com.example.backend.modules.users.repositories.UserRepository;
import com.example.backend.modules.users.requests.LoginRequest;
import com.example.backend.modules.users.requests.RegisterRequest;
import com.example.backend.modules.users.resources.LoginResource;
import com.example.backend.modules.users.resources.UserResource;
import com.example.backend.modules.users.services.interfaces.UserServiceInterface;
import com.example.backend.resources.ApiResource;
import com.example.backend.services.BaseService;
import com.example.backend.services.JwtService;

@Service
public class UserService extends BaseService implements UserServiceInterface {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCatalogueRepository userCatalogueRepository;

    @Autowired 
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${jwt.defaultExpiration}")
    private Long defaultExpiration;

    @Override
    public Object validateRegistration(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ApiResource.error("EMAIL_EXISTS", "Email already in use", HttpStatus.UNPROCESSABLE_ENTITY);
        }
        
        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            return ApiResource.error("PHONE_EXISTS", "Phone already in use", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        Long catalogueId = userCatalogueRepository.findByName("Customers")
            .map(UserCatalogue::getId)
            .orElseThrow(() -> new RuntimeException("Catalogue 'Customers' not found"));

        User user = new User();
            user.setFirstName(request.getFirstName());
            user.setMiddleName(request.getMiddleName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setCatalogueId(catalogueId);

        userRepository.save(user);

        UserResource userResource = UserResource.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .middleName(user.getMiddleName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .catalogueId(user.getCatalogueId())
            .build();

        return ApiResource.ok(userResource, "User registered successfully");
    }

    @Override
    public Object authenticate(LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new BadCredentialsException("Incorrect email or passowrd")
            );

            if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Incorrect email or password");
            }

            UserResource userResource = UserResource.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();

            String token = jwtService.generateToken(user.getId(), user.getEmail(), defaultExpiration);
            String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

            return new LoginResource(token, refreshToken, userResource);

        } catch (BadCredentialsException e) {
            return ApiResource.error("AUTH_ERROR", e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}

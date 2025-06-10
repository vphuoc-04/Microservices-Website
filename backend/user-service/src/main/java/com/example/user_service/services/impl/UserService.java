package com.example.user_service.services.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.user_service.entities.User;
import com.example.user_service.repositories.UserRepository;

import com.example.user_catalogue_service.entities.UserCatalogue;
import com.example.user_catalogue_service.repositories.UserCatalogueRepository;
import com.example.user_service.resources.UserResource;
import com.example.user_service.services.interfaces.UserServiceInterface;

import com.example.auth_service.requests.LoginRequest;
import com.example.auth_service.requests.RegisterRequest;
import com.example.auth_service.resources.LoginResource;

import com.example.common_lib.resources.ApiResource;
import com.example.common_lib.services.BaseService;
import com.example.common_lib.services.JwtService;

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

    @Override
    public Page<User> paginate(Map<String, String[]> parameters) {
        int page = parameters.containsKey("page") ? Integer.parseInt(parameters.get("page")[0]) : 1;
        int perpage = parameters.containsKey("perpage") ? Integer.parseInt(parameters.get("perpage")[0]) : 10;
        String sortParam = parameters.containsKey("sort") ? parameters.get("sort")[0] : null;
        Sort sort = createSort(sortParam);

        Pageable pageable = PageRequest.of(page - 1, perpage, sort);

        return userRepository.findAll(pageable);
    }
}

package com.example.backend.modules.users.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.modules.users.entities.UserCatalogue;
import com.example.backend.modules.users.requests.UserCatalogue.StoreRequest;
import com.example.backend.modules.users.resources.UserCatalogueResource;
import com.example.backend.modules.users.services.interfaces.UserCatalogueServiceInterface;
import com.example.backend.resources.ApiResource;
import com.example.backend.services.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
@RestController
@RequestMapping("api/v1")
public class UserCatalogueController {
    private final UserCatalogueServiceInterface userCatagoluesService;

    @Autowired
    private JwtService jwtService;

    public UserCatalogueController(
        UserCatalogueServiceInterface userCatagoluesService,
        JwtService jwtService
    ){
        this.userCatagoluesService = userCatagoluesService;
        this.jwtService = jwtService;
    }

    @GetMapping("/user_catalogue")
    public ResponseEntity<?> index(HttpServletRequest request) {
        Map<String, String[]> parameters = request.getParameterMap();

        Page<UserCatalogue> userCatalogues = userCatagoluesService.paginate(parameters);

        Page<UserCatalogueResource> userCatalogueResource = userCatalogues.map(userCatalogue -> 
            UserCatalogueResource.builder()
                .id(userCatalogue.getId())
                .createdBy(userCatalogue.getCreatedBy())
                .updatedBy(userCatalogue.getUpdatedBy())
                .name(userCatalogue.getName())
                .publish(userCatalogue.getPublish())
                .build()
        );

        ApiResource<Page<UserCatalogueResource>> response = ApiResource.ok(userCatalogueResource, "User catalogue data fetched successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/user_catalogue")
    public ResponseEntity<?> store(@Valid @RequestBody StoreRequest request, @RequestHeader("Authorization") String bearerToken) {
        try {
            String token = bearerToken.substring(7);

            String userId = jwtService.getUserIdFromJwt(token);

            Long createdBy = Long.valueOf(userId);

            UserCatalogue userCatalogue = userCatagoluesService.create(request, createdBy);

            UserCatalogueResource userCatalogueResource = UserCatalogueResource.builder()
                .id(userCatalogue.getId())
                .createdBy(userCatalogue.getCreatedBy())
                .updatedBy(userCatalogue.getUpdatedBy())
                .name(userCatalogue.getName())
                .publish(userCatalogue.getPublish())
                .build();

            ApiResource<UserCatalogueResource> response = ApiResource.ok(userCatalogueResource, "New user catalogue added successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResource.message("Network error", HttpStatus.UNAUTHORIZED));
        }
    }
}
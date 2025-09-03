package com.example.user_service.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;   
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.user_service.entities.User;
import com.example.user_service.entities.UserCatalogueUser;
import com.example.user_service.repositories.UserCatalogueUserRepository;
import com.example.user_service.repositories.UserRepository;

@RestController
@RequestMapping("/api/v1/user_catalogue_user")
public class UserCatalogueUserController {
    @Autowired
    private UserCatalogueUserRepository userCatalogueUserRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> assignUsers(@RequestBody Map<String, Object> request) {
        Long userCatalogueId = Long.valueOf(request.get("catalogueId").toString());
        List<Integer> userIds = (List<Integer>) request.get("userIds");

        for (Integer userId : userIds) {
            User user = userRepository.findById(userId.longValue())
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            UserCatalogueUser entity = new UserCatalogueUser();
            entity.setUserId(user.getId());
            entity.setUserCatalogueId(userCatalogueId);
            entity.setUser(user); // nếu bạn có mapping ManyToOne<User>
            userCatalogueUserRepository.save(entity);
        }

        return ResponseEntity.ok("Users assigned to catalogue successfully");
    }

    @GetMapping("/catalogues/{userId}")
    public List<Long> getCatalogueIdsByUserId(@PathVariable Long userId) {
        return userCatalogueUserRepository.findUserCatalogueIdsByUserId(userId);
    }

    @GetMapping("/by-catalogue/{userCatalogueId}")
    public List<Long> getUserIdsByUserCatalogueId(@PathVariable Long userCatalogueId) {
        return userCatalogueUserRepository.findByUserCatalogueId(userCatalogueId)
            .stream().map(ucu -> ucu.getUserId()).toList();
    }

    @Transactional
    @DeleteMapping("/delete/by-catalogue/{userCatalogueId}")
    public ResponseEntity<?> deleteByUserCatalogueId(@PathVariable Long userCatalogueId) {
        userCatalogueUserRepository.deleteByUserCatalogueId(userCatalogueId);
        return ResponseEntity.ok().build();
    }
} 
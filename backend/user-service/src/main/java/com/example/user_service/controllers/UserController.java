package com.example.user_service.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.common_lib.annotations.RequirePermission;
import com.example.common_lib.dtos.UserDto;
import com.example.common_lib.resources.ApiResource;
import com.example.user_service.entities.User;
import com.example.user_service.repositories.UserRepository;
import com.example.user_service.requests.UpdateRequest;
import com.example.user_service.resources.UserResource;
import com.example.user_service.services.interfaces.UserServiceInterface;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserServiceInterface userService;

    @Autowired
    private UserRepository userRepository;

    public UserController (
        UserServiceInterface userService
    ){
        this.userService = userService;
    }    

    @GetMapping("/me")
    @RequirePermission(action = "user:get_data")
    public ResponseEntity<?> getUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Long id;
        try {
            id = Long.parseLong(userId);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(401).body(ApiResource.message("Invalid user id in token", HttpStatus.UNAUTHORIZED));
        }
        UserDto userDto = userService.getUserById(id);
        if (userDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResource.ok(userDto, "User found successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        UserDto userDto = userService.getUserById(id);
        if (userDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResource.ok(userDto, "User found successfully"));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        UserDto userDto = userService.getUserByEmail(email);
        if (userDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResource.ok(userDto, "User found successfully"));
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateUserCredentials(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(ApiResource.message("Email and password are required", HttpStatus.BAD_REQUEST));
        }
        
        boolean isValid = userService.validateUserCredentials(email, password);
        return ResponseEntity.ok(ApiResource.ok(isValid, "Validation completed"));
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        UserResource userResource = UserResource.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .middleName(user.getMiddleName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .build();

        ApiResource<UserResource> response = ApiResource.ok(userResource, "SUCCESS");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get_all_user")
    @RequirePermission(action = "users:get_all_user")
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        Map<String, String[]> parameters = request.getParameterMap();

        Page<User> users = userService.paginate(parameters);

        Page<UserResource> userResource = users.map(user -> 
            UserResource.builder()
                .id(user.getId())
                .publish(user.getPublish())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build()
        );

        ApiResource<Page<UserResource>> response = ApiResource.ok(userResource, "User data fetched successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/batch")
    public ResponseEntity<?> getBatch(@org.springframework.web.bind.annotation.RequestParam("ids") java.util.List<Long> ids) {
        java.util.List<Long> validIds = userRepository.findAllById(ids)
            .stream().map(User::getId).toList();
        return ResponseEntity.ok(ApiResource.ok(validIds, "Fetched valid user ids successfully"));
    }

    @DeleteMapping("/delete_many")
    public ResponseEntity<?> deleteMany(@RequestBody List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(ApiResource.message("List of ids cannot be empty", HttpStatus.BAD_REQUEST));
        }

        boolean success = userService.deleteMany(ids);
        if (success) {
            return ResponseEntity.ok(ApiResource.ok(ids, "Deleted users successfully!"));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResource.message("Failed to delete users!", HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @PutMapping("/{id}/publish")
    @RequirePermission(action = "users:update_publish")
    public ResponseEntity<?> updateStatusByField(@PathVariable Long id, @Valid @RequestBody UpdateRequest request) {
        try {
            userService.updateStatusByField(id, request);
            return ResponseEntity.ok(ApiResource.ok(null, "Cập nhật trạng thái xuất bản thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResource.message(e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }

    @PutMapping("/update_field")
    @RequirePermission(action = "users:update_field")
    public ResponseEntity<?> updateFieldByParams(@RequestBody Map<String, Object> body) {
        try {
            if (!body.containsKey("ids") || !body.containsKey("publish") || !body.containsKey("column") || !body.containsKey("model")) {
                return ResponseEntity.badRequest().body(ApiResource.message("Body phải chứa ids, publish, column và model", HttpStatus.BAD_REQUEST));
            }
            @SuppressWarnings("unchecked")
            List<Long> ids = (List<Long>) body.get("ids");
            Integer publishValue = Integer.parseInt(body.get("publish").toString());
            userService.updateFieldByParams(ids, publishValue);
            return ResponseEntity.ok(ApiResource.ok(null, "Cập nhật trạng thái xuất bản hàng loạt thành công"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(ApiResource.message("Giá trị publish phải là số nguyên (1 hoặc 2)", HttpStatus.BAD_REQUEST));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResource.message(e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }
}

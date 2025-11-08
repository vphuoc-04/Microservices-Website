package com.example.user_service.controllers;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.common_lib.annotations.RequirePermission;
import com.example.common_lib.dtos.UserDto;
import com.example.common_lib.resources.ApiResource;
import com.example.common_lib.services.JwtService;
import com.example.user_service.clients.FileClient;
import com.example.user_service.entities.User;
import com.example.user_service.entities.UserCatalogueUser;
import com.example.user_service.repositories.UserRepository;
import com.example.user_service.requests.ChangePasswordRequest;
import com.example.user_service.requests.StoreRequest;
import com.example.user_service.requests.UpdatePublishRequest;
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

    @Autowired
    private JwtService jwtService;

    @Autowired
    private FileClient fileClient;

    public UserController (
        UserServiceInterface userService
    ){
        this.userService = userService;
    }    

    // @GetMapping("/me")
    // @RequirePermission(action = "user:get_data")
    // public ResponseEntity<?> getUser() {
    //     String userId = SecurityContextHolder.getContext().getAuthentication().getName();
    //     Long id;
    //     try {
    //         id = Long.parseLong(userId);
    //     } catch (NumberFormatException e) {
    //         return ResponseEntity.status(401).body(ApiResource.message("Invalid user id in token", HttpStatus.UNAUTHORIZED));
    //     }
    //     UserDto userDto = userService.getUserById(id);
    //     if (userDto == null) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     return ResponseEntity.ok(ApiResource.ok(userDto, "User found successfully"));
    // }

    // @GetMapping("/{id}")
    // public ResponseEntity<?> getUserById(@PathVariable Long id) {
    //     UserDto userDto = userService.getUserById(id);
    //     if (userDto == null) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     return ResponseEntity.ok(ApiResource.ok(userDto, "User found successfully"));
    // }

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
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserResource userResource = UserResource.builder()
            .id(user.getId())
            .imgId(user.getImgId())
            .imgUrl(fileClient.buildDownloadUrlById(user.getImgId()))
            .publish(user.getPublish())
            .firstName(user.getFirstName())
            .middleName(user.getMiddleName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .birthDate(
                user.getBirthDate() != null 
                    ? user.getBirthDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) 
                    : null
            )
            .gender(user.getGender())
            .userCatalogueId( 
                user.getUserCatalogueUsers() != null ? 
                user.getUserCatalogueUsers() .stream() .map(UserCatalogueUser::getUserCatalogueId) .collect(Collectors.toList()) : null )
            .build();
            
        return ResponseEntity.ok(ApiResource.ok(userResource, "User found successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserResource userResource = UserResource.builder()
            .id(user.getId())
            .imgId(user.getImgId())
            .imgUrl(fileClient.buildDownloadUrlById(user.getImgId()))
            .publish(user.getPublish())
            .firstName(user.getFirstName())
            .middleName(user.getMiddleName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .birthDate(
                user.getBirthDate() != null 
                    ? user.getBirthDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) 
                    : null
            )
            .gender(user.getGender())
            .userCatalogueId( 
                user.getUserCatalogueUsers() != null ? 
                user.getUserCatalogueUsers() .stream() .map(UserCatalogueUser::getUserCatalogueId) .collect(Collectors.toList()) : null )
            .build();
            
        return ResponseEntity.ok(ApiResource.ok(userResource, "User found successfully"));
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

    @GetMapping("/pagination")
    @RequirePermission(action = "users:get_all_user")
    public ResponseEntity<?> pagination(HttpServletRequest request) {
        Map<String, String[]> parameters = request.getParameterMap();

        Page<User> users = userService.paginate(parameters, request);

        Page<UserResource> userResource = users.map(user -> 
            UserResource.builder()
                .id(user.getId())
                .imgId(user.getImgId())
                .imgUrl(fileClient.buildDownloadUrlById(user.getImgId()))
                .publish(user.getPublish())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .birthDate(
                    user.getBirthDate() != null 
                        ? user.getBirthDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) 
                        : null
                )
                .gender(user.getGender())
                .userCatalogueId( 
                    user.getUserCatalogueUsers() != null ? 
                    user.getUserCatalogueUsers() .stream() .map(UserCatalogueUser::getUserCatalogueId) .collect(Collectors.toList()) : null )
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
    public ResponseEntity<?> deleteMany(@RequestBody List<Long> ids, @RequestHeader(value = "Authorization", required = false) String bearerToken) {
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(ApiResource.message("List of ids cannot be empty", HttpStatus.BAD_REQUEST));
        }
        // Fetch imgIds first
        List<User> users = userRepository.findAllById(ids);
        List<Long> imgIds = users.stream()
            .map(User::getImgId)
            .filter(java.util.Objects::nonNull)
            .toList();

        boolean success = userService.deleteMany(ids);
        if (success) {
            // cascade delete images
            if (bearerToken != null) {
                imgIds.forEach(imgId -> fileClient.deleteFilePermanently(imgId, bearerToken));
            }
            return ResponseEntity.ok(ApiResource.ok(ids, "Deleted users successfully!"));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResource.message("Failed to delete users!", HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @PutMapping("/{id}/publish")
    @RequirePermission(action = "users:update_publish")
    public ResponseEntity<?> updateStatusByField(@PathVariable Long id, @Valid @RequestBody UpdatePublishRequest request) {
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

    @PostMapping("/create")
    @RequirePermission(action = "users:create")
    public ResponseEntity<?> create(@Valid @RequestBody StoreRequest request, @RequestHeader("Authorization") String bearerToken) {
        try {
            String token = bearerToken.substring(7);
            String userId = jwtService.getUserIdFromJwt(token);
            Long addedBy = Long.valueOf(userId);

            User user = userService.create(request, addedBy);

            UserResource userResource = UserResource.builder()
                .id(user.getId())
                .imgId(user.getImgId())
                .publish(user.getPublish())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .birthDate(
                    user.getBirthDate() != null 
                        ? user.getBirthDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) 
                        : null
                )
                .gender(user.getGender())
                .userCatalogueId(
                    user.getUserCatalogueUsers() != null ?
                        user.getUserCatalogueUsers()
                            .stream()
                            .map(UserCatalogueUser::getUserCatalogueId)
                            .toList()
                        : null
                )
                .build();

            ApiResource<UserResource> response =
                    ApiResource.ok(userResource, "Thêm người dùng mới thành công");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResource.message(e.getMessage(), HttpStatus.BAD_REQUEST));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResource.message("Thêm thất bại: " + e.getMessage(),
                            HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
    
    @PutMapping("/update/{id}")
    @RequirePermission(action = "users:update")
    public ResponseEntity<?> update(@PathVariable Long id,@Valid @RequestBody UpdateRequest request, @RequestHeader("Authorization") String bearerToken) {
        try {
            String token = bearerToken.substring(7);
            String userId = jwtService.getUserIdFromJwt(token);
            Long updatedBy = Long.valueOf(userId);

            User user = userService.update(id, request, updatedBy);

            UserResource userResource = UserResource.builder()
                    .id(user.getId())
                    .imgId(user.getImgId())
                    .publish(user.getPublish())
                    .firstName(user.getFirstName())
                    .middleName(user.getMiddleName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .birthDate(
                            user.getBirthDate() != null
                                    ? user.getBirthDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                                    : null
                    )
                    .gender(user.getGender())
                    .userCatalogueId(
                            user.getUserCatalogueUsers() != null ?
                                    user.getUserCatalogueUsers().stream()
                                            .map(UserCatalogueUser::getUserCatalogueId)
                                            .toList()
                                    : null
                    )
                    .build();

            ApiResource<UserResource> response = ApiResource.ok(userResource, "Cập nhật người dùng thành công");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResource.message(e.getMessage(), HttpStatus.BAD_REQUEST));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResource.message("Cập nhật thất bại: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR)
            );
        }
    }

    @GetMapping("/view/{id}")
    @RequirePermission(action = "users:view")
    public ResponseEntity<?> view(
            @PathVariable Long id,
            @RequestHeader("Authorization") String bearerToken) {
        try {
            String token = bearerToken.substring(7);
            String userId = jwtService.getUserIdFromJwt(token);

            User user = userService.view(id);

            UserResource userResource = UserResource.builder()
                    .id(user.getId())
                    .imgId(user.getImgId())
                    .publish(user.getPublish())
                    .firstName(user.getFirstName())
                    .middleName(user.getMiddleName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .birthDate(
                            user.getBirthDate() != null
                                    ? user.getBirthDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                                    : null
                    )
                    .gender(user.getGender())
                    .userCatalogueId(
                            user.getUserCatalogueUsers() != null ?
                                    user.getUserCatalogueUsers().stream()
                                            .map(UserCatalogueUser::getUserCatalogueId)
                                            .toList()
                                    : null
                    )
                    .build();

            ApiResource<UserResource> response = ApiResource.ok(userResource, "Xem chi tiết người dùng thành công");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResource.message(e.getMessage(), HttpStatus.BAD_REQUEST));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResource.message("Xem thất bại: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @DeleteMapping("/delete/{id}")
    @RequirePermission(action = "users:delete")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String bearerToken) {
        try {
            String token = bearerToken.substring(7);
            String userId = jwtService.getUserIdFromJwt(token);
            Long deletedBy = Long.valueOf(userId);

            // Fetch user before delete to get imgId
            User user = userService.getUserById(id);
            Long imgId = user != null ? user.getImgId() : null;

            userService.delete(id, deletedBy);

            // Cascade delete image in upload-service
            if (imgId != null) {
                fileClient.deleteFilePermanently(imgId, bearerToken);
            }

            ApiResource<String> response = ApiResource.ok("Xóa người dùng thành công", "Người dùng đã được xóa");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResource.message(e.getMessage(), HttpStatus.BAD_REQUEST));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResource.message("Xóa thất bại: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable("id") Long userId,@Valid @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(userId, request);

            ApiResource<String> response = ApiResource.ok("success", "Đổi mật khẩu thành công!");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResource.message(e.getMessage(), HttpStatus.BAD_REQUEST));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResource.message(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}

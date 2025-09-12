package com.example.user_service.services.interfaces;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.common_lib.dtos.UserDto;
import com.example.user_service.entities.User;
import com.example.user_service.requests.StoreRequest;
import com.example.user_service.requests.UpdatePublishRequest;
import com.example.user_service.requests.UpdateRequest;

import jakarta.servlet.http.HttpServletRequest;

public interface UserServiceInterface {
    Page<User> paginate(Map<String, String[]> parameters, HttpServletRequest request);
    // UserDto getUserById(Long id);
    // UserDto getUserById(Long id, String accessToken);
    User getUserById(Long id);
    User getUserById(Long id, String accessToken);
    UserDto getUserByEmail(String email);
    boolean validateUserCredentials(String email, String password);
    UserDetails loadUserByUsername(String username);
    boolean deleteMany(List<Long> ids);
    void updateStatusByField(Long id, UpdatePublishRequest request);
    void updateFieldByParams(List<Long> ids, Integer publishValue);

    User create(StoreRequest request, Long addedBy);
    User update(Long id, UpdateRequest request, Long editedBy);
    User view(Long id);
    void delete(Long id, Long deletedBy);
}

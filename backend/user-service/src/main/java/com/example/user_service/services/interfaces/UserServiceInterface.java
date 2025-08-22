package com.example.user_service.services.interfaces;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.common_lib.dtos.UserDto;
import com.example.user_service.entities.User;
import com.example.user_service.requests.UpdateRequest;

public interface UserServiceInterface {
    Page<User> paginate(Map<String, String[]> parameters);
    UserDto getUserById(Long id);
    UserDto getUserById(Long id, String accessToken);
    UserDto getUserByEmail(String email);
    boolean validateUserCredentials(String email, String password);
    UserDetails loadUserByUsername(String username);
    boolean deleteMany(List<Long> ids);
    void updateStatusByField(Long id, UpdateRequest request);
    void updateFieldByParams(List<Long> ids, Integer publishValue);
}

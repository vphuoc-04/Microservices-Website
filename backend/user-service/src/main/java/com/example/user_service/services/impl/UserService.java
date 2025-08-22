package com.example.user_service.services.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.common_lib.dtos.UserDto;
import com.example.common_lib.services.BaseService;
import com.example.user_service.entities.User;
import com.example.user_service.repositories.UserRepository;
import com.example.user_service.requests.UpdateRequest;
import com.example.user_service.services.interfaces.UserServiceInterface;

import jakarta.transaction.Transactional;

@Service
public class UserService extends BaseService implements UserServiceInterface, UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Page<User> paginate(Map<String, String[]> parameters) {
        int page = parameters.containsKey("page") ? Integer.parseInt(parameters.get("page")[0]) : 1;
        int perpage = parameters.containsKey("perpage") ? Integer.parseInt(parameters.get("perpage")[0]) : 10;
        String sortParam = parameters.containsKey("sort") ? parameters.get("sort")[0] : null;
        Sort sort = createSort(sortParam);

        Pageable pageable = PageRequest.of(page - 1, perpage, sort);

        return userRepository.findAll(pageable);
    }

    @Override
    public UserDto getUserById(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setEmail(user.getEmail());
            userDto.setFirstName(user.getFirstName());
            userDto.setLastName(user.getLastName());
            userDto.setMiddleName(user.getMiddleName());
            userDto.setPhone(user.getPhone());
            return userDto;
        }
        return null;
    }

    @Override
    public UserDto getUserById(Long id, String accessToken) {
        return getUserById(id);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }
        return convertToDto(user);
    }

    @Override
    public boolean validateUserCredentials(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String userIdStr) throws org.springframework.security.core.userdetails.UsernameNotFoundException {
        Long userId;
        try {
            userId = Long.parseLong(userIdStr);
        } catch (NumberFormatException e) {
            throw new org.springframework.security.core.userdetails.UsernameNotFoundException("Invalid user id: " + userIdStr);
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found with id: " + userId);
        }
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("USER"))
        );
    }

    private UserDto convertToDto(User user) {
        com.example.common_lib.dtos.UserDto dto = new com.example.common_lib.dtos.UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setMiddleName(user.getMiddleName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setImg(user.getImg());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    @Override
    @Transactional
    public boolean deleteMany(List<Long> ids) {
        try {
            userRepository.deleteAllById(ids);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    @Transactional
    public void updateStatusByField(Long id, UpdateRequest request) {
        Optional<User> userId = userRepository.findById(id);
        if (userId.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy người dùng với ID: " + id);
        }
        User user = userId.get();
        if (request.getPublish() != 1 && request.getPublish() != 2) {
            throw new IllegalArgumentException("Trạng thái xuất bản không hợp lệ. Phải là 1 (chưa xuất bản) hoặc 2 (đã xuất bản).");
        }
        user.setPublish(request.getPublish());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateFieldByParams(List<Long> ids, Integer publishValue) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("Danh sách ID không được rỗng");
        }
        if (publishValue != 1 && publishValue != 2) {
            throw new IllegalArgumentException("Trạng thái xuất bản không hợp lệ. Phải là 1 (chưa xuất bản) hoặc 2 (đã xuất bản).");
        }
        List<User> users = userRepository.findAllById(ids);
        if (users.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy người dùng nào với danh sách ID cung cấp");
        }
        users.forEach(user -> {
            user.setPublish(publishValue);
            userRepository.save(user);
        });
    }
}

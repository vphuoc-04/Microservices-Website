package com.example.user_service.services.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.common_lib.dtos.UserDto;
import com.example.common_lib.services.BaseService;
import com.example.user_service.entities.User;
import com.example.user_service.entities.UserCatalogueUser;
import com.example.user_service.helpers.FilterParameter;
import com.example.user_service.repositories.UserCatalogueUserRepository;
import com.example.user_service.repositories.UserRepository;
import com.example.user_service.requests.ChangePasswordRequest;
import com.example.user_service.requests.StoreRequest;
import com.example.user_service.requests.UpdatePublishRequest;
import com.example.user_service.requests.UpdateRequest;
import com.example.user_service.services.interfaces.UserServiceInterface;
import com.example.user_service.specifications.BaseSpecification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class UserService extends BaseService implements UserServiceInterface, UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCatalogueUserRepository userCatalogueUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private  String[] searchFields() {
        return new String[]{"firstName", "middleName", "lastName", "email", "phone"};
    }

    protected Sort parseSort(Map<String, String[]> parameters) {
        String sortParam = parameters.containsKey("sort") ? parameters.get("sort")[0] : null;
        return createSort(sortParam);
    } 

    private Map<String, String[]> modifiedParameters(HttpServletRequest request, Map<String, String[]> parameters){

        Map<String, String[]> modifedParameters = new HashMap<>(parameters);

        Object userIdAttribute = request.getAttribute("userId");
        if(userIdAttribute != null){
            String userId = userIdAttribute.toString();
            modifedParameters.put("userId", new String[]{userId});
        }

        return modifedParameters;
    }

    @Override
    public Page<User> paginate(Map<String, String[]> parameters, HttpServletRequest request) {
        Map<String, String[]> modifiedParameters = modifiedParameters(request, parameters);
        int page = modifiedParameters.containsKey("page") ? Integer.parseInt(modifiedParameters.get("page")[0]) : 1;
        int perpage = modifiedParameters.containsKey("perpage") ? Integer.parseInt(modifiedParameters.get("perpage")[0]) : 10;
        Sort sort  = parseSort(modifiedParameters);
        Specification<User> specs = buildSpecification(modifiedParameters, searchFields());

        Pageable pageable = PageRequest.of(page - 1, perpage, sort);
        return userRepository.findAll(specs, pageable);
    }

    protected Specification<User> buildSpecification(Map<String, String[]> parameters, String[] searchFields) {
        String keyword = FilterParameter.filterKeyword(parameters);

        // Lấy filter đơn giản và clone ra để chỉnh
        Map<String, String> filterSimpleRaw = FilterParameter.filterSimple(parameters);
        Map<String, String> filterSimple = new HashMap<>(filterSimpleRaw);

        // Bắt và loại bỏ key không thuộc entity User
        String ucKey = null;
        if (filterSimple.containsKey("userCatalogueId")) {
            ucKey = "userCatalogueId";
        } else if (filterSimple.containsKey("user_catalogue_id")) {
            ucKey = "user_catalogue_id";
        }

        Long parsedCatalogueId = null;
        if (ucKey != null) {
            try {
                parsedCatalogueId = Long.valueOf(filterSimple.get(ucKey));
            } catch (NumberFormatException ignored) {}
            filterSimple.remove(ucKey); //bỏ ra để whereSpec không đụng vào
        }

        Specification<User> specs = Specification
            .where(BaseSpecification.<User>keywordSpec(keyword, searchFields))
            .or(BaseSpecification.<User>keywordSpecLoose(keyword, searchFields))
            .and(BaseSpecification.<User>whereSpec(filterSimple));

        // Nếu có catalogueId, tạo biến final và dùng trong lambda
        if (parsedCatalogueId != null) {
            final Long finalCatalogueId = parsedCatalogueId; // final để lambda capture được
            specs = specs.and((root, query, cb) -> {
                Join<User, UserCatalogueUser> join = root.join("userCatalogueUsers", JoinType.INNER);
                query.distinct(true); // tránh duplicate rows khi join
                return cb.equal(join.get("userCatalogueId"), finalCatalogueId);
            });
        }

        return specs;
    }

    // @Override
    // public UserDto getUserById(Long id) {
    //     Optional<User> userOpt = userRepository.findById(id);
    //     if (userOpt.isPresent()) {
    //         User user = userOpt.get();
    //         UserDto userDto = new UserDto();
    //         userDto.setId(user.getId());
    //         userDto.setEmail(user.getEmail());
    //         userDto.setFirstName(user.getFirstName());
    //         userDto.setLastName(user.getLastName());
    //         userDto.setMiddleName(user.getMiddleName());
    //         userDto.setPhone(user.getPhone());
    //         userDto.setBirthDate(user.getBirthDate());
    //         userDto.setGender(user.getGender());
    //         return userDto;
    //     }
    //     return null;
    // }

    // @Override
    // public UserDto getUserById(Long id, String accessToken) {
    //     return getUserById(id);
    // }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User getUserById(Long id, String accessToken) {
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
            dto.setImgId(user.getImgId());
            dto.setUserCatalogueId(
                user.getUserCatalogueUsers()
                    .stream()
                    .map(ucu -> (Long) ucu.getUserCatalogueId()) 
                    .collect(Collectors.toList())
            );
            dto.setCreatedAt(user.getCreatedAt());
            dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    @Override
    @Transactional
    public boolean deleteMany(List<Long> ids) {
        try {
            // First delete dependent rows in user_catalogue_user to satisfy FK constraints
            userCatalogueUserRepository.deleteByUserIdIn(ids);
            // Then delete users
            userRepository.deleteAllById(ids);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    @Transactional
    public void updateStatusByField(Long id, UpdatePublishRequest request) {
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

    @Override
    @Transactional
    public User create(StoreRequest request, Long addedBy) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .imgId(request.getImgId())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .publish(request.getPublish())
                .build();

        User savedUser = userRepository.save(user);

        // map catalogueIds → UserCatalogueUser
        if (request.getUserCatalogueIds() != null && !request.getUserCatalogueIds().isEmpty()) {
            List<UserCatalogueUser> relations = request.getUserCatalogueIds().stream()
                    .map(catalogueId -> UserCatalogueUser.builder()
                            .userId(savedUser.getId())
                            .userCatalogueId(catalogueId)
                            .build())
                    .toList();

            userCatalogueUserRepository.saveAll(relations);
            savedUser.setUserCatalogueUsers(relations); // để controller trả về luôn
        }

        return savedUser;
    }

    @Override
    @Transactional
    public User update(Long id, UpdateRequest request, Long updatedBy) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user với id = " + id));

        // check trùng email, phone (trừ chính nó)
        if (userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        if (userRepository.existsByPhoneAndIdNot(request.getPhone(), id)) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại");
        }

        // update field
        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setImgId(request.getImgId());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setPublish(request.getPublish());

        User savedUser = userRepository.save(user);

        userCatalogueUserRepository.deleteByUserId(savedUser.getId());
        if (request.getUserCatalogueIds() != null && !request.getUserCatalogueIds().isEmpty()) {
            List<UserCatalogueUser> relations = request.getUserCatalogueIds().stream()
                    .map(catalogueId -> UserCatalogueUser.builder()
                            .userId(savedUser.getId())
                            .userCatalogueId(catalogueId)
                            .build())
                    .toList();

            userCatalogueUserRepository.saveAll(relations);
            savedUser.setUserCatalogueUsers(relations);
        }

        return savedUser;
    }

    @Override
    public User view(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user với id = " + id));
    }

    @Override
    @Transactional
    public void delete(Long id, Long deletedBy) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user với id = " + id));

        // nếu muốn, có thể lưu thông tin deletedBy vào bảng log

        userCatalogueUserRepository.deleteByUserId(user.getId());
        userRepository.delete(user);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (request.getOldPassword() != null && !request.getOldPassword().isEmpty()) {
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new RuntimeException("Mật khẩu cũ không đúng");
            }
        }
        
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu nhập lại không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

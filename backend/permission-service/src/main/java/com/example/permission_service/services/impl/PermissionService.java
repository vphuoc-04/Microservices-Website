package com.example.permission_service.services.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.common_lib.helpers.FilterParameter;
import com.example.common_lib.services.BaseService;
import com.example.common_lib.specifications.BaseSpecification;
import com.example.permission_service.entities.Permission;
import com.example.permission_service.repositories.PermissionRepository;
import com.example.permission_service.services.interfaces.PermissionServiceInterface;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class PermissionService extends BaseService implements PermissionServiceInterface {
    @Autowired
    private PermissionRepository permissionRepository;

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
    public Page<Permission> paginate(Map<String, String[]> parameters, HttpServletRequest request) {
        Map<String, String[]> modifiedParameters = modifiedParameters(request, parameters);
        int page = modifiedParameters.containsKey("page") ? Integer.parseInt(modifiedParameters.get("page")[0]) : 1;
        int perpage = modifiedParameters.containsKey("perpage") ? Integer.parseInt(modifiedParameters.get("perpage")[0]) : 10;
        Sort sort  = parseSort(modifiedParameters);
        Specification<Permission> specs = buildSpecification(modifiedParameters, searchFields());

        Pageable pageable = PageRequest.of(page - 1, perpage, sort);

        return permissionRepository.findAll(specs, pageable);
    }

    protected Specification<Permission> buildSpecification(Map<String, String[]> parameters, String[] searchFields) {
        String keyword = FilterParameter.filterKeyword(parameters);
        Map<String, String> filterSimpleRaw = FilterParameter.filterSimple(parameters);
        Map<String, String> filterSimple = new HashMap<>(filterSimpleRaw);

        Specification<Permission> specs = Specification
            .where(BaseSpecification.<Permission>keywordSpec(keyword, searchFields))
            .or(BaseSpecification.<Permission>keywordSpecLoose(keyword, searchFields))
            .and(BaseSpecification.<Permission>whereSpec(filterSimple));

        return specs;
    }

    public Optional<Permission> findById(Long id) {
        return permissionRepository.findById(id);
    }

    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    public void deleteById(Long id) {
        permissionRepository.deleteById(id);
    }

    public boolean userHasPermission(Long userId, String permissionName) {
        List<String> permissions = permissionRepository.findPermissionNamesByUserId(userId);
        return permissions.contains(permissionName);
    }
} 
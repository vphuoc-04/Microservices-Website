package com.example.backend.modules.users.services.interfaces;

import java.util.Map;

import org.springframework.data.domain.Page;

import com.example.backend.modules.users.entities.UserCatalogue;

public interface UserCatalogueServiceInterface {
    Page<UserCatalogue> paginate(Map<String, String[]> parameters);
}

package com.example.backend.modules.users.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.modules.users.entities.UserCatalogue;

@Repository
public interface UserCatalogueRepository extends JpaRepository<UserCatalogue, Long> {
    Optional<UserCatalogue> findByName(String name);
}

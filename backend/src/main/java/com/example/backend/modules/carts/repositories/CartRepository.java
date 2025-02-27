package com.example.backend.modules.carts.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.modules.carts.entities.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Cart c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}

package com.example.backend.modules.payments.repositories;

import com.example.backend.modules.payments.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
}

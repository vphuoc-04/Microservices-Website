package com.example.backend.modules.payments.services.impl;

import com.example.backend.modules.payments.entities.Payment;
import com.example.backend.modules.payments.repositories.PaymentRepository;
import com.example.backend.modules.payments.services.interfaces.PaymentServiceInterface;
import com.example.backend.modules.users.entities.User;
import com.example.backend.services.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService extends BaseService implements PaymentServiceInterface {
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    @Transactional
    public Payment processPayment(Payment payment, User user) {
        payment.setUser(user);
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getUserPayments(User user) {
        return paymentRepository.findAll()
                .stream()
                .filter(payment -> payment.getUser().equals(user))
                .collect(Collectors.toList());
    }
}

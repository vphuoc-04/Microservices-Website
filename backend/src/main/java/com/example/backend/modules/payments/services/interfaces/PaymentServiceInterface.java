package com.example.backend.modules.payments.services.interfaces;

import com.example.backend.modules.payments.entities.Payment;
import com.example.backend.modules.users.entities.User;

import java.util.List;

public interface PaymentServiceInterface {
    Payment processPayment(Payment payment, User user);
    List<Payment> getUserPayments(User user);
}

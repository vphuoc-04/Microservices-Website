package com.example.backend.modules.payments.controllers;

import com.example.backend.modules.carts.services.impl.CartService;
import com.example.backend.modules.payments.entities.Payment;
import com.example.backend.modules.payments.resources.PaymentResource;
import com.example.backend.modules.payments.services.impl.PaymentService;
import com.example.backend.modules.users.entities.User;
import com.example.backend.modules.users.repositories.UserRepository;
import com.example.backend.modules.users.resources.UserResource;
import com.example.backend.resources.ApiResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1")
public class PaymentController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired 
    private CartService cartService;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }


    @PostMapping("/process_payment")
    public ResponseEntity<?> processPayment(@RequestBody Payment payment) {
        User user = getAuthenticatedUser();

        Payment savedPayment = paymentService.processPayment(payment, user);

        cartService.clearCartByUser(user.getId());

        UserResource userResource = UserResource.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .build();

        PaymentResource paymentResource = PaymentResource.builder()
            .id(savedPayment.getId())
            .totalAmount(savedPayment.getTotalAmount())
            .paymentDate(savedPayment.getPaymentDate())
            .user(userResource)
            .build();

        return ResponseEntity.ok(ApiResource.ok(paymentResource, "Payment processed successfully"));
    }

    @GetMapping("/get_payment_history")
    public ResponseEntity<?> getUserPayments() {
        User user = getAuthenticatedUser();
        List<PaymentResource> paymentResources = paymentService.getUserPayments(user).stream()
            .map(payment -> PaymentResource.builder()
                .id(payment.getId())
                .totalAmount(payment.getTotalAmount())
                .paymentDate(payment.getPaymentDate())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResource.ok(paymentResources, "Fetched payment history successfully"));
    }
}

package com.example.backend.modules.payments.resources;

import com.example.backend.modules.users.resources.UserResource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class PaymentResource {
    private final Long id;
    private final double totalAmount;
    private final LocalDateTime paymentDate;
    private final UserResource user;
}

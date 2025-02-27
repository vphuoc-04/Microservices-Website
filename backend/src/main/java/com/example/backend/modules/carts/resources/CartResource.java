package com.example.backend.modules.carts.resources;

import com.example.backend.modules.users.resources.UserResource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CartResource {
    private final Long id;
    private final String productName;
    private final String productPrice;
    private final String productImage;
    private final UserResource user;
}

package com.example.backend.modules.carts.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.modules.carts.entities.Cart;
import com.example.backend.modules.carts.repositories.CartRepository;
import com.example.backend.modules.carts.resources.CartResource;
import com.example.backend.modules.carts.services.impl.CartService;
import com.example.backend.modules.users.entities.User;
import com.example.backend.modules.users.repositories.UserRepository;
import com.example.backend.modules.users.resources.UserResource;
import com.example.backend.resources.ApiResource;

@RestController
@RequestMapping("api/v1")
public class CartController {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private CartService cartService;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }


    @PostMapping("/add_to_cart")
    public ResponseEntity<?> addToCart(@RequestBody Cart cart) {
        User user = getAuthenticatedUser();

        cart.setUser(user);
        Cart savedCart = cartRepository.save(cart);


        UserResource userResource = UserResource.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .build();

        CartResource cartResource = CartResource.builder()
            .id(savedCart.getId())
            .productName(savedCart.getProductName())
            .productPrice(savedCart.getProductPrice())
            .productImage(savedCart.getProductImage())
            .user(userResource)
            .build();

        ApiResource<CartResource> response = ApiResource.ok(cartResource, "Product added to cart successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get_cart_data/{userId}")
    public ResponseEntity<?> getUserCart(@PathVariable Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        List<CartResource> cartResources = cartItems.stream()
            .map(cart -> CartResource.builder()
                .id(cart.getId())
                .productName(cart.getProductName())
                .productImage(cart.getProductImage())
                .productPrice(cart.getProductPrice())
                .build()
            )
            .collect(Collectors.toList());

        ApiResource<List<CartResource>> response = ApiResource.ok(cartResources, "Fetch cart data successfully");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/remove_from_cart/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        User user = getAuthenticatedUser();

        boolean deleted = cartService.removeFromCart(id, user);

        if (deleted) {
            return ResponseEntity.ok(ApiResource.message("Product removed from cart successfully", HttpStatus.OK));
        } else {
            return ResponseEntity.status(404).body(ApiResource.error("NOT_FOUND", "Error", HttpStatus.NOT_FOUND));
        }
    }
}


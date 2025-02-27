package com.example.backend.modules.carts.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.modules.carts.entities.Cart;
import com.example.backend.modules.carts.repositories.CartRepository;
import com.example.backend.modules.carts.services.interfaces.CartServiceInterface;
import com.example.backend.modules.users.entities.User;
import com.example.backend.services.BaseService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CartService extends BaseService implements CartServiceInterface {
    @Autowired
    private CartRepository cartRepository;

    @Override
    @Transactional
    public Cart addToCart(Cart cart, User user) {
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Override
    public List<Cart> getUserCart(User user) {
        return cartRepository.findAll()
                .stream()
                .filter(cart -> cart.getUser().equals(user))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean removeFromCart(Long cartId, User user) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));

        if (!cart.getUser().equals(user)) {
            throw new IllegalStateException("You can only delete your own cart items");
        }

        cartRepository.delete(cart);
        return true;
    }

    public void clearCartByUser(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}

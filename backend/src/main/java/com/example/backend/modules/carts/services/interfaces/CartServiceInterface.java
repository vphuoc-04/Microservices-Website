package com.example.backend.modules.carts.services.interfaces;

import java.util.List;
import com.example.backend.modules.carts.entities.Cart;
import com.example.backend.modules.users.entities.User;

public interface CartServiceInterface {
    Cart addToCart(Cart cart, User user);
    List<Cart> getUserCart(User user);
    boolean removeFromCart(Long cartId, User user);
}

package com.auction.system.controller;

import com.auction.system.model.User;
import com.auction.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/add-credits")
    public ResponseEntity<User> addCredits(@RequestBody Map<String, BigDecimal> payload) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        BigDecimal amount = payload.get("amount");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid credit amount");
        }

        user.setCredits(user.getCredits().add(amount));
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}

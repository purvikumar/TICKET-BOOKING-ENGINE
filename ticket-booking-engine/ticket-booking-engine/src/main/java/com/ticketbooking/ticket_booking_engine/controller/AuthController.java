package com.ticketbooking.ticket_booking_engine.controller;

import com.ticketbooking.ticket_booking_engine.dto.AuthDtos.*;
import com.ticketbooking.ticket_booking_engine.model.User;
import com.ticketbooking.ticket_booking_engine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }

        User user = new User(request.email, request.password, request.fullName);
        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("Registration successful!", user.getEmail(), user.getFullName()));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody SignInRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(request.password)) {
                return ResponseEntity.ok(new AuthResponse("Login successful!", user.getEmail(), user.getFullName()));
            }
        }

        return ResponseEntity.status(401).body("Invalid email or password!");
    }
}

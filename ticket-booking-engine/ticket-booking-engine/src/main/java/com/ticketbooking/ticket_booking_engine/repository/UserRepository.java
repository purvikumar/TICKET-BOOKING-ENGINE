package com.ticketbooking.ticket_booking_engine.repository;

import com.ticketbooking.ticket_booking_engine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

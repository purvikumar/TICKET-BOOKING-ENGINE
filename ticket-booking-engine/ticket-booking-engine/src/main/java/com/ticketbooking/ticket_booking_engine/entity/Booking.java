package com.ticketbooking.ticket_booking_engine.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String customerEmail;

    private Long seatId;

    private LocalDateTime bookingTime;

    private String status;

    private String paymentStatus;

}

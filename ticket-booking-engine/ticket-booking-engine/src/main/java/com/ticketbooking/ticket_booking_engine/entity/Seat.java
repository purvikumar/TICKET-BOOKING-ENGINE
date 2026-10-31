package com.ticketbooking.ticket_booking_engine.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique=true)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;

    private Double price;

    @Version
    private Integer version;


}

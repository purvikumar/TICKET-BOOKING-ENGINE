package com.ticketbooking.ticket_booking_engine.repository;

import com.ticketbooking.ticket_booking_engine.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking,Long> {



}


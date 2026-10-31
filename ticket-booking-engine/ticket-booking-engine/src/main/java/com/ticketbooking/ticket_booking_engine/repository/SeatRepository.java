package com.ticketbooking.ticket_booking_engine.repository;


import com.ticketbooking.ticket_booking_engine.entity.Seat;
import com.ticketbooking.ticket_booking_engine.entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByStatus(SeatStatus status);

}

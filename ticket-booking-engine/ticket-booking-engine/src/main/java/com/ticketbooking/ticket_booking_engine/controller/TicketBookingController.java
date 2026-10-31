package com.ticketbooking.ticket_booking_engine.controller;


import com.ticketbooking.ticket_booking_engine.entity.Booking;
import com.ticketbooking.ticket_booking_engine.entity.Seat;
import com.ticketbooking.ticket_booking_engine.service.TicketBookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")

public class TicketBookingController {
    private final TicketBookingService ticketBookingService;

    public TicketBookingController(TicketBookingService ticketBookingService){
        this.ticketBookingService=ticketBookingService;
    }
    @GetMapping
    public ResponseEntity<List<Seat>> getAvailableSeats(){
        return ResponseEntity.ok(ticketBookingService.getAvailableSeats());
    }
    @PostMapping("/lock")
    public ResponseEntity<String> lockSeat(@RequestParam Long seatId){
        return ResponseEntity.ok(ticketBookingService.lockSeat(seatId));
    }

    @PostMapping("/payment")
    public ResponseEntity<String> processPayment(
            @RequestParam Long seatId,
            @RequestParam String customerEmail,
            @RequestParam String paymentStatus)
    {
       return ResponseEntity.ok(ticketBookingService.processPayment(seatId,customerEmail,paymentStatus));
    }

    /*@PostMapping("/book")
    public ResponseEntity<Booking> bookSeat(@RequestParam Long seatId , @RequestParam String customerEmail){
        Booking booking=ticketBookingService.bookSeat(seatId,customerEmail);
        return ResponseEntity.ok(booking);
    }*/
}

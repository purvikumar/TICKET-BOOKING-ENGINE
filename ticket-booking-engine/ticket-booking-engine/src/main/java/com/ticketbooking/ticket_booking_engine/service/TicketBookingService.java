package com.ticketbooking.ticket_booking_engine.service;

import com.ticketbooking.ticket_booking_engine.entity.Booking;
import com.ticketbooking.ticket_booking_engine.entity.Seat;
import com.ticketbooking.ticket_booking_engine.entity.SeatStatus;
import com.ticketbooking.ticket_booking_engine.repository.BookingRepository;
import com.ticketbooking.ticket_booking_engine.repository.SeatRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketBookingService {
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    public TicketBookingService(SeatRepository seatRepository,BookingRepository bookingRepository){
        this.seatRepository=seatRepository;
        this.bookingRepository=bookingRepository;
    }

    public List<Seat> getAvailableSeats(){
        return seatRepository.findByStatus(SeatStatus.AVAILABLE);
    }

    @Transactional
    public String lockSeat(Long seatId){
        Seat seat=seatRepository.findById(seatId)
                .orElseThrow(()->new RuntimeException("Seat Not Found! "));

        if(seat.getStatus()!=SeatStatus.AVAILABLE){
            throw new RuntimeException("Seat Is Not Available To Lock!!");
        }
        seat.setStatus(SeatStatus.LOCKED);
        seatRepository.save(seat);
        return "Seat temporarily locked! Complete Payment within 5 minutes. ";

    }

    @Transactional
    public String processPayment(Long seatId, String customerEmail, String paymentStatus){
        Seat seat=seatRepository.findById(seatId)
                .orElseThrow(()->new RuntimeException("Seat Not Found! "));
        if(seat.getStatus()!=SeatStatus.LOCKED){
            throw new RuntimeException("Seat Is Not Currently Locked For Payment!!");
        }
        if("SUCCESS".equalsIgnoreCase(paymentStatus)){
            seat.setStatus(SeatStatus.BOOKED);
            seatRepository.save(seat);

            Booking booking = new Booking();
            booking.setSeatId(seatId);
            booking.setCustomerEmail(customerEmail);
            bookingRepository.save(booking);
            return "Payment Successful! Ticket Confirmed For seat: "+ seat.getSeatNumber();
        }else{
            seat.setStatus(SeatStatus.AVAILABLE);
            seatRepository.save(seat);
            return"Payment Failed! Seat Released Back To Available.";
        }
    }

    /*@Transactional
    public Booking bookSeat(Long seatId, String customerEmail){
        Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(()->new RuntimeException("Seat Not Found with ID: "+seatId));
        if(seat.getStatus()==SeatStatus.BOOKED){
            throw new RuntimeException("Seat Is Already Booked!!");
        }
        seat.setStatus(SeatStatus.BOOKED);
        seatRepository.save(seat);

        Booking booking = new Booking();
        booking.setSeatId(seatId);
        booking.setCustomerEmail(customerEmail);
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }*/
}

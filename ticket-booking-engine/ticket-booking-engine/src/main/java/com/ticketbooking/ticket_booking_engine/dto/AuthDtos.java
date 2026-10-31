package com.ticketbooking.ticket_booking_engine.dto;

public class AuthDtos {

    public static class SignUpRequest {
        public String fullName;
        public String email;
        public String password;
    }

    public static class SignInRequest {
        public String email;
        public String password;
    }

    public static class AuthResponse {
        public String message;
        public String email;
        public String fullName;

        public AuthResponse(String message, String email, String fullName) {
            this.message = message;
            this.email = email;
            this.fullName = fullName;
        }
    }
}
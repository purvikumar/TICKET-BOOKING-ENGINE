package com.ticketbooking.ticket_booking_engine.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,String>> handleRuntimeException(RuntimeException ex){
        Map<String,String> response=new HashMap<>();
        response.put("error",ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<Map<String,String>> handleConcurrencyConflict(ObjectOptimisticLockingFailureException ex){
        Map<String,String> response=new HashMap<>();
        response.put("error","Conflict:Another user is booking this seat right now.Please try again");
        return new ResponseEntity<>(response,HttpStatus.CONFLICT);
    }
}

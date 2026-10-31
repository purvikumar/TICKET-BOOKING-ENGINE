create database if not exists ticket_booking_db;
use ticket_booking_db;
truncate table seats;
insert into seats (seat_number, status, price, version)
values ('A1', 'AVAILABLE', 500.00, 0),
       ('A2', 'AVAILABLE', 500.00, 0),
       ('A3', 'AVAILABLE', 650.00, 0);
insert into seats (seat_number,status,price,version) 
values ('B1','AVAILABLE', 500.00, 0),
       ('B2','AVAILABLE', 500.00, 0),
       ('B3','AVAILABLE', 650.00, 0),
       ('C1','AVAILABLE', 800.00, 0),
       ('C2','AVAILABLE', 800.00, 0),
       ('C3','AVAILABLE', 800.00, 0);
select * from seats;
-- Active: 1726849704461@@127.0.0.1@3306@relojeriajs
create table user(
    id int primary key AUTO_INCREMENT,
    nombre varchar(250),
    numeroContacto varchar(20),
    email varchar(80),
    contraseña varchar(250),
    status varchar(20),
    rol varchar(20),
    UNIQUE (email)
);


insert into user(nombre,numeroContacto,email,contraseña,status,rol) values('Admin','3131230000','admin@gmail.com','admin','true','admin');

create table categoria(
    id int NOT NULL AUTO_INCREMENT,
    nombre varchar(250) NOT NULL,
    primary key(id)
);
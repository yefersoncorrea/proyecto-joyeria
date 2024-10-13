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

create table producto(
    id int NOT NULL AUTO_INCREMENT,
    nombre varchar(250) NOT NULL,
    categoriaId integer NOT NULL,
    descripcion varchar(250),
    precio integer,
    status varchar(20),
    primary key(id)
);

create table factura(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(200) NOT NULL,
    nombre varchar(250) NOT NULL,
    email varchar(250) NOT NULL,
    numeroContacto varchar(20) NOT NULL,
    metodoPago varchar(50) NOT NULL,
    total int NOT NULL,
    detallesProducto JSON DEFAULT NULL,
    creadoPor varchar(250) NOT NULL,
    primary key(id)
);
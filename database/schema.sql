create database user_management;
use user_management;
create table users (
	user_id int primary key auto_increment,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    user_email varchar(255) not null,
    password_hash varchar(255) not null,
    status enum('unverified','active','blocked') not null default 'unverified',
    last_login_datetime datetime not null,
    registration_datetime datetime not null default current_timestamp
);
create unique index user_email_idx on users(user_email)
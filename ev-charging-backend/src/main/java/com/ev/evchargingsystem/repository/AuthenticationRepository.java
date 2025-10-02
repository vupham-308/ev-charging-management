package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  AuthenticationRepository extends JpaRepository<User,Long> {
    User findUserByEmail(String email);
}

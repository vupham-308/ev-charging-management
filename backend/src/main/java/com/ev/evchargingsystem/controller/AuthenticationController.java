package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.service.AuthenticationService;
import jakarta.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AuthenticationController {
    @Autowired
    AuthenticationService authenticationService;
    @PostMapping("/register")
    public ResponseEntity register(@Valid @RequestBody User user) {
        return ResponseEntity.ok(authenticationService.register(user));
    }
}

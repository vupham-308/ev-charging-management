package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.LoginRequest;
import com.ev.evchargingsystem.model.request.RegisterRequest;
import com.ev.evchargingsystem.model.request.ResetPasswordRequest;
import com.ev.evchargingsystem.model.response.UserResponse;
import com.ev.evchargingsystem.repository.UserRepository;
import com.ev.evchargingsystem.service.AuthenticationService;
import com.ev.evchargingsystem.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AuthenticationController {
    @Autowired
    AuthenticationService authenticationService;
    @Autowired
    UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity register(@Valid @RequestBody RegisterRequest registerRequest) throws MessagingException {
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity login(@Valid @RequestBody LoginRequest loginRequest) {
        UserResponse account = authenticationService.login(loginRequest);
        return ResponseEntity.ok(account);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity sendOtp(@RequestBody String email) throws MessagingException {
        User user = userRepository.findUserByEmail(email);
        if(user==null){
            return ResponseEntity.badRequest().body("Không tìm thấy tài khoản của bạn!");
        }
        if(userService.sendOtp(email)){
            return ResponseEntity.ok(email);
        }
        else{
            return ResponseEntity.badRequest().body("Lỗi gửi OTP! Vui lòng thử lại sau.");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity verify(@RequestBody String otp, @RequestBody String email) throws MessagingException {
        User user = userService.verify(otp,email);
        if(user!=null){
            return ResponseEntity.ok(user);
        }
        else{
            return ResponseEntity.badRequest().body("Sai Otp hoặc Otp đã hết hạn!");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity resetPassword(@RequestBody ResetPasswordRequest r) throws MessagingException{
        User user = userService.verify(r.getOtp(),r.getEmail());
        if(user!=null){
            userService.changePassword(user,r.getNewPassword());
            userService.sendEmailChangedPassword(user);
            return ResponseEntity.ok(user);
        }
        else{
            return ResponseEntity.badRequest().body("Sai Otp hoặc Otp đã hết hạn!");
        }
    }

}
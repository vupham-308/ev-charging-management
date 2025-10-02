package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.response.UserResponse;
import com.ev.evchargingsystem.repository.AuthenticationRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    ModelMapper modelMapper;//map dữ liệu

    public UserResponse register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if(user.getRole()==null){
            user.setRole("USER");//mặc định role USER
        }
        authenticationRepository.save(user);
        return modelMapper.map(user, UserResponse.class);
    }
}

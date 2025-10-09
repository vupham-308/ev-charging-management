package com.ev.evchargingsystem.service;


import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.response.UserInfoResponse;
import com.ev.evchargingsystem.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper; // Inject ModelMapper Bean

    public List<UserInfoResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToUserInfoResponse)
                .collect(Collectors.toList());
    }

    private UserInfoResponse convertToUserInfoResponse(User user) {
        // Sử dụng modelMapper để chuyển đổi tự động
        return modelMapper.map(user, UserInfoResponse.class);
    }
}

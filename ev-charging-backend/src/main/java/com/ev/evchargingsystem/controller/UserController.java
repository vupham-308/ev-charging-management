package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.UserUpdateRequest;
import com.ev.evchargingsystem.model.response.UserInfoResponse;
import com.ev.evchargingsystem.model.response.UserResponse;
import com.ev.evchargingsystem.repository.UserRepository;
import com.ev.evchargingsystem.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserInfoResponse>> getAllUsers() {
        List<UserInfoResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Xóa thành công");
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam("name") String name) {
        List<User> users = userService.searchUsersByName(name);
        List<UserResponse> response = users.stream()
                .map(u -> modelMapper.map(u, UserResponse.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

}
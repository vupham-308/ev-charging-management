package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.model.request.UpdatePasswordRequest;
import com.ev.evchargingsystem.model.request.UserUpdateRequest;
import com.ev.evchargingsystem.model.response.UserInfoResponse;
import com.ev.evchargingsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserInfoResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        UserInfoResponse userInfo = userService.getUserInfoByEmail(currentUserName);
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserInfoResponse> updateCurrentUser(@RequestBody UserUpdateRequest userUpdateRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = authentication.getName();
        UserInfoResponse updatedUserInfo = userService.updateUser(currentUserName, userUpdateRequest);
        return ResponseEntity.ok(updatedUserInfo);
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody UpdatePasswordRequest request) {
        try {
            userService.updatePassword(request);
            return ResponseEntity.ok("Cập nhật mật khẩu thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
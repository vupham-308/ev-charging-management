package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.service.TokenService;
import com.ev.evchargingsystem.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

    @Value("${google.client-id}")
    private String googleClientId;

    @Autowired
    private UserService userService;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/google-login")
    public ResponseEntity loginWithGoogle(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    JacksonFactory.getDefaultInstance()
            ).setAudience(Collections.singletonList(googleClientId)).build();

            GoogleIdToken idToken = verifier.verify(token);

            if (idToken == null) {
                return ResponseEntity.status(401).body("Token Google không hợp lệ!");
            }

            Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
//            String picture = (String) payload.get("picture");

            // Nếu user chưa tồn tại → tạo mới
            User user = userService.findOrCreateUser(email, name);

            // Sinh JWT nội bộ của hệ thống
            String jwt = tokenService.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("name", name);
            response.put("token", jwt);
//            response.put("picture", picture);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Đăng nhập Google thất bại: " + e.getMessage());
        }
    }
}


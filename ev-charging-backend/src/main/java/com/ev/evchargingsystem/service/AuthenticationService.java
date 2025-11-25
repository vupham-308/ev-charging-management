package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.Staff;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.LoginRequest;
import com.ev.evchargingsystem.model.request.RegisterRequest;
import com.ev.evchargingsystem.model.response.UserResponse;
import com.ev.evchargingsystem.repository.AuthenticationRepository;
import com.ev.evchargingsystem.repository.StaffRepository;
import jakarta.mail.MessagingException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationRepository authenticationRepository;

    @Autowired
    ModelMapper modelMapper;//map dữ liệu

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    TokenService tokenService;

    @Autowired
    private EmailService emailService;

    public User register(RegisterRequest registerRequest) throws MessagingException {
        // Kiểm tra email đã tồn tại chưa
        User existing = authenticationRepository.findUserByEmail(registerRequest.getEmail());

        if (existing != null) {
            if (!existing.isEnabled()) {
                throw new RuntimeException("This account has been deactivated. Please contact admin to restore access.");
            } else {
                throw new RuntimeException("Email already registered.");
            }
        }

        // Nếu chưa tồn tại => tạo mới
        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole("USER"); // mặc định USER
        user.setActive(true);

        String template = emailService.loadTemplate("mail/WelcomeUser.html");
        String html = template
                .replace("{{userName}}", user.getFullName())
                .replace("{{email}}", user.getEmail())
                .replace("{{createdAt}}", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")))
                .replace("{{passwordSection}}", "")
                .replace("{{warning}}", "");
        emailService.sendMail(user.getEmail(), "EV Charging Station: Chào mừng bạn đến với hệ thống",html);
        return authenticationRepository.save(user);
    }

    public UserResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            String token = tokenService.generateToken(user);
            userResponse.setToken(token);
            return userResponse;

        } catch (BadCredentialsException e) {
            // Ném lại để GlobalExceptionHandler bắt được
            throw e;
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return authenticationRepository.findUserByEmail(username);
    }


}

package com.ev.evchargingsystem.config;

import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDefaultAdmin(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setFullName("Administrator");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(new BCryptPasswordEncoder().encode("12345678"));
                admin.setPhone("0900000000");
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("✅ Default admin account created: admin@gmail.com / 12345678");
            }
        };
    }
}
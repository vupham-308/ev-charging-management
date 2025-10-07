package com.ev.evchargingsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="users")
@Check(constraints = "role IN ('USER', 'ADMIN', 'STAFF')")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @NotEmpty
    private String password;
    @NotEmpty(message = "Fullname not empty!")
    private String fullName;
    @Email
    @Column(unique = true)
    private String email;
    @Pattern(regexp = "^(0(3\\d|5\\d|7\\d|8\\d|9\\d)\\d{7})$")
    @Column(unique = true)
    private String phone;
    @Column(length = 10)
    private String role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public String getUsername() {
        return this.getEmail();
    }
}

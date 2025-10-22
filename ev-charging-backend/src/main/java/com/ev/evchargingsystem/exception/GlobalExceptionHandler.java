package com.ev.evchargingsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Khi sai email hoặc mật khẩu
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Email hoặc mật khẩu không đúng!");
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // Khi email đúng định dạng nhưng không tồn tại trong DB
    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<Map<String, Object>> handleInternalAuth(InternalAuthenticationServiceException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Email hoặc mật khẩu không đúng!");
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // Khi request không hợp lệ (ví dụ email sai định dạng)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> error = new HashMap<>();
        String message = "Dữ liệu không hợp lệ!";
        if (!ex.getBindingResult().getFieldErrors().isEmpty()) {
            FieldError fieldError = ex.getBindingResult().getFieldErrors().get(0);
            message = fieldError.getDefaultMessage();
        }
        error.put("error", message);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}

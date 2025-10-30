package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Lưu OTP tạm trong RAM
    private final Map<String, OtpRecord> otpCache = new ConcurrentHashMap<>();

    // thời hạn OTP = 5 phút
    private static final long OTP_EXPIRE_MILLIS = 5 * 60 * 1000;

    // Sinh OTP và gửi email
    public boolean sendOtp(String email) throws MessagingException {
        User user = userRepo.findUserByEmail(email);
        if (user == null) return false;
        if (!user.isActive()) return false;

        // Sinh mã OTP ngẫu nhiên 6 số
        String otp = String.format("%06d", new SecureRandom().nextInt(999999));
        long expireAt = System.currentTimeMillis() + OTP_EXPIRE_MILLIS;
        otpCache.put(email, new OtpRecord(otp, expireAt));

        String subject = "EV Charging Station: Mã OTP để xác minh tài khoản của bạn";
        String html = emailService.loadTemplate("/mail/SendOtp.html")
                .replace("{{userName}}", user.getFullName())
                .replace("{{otp}}", otp);
        ;
        emailService.sendMail(email, subject, html);
        return true;
    }


    public boolean verifyOtp(String email, String otp) {
        OtpRecord record = otpCache.get(email);
        if (record == null) return false;

        boolean valid = record.otp.equals(otp)
                && System.currentTimeMillis() < record.expiryTime;

        if (valid) {
            otpCache.remove(email); // xoá OTP sau khi dùng
            return true;
        }
        return false;
    }

    // Class nội bộ lưu OTP
    private static class OtpRecord {
        String otp;
        long expiryTime;

        OtpRecord(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}

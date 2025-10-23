package com.ev.evchargingsystem.service;


import com.ev.evchargingsystem.entity.Car;
import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.model.request.UpdatePasswordRequest;
import com.ev.evchargingsystem.model.request.UserUpdateRequest;
import com.ev.evchargingsystem.model.response.UserInfoResponse;
import com.ev.evchargingsystem.model.response.UserStatsResponseForAdmin;
import com.ev.evchargingsystem.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper; // Inject ModelMapper Bean

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private TransactionRepository transactionRepository;


    public List<UserInfoResponse> getAllUsers() {
        List<User> users = userRepository.findByActiveTrue();
        return users.stream()
                .map(this::convertToUserInfoResponse)
                .collect(Collectors.toList());
    }


    private UserInfoResponse convertToUserInfoResponse(User user) {
        // Sử dụng modelMapper để chuyển đổi tự động
        return modelMapper.map(user, UserInfoResponse.class);
    }

//    public void deleteUser(Integer id) {
//        userRepository.deleteById(id);
//    }

    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User với id: " + id));

        if (!user.isActive()) {
            throw new RuntimeException("User này đã xóa");
        }

        user.setActive(false);
        userRepository.save(user);
    }

    public UserInfoResponse getUserInfoByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với email: " + email));
        return convertToUserInfoResponse(user);
    }

    public UserInfoResponse updateUser(String email, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với email: " + email));

        user.setFullName(userUpdateRequest.getFullName());
        user.setPhone(userUpdateRequest.getPhone());
        user.setEmail(userUpdateRequest.getEmail());


        User updatedUser = userRepository.save(user);
        return convertToUserInfoResponse(updatedUser);
    }

    public void updatePassword(UpdatePasswordRequest request) {
        // Lấy thông tin user đang đăng nhập
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Không thấy user"));

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu mới và xác nhận mật khẩu không khớp");
        }

        // Cập nhật mật khẩu mới đã được mã hóa
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public List<User> searchUsersByName(String name) {
        return userRepository.findByFullNameContainingIgnoreCase(name);
    }

    public UserStatsResponseForAdmin getUserStats() {
        long total = userRepository.countTotalUsers();
        long drivers = userRepository.countNormalUsers();
        long staffs = userRepository.countStaffs();
        long admins = userRepository.countAdmins();

        return new UserStatsResponseForAdmin(total, drivers, staffs, admins);
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void restoreUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User với id: " + id));

        if (user.isActive()) {
            throw new RuntimeException("User này đã kích hoạt");
        }

        user.setActive(true);
        userRepository.save(user);
    }
}

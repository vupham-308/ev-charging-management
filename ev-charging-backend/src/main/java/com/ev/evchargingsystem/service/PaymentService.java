package com.ev.evchargingsystem.service;

import com.ev.evchargingsystem.entity.ChargingSession;
import com.ev.evchargingsystem.entity.Transaction;
import com.ev.evchargingsystem.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;

@Service
public class PaymentService {

    @Autowired
    TransactionRepository transactionRepository;

    private final String hashSecret ="EQQ0CKF96IV09MF9G1YLL0SR49KYOQD9";

    public String createPayment(int transactionId){
        Transaction transaction = transactionRepository.findTransactionById(transactionId);

        String tmnCode = "1RN3MS23";
        String vnpayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        String returnUrl = "http://localhost:8080/api/payment/success/" + transaction.getId();
        Map<String, String> vnpParams = new TreeMap<>();

        //format date
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String formattedCreateDate = formatter.format(new Date(System.currentTimeMillis()));

        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", tmnCode);
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", transaction.getId()+"");
        vnpParams.put("vnp_OrderInfo", "Thanh toan cho ma GD: " + transaction.getId());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Amount", String.valueOf((int) transaction.getTotalAmount() * 100));
        vnpParams.put("vnp_ReturnUrl", returnUrl);
        vnpParams.put("vnp_CreateDate", formattedCreateDate);
        vnpParams.put("vnp_IpAddr", "127.0.0.1");

        //tạo chuỗi cung cấp theo yêu cầu của vnpay
        StringBuilder signDataBuilder = new StringBuilder();

        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            signDataBuilder.append(entry.getKey())
                    .append('=')
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                    .append('&');
        }

        // Xóa ký tự '&' cuối cùng
        if (signDataBuilder.length() > 0) {
            signDataBuilder.deleteCharAt(signDataBuilder.length() - 1);
        }
        String signData = signDataBuilder.toString();

        //sign vô chuỗi vừa rồi để đảm báo chuỗi không bị chỉnh sửa
        String vnp_SecureHash = "";
        try {
            vnp_SecureHash = generateMAC(signData, hashSecret);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // ====== Ghép URL hoàn chỉnh ======
        StringBuilder queryUrl = new StringBuilder(vnpayUrl + "?");
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            queryUrl.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII));
            queryUrl.append('=');
            queryUrl.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
            queryUrl.append('&');
        }
        queryUrl.append("vnp_SecureHash=").append(vnp_SecureHash);


        return queryUrl.toString();

    }

    public String generateMAC(String signData, String secretKey) throws NoSuchAlgorithmException, InvalidKeyException {

        Mac hasher = Mac.getInstance("HmacSHA512");
        hasher.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));

// Băm (hash) dữ liệu signData bằng secretKey
        byte[] hash = hasher.doFinal(signData.getBytes(StandardCharsets.UTF_8));

// Chuyển kết quả hash sang dạng chuỗi HEX hoặc Base64
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }

    public void paymentCallback(int id,Map<String,String> params) throws NoSuchAlgorithmException, InvalidKeyException {
        // Lấy giá trị vnp_SecureHash từ params
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        // Tạo chuỗi dữ liệu cần verify (theo thứ tự alphabet)
        Map<String, String> sortedParams = new TreeMap<>(params);
        StringBuilder signDataBuilder = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            signDataBuilder.append(entry.getKey())
                    .append('=')
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII))
                    .append('&');
        }
        if (signDataBuilder.length() > 0) {
            signDataBuilder.deleteCharAt(signDataBuilder.length() - 1);
        }
        String signData = signDataBuilder.toString();

        // Tính lại hash bằng secret key
        String computedHash = generateMAC(signData, hashSecret);

        // So sánh chữ ký
        if (computedHash.equalsIgnoreCase(vnp_SecureHash)) {
            String responseCode = params.get("vnp_ResponseCode");

            if ("00".equals(responseCode)) {
                // Giao dịch thành công
                Transaction t = transactionRepository.findTransactionById(id);
                t.setStatus("COMPLETED");
                transactionRepository.save(t);
            } else {
                // Giao dịch thất bại
                Transaction t = transactionRepository.findTransactionById(id);
                t.setStatus("FAILED");
                transactionRepository.save(t);
                throw new RuntimeException("Thanh toán thất bại! Mã lỗi: "+ responseCode);
            }
        } else {
            // Chữ ký không hợp lệ
            throw new RuntimeException("Chữ kí không hợp lệ!");
        }
    }
}

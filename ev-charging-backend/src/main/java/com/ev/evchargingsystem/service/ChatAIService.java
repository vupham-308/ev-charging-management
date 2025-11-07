package com.ev.evchargingsystem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
public class ChatAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private static final String DATA_FILE_PATH = "data/database-export.json";

    public String ask(String question) {
        RestTemplate restTemplate = new RestTemplate();

        // 📖 Đọc nội dung dữ liệu thật từ file export
        String databaseContext = readDatabaseFile();

        // Body request
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("messages", List.of(
                Map.of("role", "system", "content",
                        "Bạn là một trợ lý ảo chuyên về hệ thống trạm sạc xe điện (EV Charging). " +
                                "Dưới đây là dữ liệu thực tế của hệ thống (database snapshot):\n\n" + databaseContext +
                                "\n\nDựa trên dữ liệu trên, hãy trả lời câu hỏi bằng tiếng Việt, tự nhiên và chính xác." +
                                "Đối với các câu hỏi về dữ liệu nhạy cảm của người dùng khác, hãy thông báo lại với họ." +
                                "Phân biệt trạm sạc với trụ sạc nhé!"),
                Map.of("role", "user", "content", question)
        ));
        body.put("max_tokens", 500);
        body.put("temperature", 0.7);

        // Header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    OPENAI_URL, HttpMethod.POST, request, Map.class);

            // Trích nội dung phản hồi
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");

        } catch (Exception e) {
            return "❌ Lỗi khi gọi OpenAI API: " + e.getMessage();
        }
    }

    // 📂 Hàm đọc dữ liệu từ file export
    private String readDatabaseFile() {
        try {
            Path path = Path.of(DATA_FILE_PATH);
            if (Files.exists(path)) {
                // Giới hạn độ dài để tránh vượt token limit
                String content = Files.readString(path);
                if (content.length() > 10000) {
                    return content.substring(0, 10000) + "\n...(đã rút gọn)";
                }
                return content;
            } else {
                return "(Không tìm thấy file dữ liệu tại " + DATA_FILE_PATH + ")";
            }
        } catch (IOException e) {
            return "(Lỗi đọc file dữ liệu: " + e.getMessage() + ")";
        }
    }
}

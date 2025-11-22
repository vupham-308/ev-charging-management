package com.ev.evchargingsystem.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
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

    @Value("AIzaSyC5S20Eoy0dDxNGh7L_Qb-zFr8yaaVNzW8")
    private String apiKey;

    private static final String DATA_FILE_PATH = "data/database-export.json";

    public String ask(String question) {
        RestTemplate restTemplate = new RestTemplate();

        // Đọc dữ liệu thật
        String databaseContext = readDatabaseFile();

        String prompt = "Bạn là một trợ lý ảo chuyên về hệ thống trạm sạc xe điện (EV Charging). "
                + "Dưới đây là dữ liệu thực tế của hệ thống (database snapshot):\n\n"
                + databaseContext
                + "\n\nDựa trên dữ liệu trên, hãy trả lời câu hỏi bằng tiếng Việt, tự nhiên và chính xác. " +
                "Bạn là chatbot của hệ thống, hãy trả lời như việc bạn đang trả lời với khách hàng, dữ liệu tôi đưa bạn để bạn hỗ trợ bạn trả lời, vui lòng không nhắc đến nhé." +
                "Hãy trả về văn bản thuần có xuống dòng bằng \\n, không dùng markdown, không dùng ký hiệu *, không dùng tiêu đề.\n\n"
                + "Câu hỏi: " + question;


        Client client = new Client.Builder().apiKey(apiKey).build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null);

        return response.text();
    }

    private String readDatabaseFile() {
        try {
            Path path = Path.of(DATA_FILE_PATH);
            if (Files.exists(path)) {
                String content = Files.readString(path);
//                if (content.length() > 10000) {
//                    return content.substring(0, 10000) + "\n...(đã rút gọn)";
//                }
                return content;
            } else {
                return "(Không tìm thấy file dữ liệu tại " + DATA_FILE_PATH + ")";
            }
        } catch (IOException e) {
            return "(Lỗi đọc file dữ liệu: " + e.getMessage() + ")";
        }
    }
}
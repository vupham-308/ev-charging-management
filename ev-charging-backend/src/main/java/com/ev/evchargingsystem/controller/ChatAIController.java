package com.ev.evchargingsystem.controller;

import com.ev.evchargingsystem.entity.User;
import com.ev.evchargingsystem.service.ChatAIService;
import com.ev.evchargingsystem.service.DataExportScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class ChatAIController {

    @Autowired
    private ChatAIService chatAIService;
    @Autowired
    private DataExportScheduler dataExportScheduler;

    @PostMapping("/ask")
    public String ask(@RequestBody QuestionRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object principal = auth.getPrincipal();
        if (principal instanceof User) {
            User user = (User) principal;
            dataExportScheduler.exportDatabaseSnapshot(user);
        } else {
            dataExportScheduler.exportPublicData();
        }
        return chatAIService.ask(req.getQuestion());
    }
}

class QuestionRequest {
    private String question;
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}

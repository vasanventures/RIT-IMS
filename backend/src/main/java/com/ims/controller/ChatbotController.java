package com.ims.controller;

import com.ims.entity.ChatbotLog;
import com.ims.entity.User;
import com.ims.repository.ChatbotLogRepository;
import com.ims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotLogRepository chatbotLogRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/query")
    public ResponseEntity<?> getChatbotResponse(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String email = request.get("email"); // Ideally extract from JWT context

        String responseText = generateMockAIResponse(query);

        // Store log
        if (email != null) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                ChatbotLog log = ChatbotLog.builder()
                        .user(userOpt.get())
                        .query(query)
                        .response(responseText)
                        .timestamp(LocalDateTime.now())
                        .build();
                chatbotLogRepository.save(log);
            }
        }

        return ResponseEntity.ok(Map.of("response", responseText));
    }

    @Cacheable(value = "chatbotResponses", key = "#query")
    public String generateMockAIResponse(String query) {
        String lowerQuery = query.toLowerCase();
        
        // Mock Predefined FAQ Data
        if (lowerQuery.contains("attendance")) {
            return "You can check your attendance under the 'Attendance' tab on the sidebar. A minimum of 75% is required.";
        } else if (lowerQuery.contains("timetable") || lowerQuery.contains("schedule")) {
            return "The timetable is updated every semester by the department admin. You can find it in the 'Timetable' section.";
        } else if (lowerQuery.contains("marks") || lowerQuery.contains("result")) {
            return "Exam marks are uploaded by your respective faculty. Check the 'Marks' tab for details.";
        } else if (lowerQuery.contains("fee") || lowerQuery.contains("payment")) {
            return "Please contact the accounts department for fee related queries at accounts@ritchennai.edu.in";
        }
        
        // Fallback Mock AI Response
        return "I am unable to understand your specifically at this moment. This is a mock AI fallback. Please contact the administrator for further assistance.";
    }
}

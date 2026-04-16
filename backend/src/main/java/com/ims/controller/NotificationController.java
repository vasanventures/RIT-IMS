package com.ims.controller;

import com.ims.entity.Notification;
import com.ims.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam(required = false) String role) {
        if (role == null || role.isEmpty()) {
            return ResponseEntity.ok(notificationRepository.findAll());
        }
        return ResponseEntity.ok(notificationRepository.findByTargetRoleOrderByCreatedDateDesc(role));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<?> sendNotification(@RequestBody Notification notification) {
        notification.setCreatedDate(LocalDateTime.now());
        notificationRepository.save(notification);
        return ResponseEntity.ok("Notification sent successfully");
    }
}

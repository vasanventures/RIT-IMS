package com.ims.controller;

import com.ims.entity.Request;
import com.ims.repository.RequestRepository;
import com.ims.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<Request>> getStudentRequests(@PathVariable Long studentId) {
        return ResponseEntity.ok(requestRepository.findByStudentId(studentId));
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitRequest(@RequestBody Request request) {
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        requestRepository.save(request);
        return ResponseEntity.ok("Request submitted successfully (Pending Approval)");
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<List<Request>> getPendingRequests() {
        return ResponseEntity.ok(requestRepository.findByStatus("PENDING"));
    }

    @PatchMapping("/{requestId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<?> updateStatus(@PathVariable Long requestId, @RequestParam String status) {
        return requestRepository.findById(requestId).map(request -> {
            request.setStatus(status.toUpperCase());
            requestRepository.save(request);
            return ResponseEntity.ok("Request status updated to " + status);
        }).orElse(ResponseEntity.notFound().build());
    }
}

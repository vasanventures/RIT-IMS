package com.ims.controller;

import com.ims.entity.Fee;
import com.ims.repository.FeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/fees")
public class FeeController {

    @Autowired
    private FeeRepository feeRepository;

    @GetMapping("/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<Fee>> getStudentFees(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeRepository.findByStudentId(studentId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addFeeRecord(@RequestBody Fee fee) {
        feeRepository.save(fee);
        return ResponseEntity.ok("Fee record added successfully");
    }

    @PatchMapping("/{feeId}/pay")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> payFee(@PathVariable Long feeId) {
        return feeRepository.findById(feeId).map(fee -> {
            fee.setStatus("PAID");
            feeRepository.save(fee);
            return ResponseEntity.ok("Payment successful (Mock)");
        }).orElse(ResponseEntity.notFound().build());
    }
}

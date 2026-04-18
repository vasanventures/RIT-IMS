package com.ims.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String type; // "ACADEMIC", "EXAM"

    @Column(nullable = false)
    private Double amount;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(nullable = false)
    private String status; // "PAID", "PENDING", "OVERDUE"
}

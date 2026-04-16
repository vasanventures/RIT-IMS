package com.ims.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "target_role")
    private String targetRole; // e.g. "ALL", "STUDENT", "FACULTY"

    private String department; // if null, applies to all departments

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;
}

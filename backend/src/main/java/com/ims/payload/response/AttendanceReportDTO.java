package com.ims.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendanceReportDTO {
    private Long studentId;
    private String studentName;
    private String rollNo;
    private String subjectName;
    private Long totalClasses;
    private Long presentCount;
    private Double attendancePercentage;
}

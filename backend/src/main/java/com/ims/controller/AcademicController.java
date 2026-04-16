package com.ims.controller;

import com.ims.entity.Attendance;
import com.ims.entity.Marks;
import com.ims.entity.Timetable;
import com.ims.payload.response.AttendanceReportDTO;
import com.ims.repository.AttendanceRepository;
import com.ims.repository.MarksRepository;
import com.ims.repository.TimetableRepository;
import com.ims.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/academic")
public class AcademicController {

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    // --- TIMETABLE ---
    @GetMapping("/timetable")
    @Cacheable(value = "timetableCache", key = "#department + '-' + #semester")
    public ResponseEntity<List<Timetable>> getTimetable(@RequestParam String department, @RequestParam Integer semester) {
        return ResponseEntity.ok(timetableRepository.findByDepartmentAndSemester(department, semester));
    }

    @PostMapping("/timetable")
    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(value = "timetableCache", allEntries = true)
    public ResponseEntity<?> createTimetable(@RequestBody Timetable timetable) {
        // Conflict Check 1: Faculty already booked?
        if (timetableRepository.existsByDayOfWeekAndPeriodAndFacultyId(
                timetable.getDayOfWeek(), timetable.getPeriod(), timetable.getFaculty().getId())) {
            return ResponseEntity.badRequest().body("Conflict: Faculty member is already assigned to another class during this period.");
        }

        // Conflict Check 2: Classroom/Section already booked?
        if (timetableRepository.existsByDayOfWeekAndPeriodAndDepartmentAndSemester(
                timetable.getDayOfWeek(), timetable.getPeriod(), timetable.getDepartment(), timetable.getSemester())) {
            return ResponseEntity.badRequest().body("Conflict: This department/semester already has a subject scheduled for this period.");
        }

        timetableRepository.save(timetable);
        return ResponseEntity.ok("Timetable slot added successfully");
    }

    // --- ATTENDANCE ---
    @GetMapping("/attendance/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('FACULTY') or hasRole('ADMIN')")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceRepository.findByStudentId(studentId));
    }

    @PostMapping("/attendance")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<?> markAttendance(@RequestBody List<Attendance> attendanceList) {
        attendanceRepository.saveAll(attendanceList);
        return ResponseEntity.ok("Attendance marked successfully");
    }

    // --- MARKS ---
    @GetMapping("/marks/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('FACULTY') or hasRole('ADMIN')")
    public ResponseEntity<List<Marks>> getStudentMarks(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksRepository.findByStudentId(studentId));
    }

    @PostMapping("/marks")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<?> uploadMarks(@RequestBody List<Marks> marksList) {
        marksRepository.saveAll(marksList);
        return ResponseEntity.ok("Marks uploaded successfully");
    }

    // --- REPORTS & ALERTS ---
    @GetMapping("/attendance/low")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<List<AttendanceReportDTO>> getLowAttendanceStudents(@RequestParam(defaultValue = "75.0") Double threshold) {
        List<AttendanceReportDTO> report = studentRepository.findAll().stream().map(student -> {
            List<Attendance> attendances = attendanceRepository.findByStudentId(student.getId());
            long total = attendances.size();
            long present = attendances.stream().filter(a -> a.getStatus().equals("PRESENT")).count();
            double percentage = total == 0 ? 0.0 : (double) present / total * 100;

            return AttendanceReportDTO.builder()
                    .studentId(student.getId())
                    .studentName(student.getUser().getName())
                    .rollNo(student.getRollNo())
                    .attendancePercentage(percentage)
                    .totalClasses(total)
                    .presentCount(present)
                    .build();
        }).filter(r -> r.getAttendancePercentage() < threshold)
        .collect(Collectors.toList());

        return ResponseEntity.ok(report);
    }
}

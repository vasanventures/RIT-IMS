package com.ims.component;

import com.ims.entity.*;
import com.ims.entity.enums.Role;
import com.ims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 1) return; // Only seed if empty (except for the user I just created)

        // 1. Create Subjects
        Subject ds = Subject.builder().name("Data Structures").code("CS101").department("CS").build();
        Subject dbms = Subject.builder().name("Database Systems").code("CS102").department("CS").build();
        Subject se = Subject.builder().name("Software Engineering").code("CS103").department("CS").build();
        subjectRepository.saveAll(List.of(ds, dbms, se));

        // 2. Create Faculty
        User fUser = User.builder()
                .name("Dr. Rajesh")
                .email("faculty@ritchennai.edu.in")
                .password(passwordEncoder.encode("password123"))
                .role(Role.FACULTY)
                .build();
        userRepository.save(fUser);
        
        Faculty faculty = Faculty.builder()
                .user(fUser)
                .department("CS")
                .employeeId("FAC001")
                .build();
        facultyRepository.save(faculty);

        // 3. Create Student (testuser)
        User sUser = userRepository.findByEmail("testuser@ritchennai.edu.in").orElseGet(() -> {
            User u = User.builder()
                    .name("Test Student")
                    .email("testuser@ritchennai.edu.in")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.STUDENT)
                    .build();
            return userRepository.save(u);
        });

        Student student = studentRepository.findByUserEmail("testuser@ritchennai.edu.in").orElseGet(() -> {
            Student s = Student.builder()
                    .user(sUser)
                    .department("CS")
                    .rollNo("T001")
                    .currentSemester(6)
                    .build();
            return studentRepository.save(s);
        });

        // 4. Seed Timetable
        Timetable t1 = Timetable.builder()
                .dayOfWeek("MONDAY")
                .period(1)
                .department("CS")
                .semester(6)
                .subject(se)
                .faculty(faculty)
                .build();
        timetableRepository.save(t1);

        // 5. Seed Attendance
        Attendance a1 = Attendance.builder().student(student).faculty(faculty).subject(se).date(LocalDate.now().minusDays(1)).status("PRESENT").build();
        Attendance a2 = Attendance.builder().student(student).faculty(faculty).subject(dbms).date(LocalDate.now().minusDays(1)).status("PRESENT").build();
        Attendance a3 = Attendance.builder().student(student).faculty(faculty).subject(ds).date(LocalDate.now().minusDays(2)).status("ABSENT").build();
        attendanceRepository.saveAll(List.of(a1, a2, a3));

        // 6. Seed Marks
        Marks m1 = Marks.builder().student(student).subject(se).examType("CAT").score(85.0).build();
        Marks m2 = Marks.builder().student(student).subject(dbms).examType("CAT").score(92.0).build();
        Marks m3 = Marks.builder().student(student).subject(ds).examType("LAB").score(45.0).build(); // Out of 50
        Marks m4 = Marks.builder().student(student).subject(se).examType("ASSIGNMENT").score(18.0).build(); // Out of 20
        marksRepository.saveAll(List.of(m1, m2, m3, m4));

        // 7. Seed Fees
        Fee f1 = Fee.builder().student(student).type("ACADEMIC").amount(75000.0).status("PENDING").dueDate(LocalDateTime.now().plusMonths(1)).build();
        Fee f2 = Fee.builder().student(student).type("EXAM").amount(2500.0).status("PAID").dueDate(LocalDateTime.now().minusDays(10)).build();
        feeRepository.saveAll(List.of(f1, f2));

        System.out.println(">>> Database Seeded Successfully with Test Data <<<");
    }
}

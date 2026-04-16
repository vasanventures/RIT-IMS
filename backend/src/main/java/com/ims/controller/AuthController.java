package com.ims.controller;

import com.ims.entity.Faculty;
import com.ims.entity.Student;
import com.ims.entity.User;
import com.ims.entity.enums.Role;
import com.ims.payload.request.LoginRequest;
import com.ims.payload.request.SignupRequest;
import com.ims.payload.response.JwtResponse;
import com.ims.payload.response.MessageResponse;
import com.ims.repository.FacultyRepository;
import com.ims.repository.StudentRepository;
import com.ims.repository.UserRepository;
import com.ims.security.JwtUtils;
import com.ims.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    FacultyRepository facultyRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getName(),
                userDetails.getRole().name()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        String strRole = signUpRequest.getRole();
        Role role;

        if (strRole == null) {
            role = Role.STUDENT; // Default role
        } else {
            switch (strRole.toLowerCase()) {
                case "admin":
                    role = Role.ADMIN;
                    break;
                case "faculty":
                    role = Role.FACULTY;
                    break;
                default:
                    role = Role.STUDENT;
            }
        }
        user.setRole(role);
        userRepository.save(user);

        // Save related entities based on role
        if (role == Role.STUDENT) {
            Student student = new Student();
            student.setUser(user);
            student.setDepartment(signUpRequest.getDepartment());
            student.setRollNo(signUpRequest.getRollNo());
            student.setCurrentSemester(signUpRequest.getCurrentSemester());
            studentRepository.save(student);
        } else if (role == Role.FACULTY && signUpRequest.getEmployeeId() != null) {
            Faculty faculty = new Faculty();
            faculty.setUser(user);
            faculty.setDepartment(signUpRequest.getDepartment());
            faculty.setEmployeeId(signUpRequest.getEmployeeId());
            facultyRepository.save(faculty);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}

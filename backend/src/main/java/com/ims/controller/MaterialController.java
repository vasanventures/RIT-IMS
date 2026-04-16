package com.ims.controller;

import com.ims.entity.Faculty;
import com.ims.entity.Material;
import com.ims.entity.Subject;
import com.ims.repository.FacultyRepository;
import com.ims.repository.MaterialRepository;
import com.ims.repository.SubjectRepository;
import com.ims.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("subjectId") Long subjectId,
            @RequestParam("facultyId") Long facultyId) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        String fileName = fileStorageService.storeFile(file);

        Material material = Material.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .filePath(fileName)
                .subject(subject)
                .uploadedBy(faculty)
                .uploadDate(LocalDateTime.now())
                .build();

        materialRepository.save(material);

        return ResponseEntity.ok("Material uploaded successfully: " + fileName);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Material>> getMaterialsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(materialRepository.findBySubjectId(subjectId));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long id) throws MalformedURLException {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        Path filePath = fileStorageService.getFile(material.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(material.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + material.getFileName() + "\"")
                .body(resource);
    }
}

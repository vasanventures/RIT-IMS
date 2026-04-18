package com.ims.repository;

import com.ims.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByStudentId(Long studentId);
    List<Request> findByStatus(String status);
}

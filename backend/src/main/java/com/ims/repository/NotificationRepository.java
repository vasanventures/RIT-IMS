package com.ims.repository;

import com.ims.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTargetRoleOrderByCreatedDateDesc(String targetRole);
    List<Notification> findByDepartmentOrderByCreatedDateDesc(String department);
}

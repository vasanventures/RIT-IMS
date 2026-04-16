package com.ims.repository;

import com.ims.entity.ChatbotLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatbotLogRepository extends JpaRepository<ChatbotLog, Long> {
    List<ChatbotLog> findByUserIdOrderByTimestampDesc(Long userId);
}

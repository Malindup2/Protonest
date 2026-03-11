package com.protonest.taskmanager.dto;

import com.protonest.taskmanager.entity.Priority;
import com.protonest.taskmanager.entity.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskRes {
    private Long id;
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
}

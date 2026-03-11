package com.protonest.taskmanager.dto;

import com.protonest.taskmanager.entity.Priority;
import com.protonest.taskmanager.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskReq {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private Status status;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private LocalDate dueDate;
}

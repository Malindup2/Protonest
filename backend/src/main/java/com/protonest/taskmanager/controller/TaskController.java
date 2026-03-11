package com.protonest.taskmanager.controller;

import com.protonest.taskmanager.dto.TaskReq;
import com.protonest.taskmanager.dto.TaskRes;
import com.protonest.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskRes> createTask(@Valid @RequestBody TaskReq request, Authentication authentication) {
        return new ResponseEntity<>(taskService.createTask(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<TaskRes>> getTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.getTasks(page, size, sort, status, priority, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskRes> getTaskById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(taskService.getTaskById(id, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskRes> updateTask(@PathVariable Long id, @Valid @RequestBody TaskReq request, Authentication authentication) {
        return ResponseEntity.ok(taskService.updateTask(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        taskService.deleteTask(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}

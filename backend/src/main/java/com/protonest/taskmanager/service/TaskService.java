package com.protonest.taskmanager.service;

import com.protonest.taskmanager.dto.TaskReq;
import com.protonest.taskmanager.dto.TaskRes;
import com.protonest.taskmanager.entity.Priority;
import com.protonest.taskmanager.entity.Role;
import com.protonest.taskmanager.entity.Status;
import com.protonest.taskmanager.entity.Task;
import com.protonest.taskmanager.entity.User;
import com.protonest.taskmanager.repository.TaskRepository;
import com.protonest.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskRes createTask(TaskReq request, String username) {
        User user = getUser(username);
        
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .user(user)
                .build();
                
        return mapToRes(taskRepository.save(task));
    }

    public Page<TaskRes> getTasks(int page, int size, String[] sort, String statusStr, String priorityStr, String username) {
        User user = getUser(username);
        
        Sort.Direction direction = sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sort[0]);
        Pageable pageable = PageRequest.of(page, size, Sort.by(order));
        
        Status status = statusStr != null ? Status.valueOf(statusStr.toUpperCase()) : null;
        Priority priority = priorityStr != null ? Priority.valueOf(priorityStr.toUpperCase()) : null;

        Page<Task> tasksPage;
        if (user.getRole() == Role.ADMIN) {
            tasksPage = taskRepository.findAllByFilters(status, priority, pageable);
        } else {
            tasksPage = taskRepository.findByUserAndFilters(user, status, priority, pageable);
        }

        return tasksPage.map(this::mapToRes);
    }

    public TaskRes getTaskById(Long id, String username) {
        Task task = getTaskAndVerifyAccess(id, username);
        return mapToRes(task);
    }

    public TaskRes updateTask(Long id, TaskReq request, String username) {
        Task task = getTaskAndVerifyAccess(id, username);
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        
        return mapToRes(taskRepository.save(task));
    }

    public void deleteTask(Long id, String username) {
        Task task = getTaskAndVerifyAccess(id, username);
        taskRepository.delete(task);
    }

    private Task getTaskAndVerifyAccess(Long id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User user = getUser(username);
        
        if (user.getRole() != Role.ADMIN && !task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this task");
        }
        return task;
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TaskRes mapToRes(Task task) {
        return TaskRes.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .userId(task.getUser().getId())
                .build();
    }
}

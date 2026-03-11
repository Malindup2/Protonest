package com.protonest.taskmanager.repository;

import com.protonest.taskmanager.entity.Priority;
import com.protonest.taskmanager.entity.Status;
import com.protonest.taskmanager.entity.Task;
import com.protonest.taskmanager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE " +
           "(t.user = :user) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Task> findByUserAndFilters(@Param("user") User user, 
                                    @Param("status") Status status, 
                                    @Param("priority") Priority priority, 
                                    Pageable pageable);

    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Task> findAllByFilters(@Param("status") Status status, 
                                @Param("priority") Priority priority, 
                                Pageable pageable);
}

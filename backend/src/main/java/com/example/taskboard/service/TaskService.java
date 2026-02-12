package com.example.taskboard.service;

import com.example.taskboard.entity.Task;
import com.example.taskboard.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public Task addTask(String title) {
        Task task = new Task();
        task.setTitle(title);
        task.setStatus("PENDING");
        return repo.save(task);
    }

    public Task markDone(Long id) {
        Task task = repo.findById(id).orElseThrow();
        task.setStatus("DONE");
        return repo.save(task);
    }

    public List<Task> getAll() {
        return repo.findAll();
    }
}

package com.example.taskboard.controller;

import com.example.taskboard.entity.Task;
import com.example.taskboard.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping
    public Task addTask(@RequestParam String title) {
        return service.addTask(title);
    }

    @PutMapping("/{id}/done")
    public Task markDone(@PathVariable Long id) {
        return service.markDone(id);
    }

    @GetMapping
    public List<Task> getAll() {
        return service.getAll();
    }
}

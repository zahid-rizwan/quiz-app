package com.adaptive.quiz.controller;

import com.adaptive.quiz.dto.ApiResponse;
import com.adaptive.quiz.dto.TeacherDTO;
import com.adaptive.quiz.dto.TeacherRegistrationDTO;
import com.adaptive.quiz.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<TeacherDTO>> registerTeacher(@RequestBody TeacherRegistrationDTO registrationDTO) {
        TeacherDTO teacherDTO = teacherService.registerTeacher(registrationDTO);
        ApiResponse<TeacherDTO> response = new ApiResponse<>(true, "Teacher registered successfully", teacherDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{teacherId}")
    public ResponseEntity<ApiResponse<TeacherDTO>> getTeacherById(@PathVariable Long teacherId) {
        TeacherDTO teacherDTO = teacherService.getTeacherById(teacherId);
        ApiResponse<TeacherDTO> response = new ApiResponse<>(true, "Teacher retrieved successfully", teacherDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherDTO>>> getAllTeachers() {
        List<TeacherDTO> teachers = teacherService.getAllTeachers();
        ApiResponse<List<TeacherDTO>> response = new ApiResponse<>(true, "Teachers retrieved successfully", teachers);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{teacherId}")
    public ResponseEntity<ApiResponse<TeacherDTO>> updateTeacher(
            @PathVariable Long teacherId, @RequestBody TeacherDTO teacherDTO) {
        TeacherDTO updatedTeacher = teacherService.updateTeacher(teacherId, teacherDTO);
        ApiResponse<TeacherDTO> response = new ApiResponse<>(true, "Teacher updated successfully", updatedTeacher);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{teacherId}")
    public ResponseEntity<ApiResponse<Void>> deleteTeacher(@PathVariable Long teacherId) {
        teacherService.deleteTeacher(teacherId);
        ApiResponse<Void> response = new ApiResponse<>(true, "Teacher deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}

package com.adaptive.quiz.controller;

import com.adaptive.quiz.dto.ApiResponse;
import com.adaptive.quiz.dto.SubjectDTO;
import com.adaptive.quiz.dto.SubjectResponseDTO;
import com.adaptive.quiz.dto.SubjectWithTopicsRequest;
import com.adaptive.quiz.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectDTO>> createSubject(@RequestBody SubjectDTO subjectDTO) {
        SubjectDTO createdSubject = subjectService.createSubject(subjectDTO);
        ApiResponse<SubjectDTO> response = new ApiResponse<>(true, "Subject created successfully", createdSubject);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectResponseDTO>> getSubjectById(@PathVariable Long subjectId) {
        SubjectResponseDTO subjectDTO = subjectService.getSubjectById(subjectId);
        ApiResponse<SubjectResponseDTO> response = new ApiResponse<>(true, "Subject retrieved successfully", subjectDTO);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/with-topics")
    public ResponseEntity<ApiResponse<List<SubjectResponseDTO>>> getAllSubjectsWithTopics() {
        List<SubjectResponseDTO> subjects = subjectService.getAllSubjectsWithTopics();
        ApiResponse<List<SubjectResponseDTO>> response = new ApiResponse<>(
                true,
                "Subjects with topics retrieved successfully",
                subjects
        );
        return ResponseEntity.ok(response);
    }
    @PostMapping("/with-topics")
    public ResponseEntity<ApiResponse<SubjectResponseDTO>> createSubjectWithTopics(
            @RequestBody SubjectWithTopicsRequest request) {
        SubjectResponseDTO createdSubject = subjectService.createSubjectWithTopics(
                request.getSubject(),
                request.getTopics()
        );
        ApiResponse<SubjectResponseDTO> response = new ApiResponse<>(
                true,
                "Subject with topics created successfully",
                createdSubject
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // DTO to receive the request


    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectDTO>>> getAllSubjects() {
        List<SubjectDTO> subjects = subjectService.getAllSubjects();
        ApiResponse<List<SubjectDTO>> response = new ApiResponse<>(true, "Subjects retrieved successfully", subjects);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectDTO>> updateSubject(
            @PathVariable Long subjectId, @RequestBody SubjectDTO subjectDTO) {
        SubjectDTO updatedSubject = subjectService.updateSubject(subjectId, subjectDTO);
        ApiResponse<SubjectDTO> response = new ApiResponse<>(true, "Subject updated successfully", updatedSubject);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(@PathVariable Long subjectId) {
        subjectService.deleteSubject(subjectId);
        ApiResponse<Void> response = new ApiResponse<>(true, "Subject deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}

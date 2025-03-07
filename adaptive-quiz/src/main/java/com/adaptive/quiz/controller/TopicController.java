package com.adaptive.quiz.controller;

import com.adaptive.quiz.dto.ApiResponse;
import com.adaptive.quiz.dto.TopicDTO;
import com.adaptive.quiz.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @PostMapping
    public ResponseEntity<ApiResponse<TopicDTO>> createTopic(@RequestBody TopicDTO topicDTO) {
        TopicDTO createdTopic = topicService.createTopic(topicDTO);
        ApiResponse<TopicDTO> response = new ApiResponse<>(true, "Topic created successfully", createdTopic);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{topicId}")
    public ResponseEntity<ApiResponse<TopicDTO>> getTopicById(@PathVariable Long topicId) {
        TopicDTO topicDTO = topicService.getTopicById(topicId);
        ApiResponse<TopicDTO> response = new ApiResponse<>(true, "Topic retrieved successfully", topicDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TopicDTO>>> getAllTopics() {
        List<TopicDTO> topics = topicService.getAllTopics();
        ApiResponse<List<TopicDTO>> response = new ApiResponse<>(true, "Topics retrieved successfully", topics);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<TopicDTO>>> getTopicsBySubjectId(@PathVariable Long subjectId) {
        List<TopicDTO> topics = topicService.getTopicsBySubjectId(subjectId);
        ApiResponse<List<TopicDTO>> response = new ApiResponse<>(true, "Topics retrieved successfully", topics);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{topicId}")
    public ResponseEntity<ApiResponse<TopicDTO>> updateTopic(
            @PathVariable Long topicId, @RequestBody TopicDTO topicDTO) {
        TopicDTO updatedTopic = topicService.updateTopic(topicId, topicDTO);
        ApiResponse<TopicDTO> response = new ApiResponse<>(true, "Topic updated successfully", updatedTopic);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{topicId}")
    public ResponseEntity<ApiResponse<Void>> deleteTopic(@PathVariable Long topicId) {
        topicService.deleteTopic(topicId);
        ApiResponse<Void> response = new ApiResponse<>(true, "Topic deleted successfully", null);
        return ResponseEntity.ok(response);
    }
}


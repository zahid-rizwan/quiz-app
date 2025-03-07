package com.adaptive.quiz.service;

import com.adaptive.quiz.dto.SubjectDTO;
import com.adaptive.quiz.dto.SubjectResponseDTO;
import com.adaptive.quiz.dto.TopicDTO;

import java.util.List;

public interface SubjectService {
    SubjectDTO createSubject(SubjectDTO subjectDTO);
    SubjectResponseDTO getSubjectById(Long subjectId);
    List<SubjectDTO> getAllSubjects();
    SubjectDTO updateSubject(Long subjectId, SubjectDTO subjectDTO);
    void deleteSubject(Long subjectId);
    SubjectResponseDTO createSubjectWithTopics(SubjectDTO subjectDTO, List<TopicDTO> topicsDTO);
    List<SubjectResponseDTO> getAllSubjectsWithTopics();
}

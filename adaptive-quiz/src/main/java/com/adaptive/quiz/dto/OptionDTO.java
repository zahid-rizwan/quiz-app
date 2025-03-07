package com.adaptive.quiz.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionDTO {
    private Long optionId;
    private String optionText;
    private boolean isCorrect;
//     OR add explicit getter/setter to control the naming

     @JsonProperty("isCorrect")
     public boolean isCorrect() {
         return isCorrect;
     }

     @JsonProperty("isCorrect")
     public void setCorrect(boolean correct) {
         this.isCorrect = correct;
     }
}

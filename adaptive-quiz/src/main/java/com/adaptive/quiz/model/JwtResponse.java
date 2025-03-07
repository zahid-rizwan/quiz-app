//package com.adaptive.quiz.model;
//
//import com.adaptive.quiz.entity.User;
//import lombok.*;
//import org.springframework.stereotype.Component;
//
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//@ToString
//@Component
//public class JwtResponse {
//    private String jwtToken;
//    private User user;
//}
package com.adaptive.quiz.model;

import com.adaptive.quiz.entity.Role;
import com.adaptive.quiz.entity.Student;
import com.adaptive.quiz.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String jwtToken;
    private User user;


}
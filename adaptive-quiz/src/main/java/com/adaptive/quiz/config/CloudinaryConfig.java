package com.adaptive.quiz.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dz7sfupkn");
        config.put("api_key", "392868869783317");
        config.put("api_secret", "q5iYDC6mlHAeFThsq721E1kqIb4");
        return new Cloudinary(config);
    }
}
//package com.adaptive.quiz.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
//import org.springframework.web.filter.CorsFilter;
//
//@Configuration
//@EnableWebSecurity
//@EnableWebMvc
//public class SecurityConfig {
//    @Autowired
//    private UserDetailsService userDetailsService;
//    @Autowired
//    private JwtFilter jwtFilter;
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        return http.csrf(customizer->customizer.disable())
//        .authorizeHttpRequests(request-> request
//                .requestMatchers("/register","/login")
//                .permitAll()
//                .anyRequest().authenticated())
//                .httpBasic(Customizer.withDefaults())
//                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
//
//    }
//
//    @Bean
//    public AuthenticationProvider authenticationProvider(){
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
//        provider.setUserDetailsService(userDetailsService);
//        return provider;
//    }
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//
//    }
//    @Bean
//    public FilterRegistrationBean coresFilter(){
//        CorsConfiguration corsConfiguration = new CorsConfiguration();
//        corsConfiguration.setAllowCredentials(true);
//
//        corsConfiguration.addAllowedOriginPattern("*");
//
//        corsConfiguration.addAllowedHeader("Authorization");
//        corsConfiguration.addAllowedHeader("Content-type");
//        corsConfiguration.addAllowedHeader("Accept");
//        corsConfiguration.addAllowedMethod("POST");
//        corsConfiguration.addAllowedMethod("GET");
//        corsConfiguration.addAllowedMethod("DELETE");
//        corsConfiguration.addAllowedMethod("PUT");
//        corsConfiguration.addAllowedMethod("OPTIONS");
//        corsConfiguration.setMaxAge(3600L);
//        UrlBasedCorsConfigurationSource source =new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", corsConfiguration);
//        FilterRegistrationBean bean=new FilterRegistrationBean<>(new CorsFilter(source));
//        bean.setOrder(-110);
//        return bean;
//    }
//
//}
package com.adaptive.quiz.config;

import com.adaptive.quiz.security.CustomAccessDeniedHandler;
import com.adaptive.quiz.security.JwtAuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebSecurity
@EnableWebMvc
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtFilter jwtFilter;
    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(customizer->customizer.disable())
                .authorizeHttpRequests(request-> request
                        .requestMatchers("/register", "/login", "/public/**","/oauth2/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/teacher/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers("/student/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                        .anyRequest().authenticated())
                .exceptionHandling(e ->
                        e.authenticationEntryPoint(jwtAuthenticationEntryPoint)
                                .accessDeniedHandler(accessDeniedHandler)
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(oidcUserService())
                                .userService(oauth2UserService())
                        )
                        .defaultSuccessUrl("/oauth2/login-success", true)
                )
                .httpBasic(Customizer.withDefaults())
                // Change this to ALWAYS or IF_REQUIRED for OAuth2
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
    }
    @Bean
    public OidcUserService oidcUserService() {
        return new OidcUserService();
    }

    @Bean
    public DefaultOAuth2UserService oauth2UserService() {
        return new DefaultOAuth2UserService();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public FilterRegistrationBean coresFilter(){
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.addAllowedOriginPattern("*");
        corsConfiguration.addAllowedHeader("Authorization");
        corsConfiguration.addAllowedHeader("Content-type");
        corsConfiguration.addAllowedHeader("Accept");
        corsConfiguration.addAllowedMethod("POST");
        corsConfiguration.addAllowedMethod("GET");
        corsConfiguration.addAllowedMethod("DELETE");
        corsConfiguration.addAllowedMethod("PUT");
        corsConfiguration.addAllowedMethod("OPTIONS");
        corsConfiguration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source =new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        FilterRegistrationBean bean=new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(-110);
        return bean;
    }
}
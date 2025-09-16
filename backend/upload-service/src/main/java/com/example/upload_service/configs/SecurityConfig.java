package com.example.upload_service.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.common_lib.helpers.JwtAuthFilter;
import com.example.common_lib.helpers.TokenValidator;
import com.example.common_lib.services.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;
    private final TokenValidator tokenValidator;

    public SecurityConfig(JwtService jwtService, ObjectMapper objectMapper, TokenValidator tokenValidator) {
        this.jwtService = jwtService;
        this.objectMapper = objectMapper;
        this.tokenValidator = tokenValidator;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> org.springframework.security.core.userdetails.User
            .withUsername(username)
            .password("")
            .roles("USER")
            .build();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService, ObjectMapper objectMapper, TokenValidator tokenValidator) {
        return new JwtAuthFilter(jwtService, userDetailsService, objectMapper, tokenValidator);
    }

    // @Bean
    // public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
    //     http
    //         .cors(Customizer.withDefaults())  
    //         .csrf(csrf -> csrf.disable())
    //         .authorizeHttpRequests(auth -> auth
    //             .requestMatchers(
    //                 "/api/v1/upload/files/{id}/download",
    //                 "/api/v1/upload/files/filename/{filename}/download",
    //                 "/api/v1/upload/files/*/thumbnail",
    //                 "/api/v1/upload/files/filename/*/thumbnail",
    //                 "/api/v1/upload/files/public"
    //             ).permitAll()
    //             .anyRequest().authenticated()
    //         )
    //         .sessionManagement(session -> session
    //             .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
    //         )
    //         .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    //     return http.build();
    // }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .cors(Customizer.withDefaults())  
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/upload/files/{id}/download",
                    "/api/v1/upload/files/filename/{filename}/download",
                    "/api/v1/upload/files/*/thumbnail",
                    "/api/v1/upload/files/filename/*/thumbnail",
                    "/api/v1/upload/files/public"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        // Chỉ thêm JwtAuthFilter cho các endpoint không public
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
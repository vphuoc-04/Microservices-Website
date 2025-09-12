package com.example.common_lib.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) 
public class UserDto {
    private Long id;
    private Integer publish;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String phone;
    private String img;
    private LocalDateTime birthDate;
    private Integer gender;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Long> userCatalogueId;
} 
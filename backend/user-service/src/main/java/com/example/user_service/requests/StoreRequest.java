package com.example.user_service.requests;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StoreRequest {
    @Min(value = 0, message = "Status value must be greater than or equal to 0")
    @Max(value = 2, message = "Status value must be less than or equal to 2")
    private Integer publish;

    @NotBlank(message = "First name cannot be empty")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Last name cannot be empty")
    private String lastName;

    @NotBlank(message = "Email cannot be empty")
    private String email;

    @NotBlank(message = "Phone cannot be empty")
    private String phone;

    @NotBlank(message = "Password cannot be empty")
    private String password;

    private Long imgId;

    @NotNull(message = "Birth date cannot be empty")
    private LocalDateTime birthDate;

    @NotNull(message = "Gender cannot be empty")
    private Integer gender;

    @NotEmpty(message = "Catalogue id list cannot be empty")
    private List<Long> userCatalogueIds;
}

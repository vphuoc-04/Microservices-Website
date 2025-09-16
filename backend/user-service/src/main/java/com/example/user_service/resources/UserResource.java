package com.example.user_service.resources;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResource {
    private final Long id;
    private final Long imgId;
    private final String imgUrl;
    private final Integer publish;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String middleName;
    private final String phone;
    private final String password;
    private final String birthDate;
    private final Integer gender;

    private final List<Long> userCatalogueId;
}


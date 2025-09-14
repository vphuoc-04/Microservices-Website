package com.example.user_service.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class ChangePasswordRequest {
    private String oldPassword;

    @NotBlank(message = "Bạn cần nhập mật khẩu mới")
    private String newPassword;

    @NotBlank(message = "Bạn cần nhập lại mật khẩu mới")
    private String confirmPassword;
}

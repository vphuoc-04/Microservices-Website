package com.example.upload_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
    scanBasePackages = {
        "com.example.upload_service",
        "com.example.common_lib.configs",
        "com.example.common_lib.services",
        "com.example.common_lib.dtos",
        "com.example.common_lib.exceptions",
        "com.example.common_lib.resources",
        "com.example.common_lib.helpers",
        "com.example.common_lib.aspects"
    }
)
@EnableDiscoveryClient
@EnableScheduling
public class UploadServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UploadServiceApplication.class, args);
    }
}

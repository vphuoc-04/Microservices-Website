package com.example.user_catalogue_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class UserCatalogueServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserCatalogueServiceApplication.class, args);
	}

}

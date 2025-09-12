package com.example.auth_service.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.auth_service.services.interfaces.UserServiceInterface;
import com.example.common_lib.dtos.UserDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserService implements UserServiceInterface, org.springframework.security.core.userdetails.UserDetailsService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Value("${user.service.url:http://localhost:8082}")
    private String userServiceUrl;

    @Override
    public UserDto getUserById(Long id) {
        try {
            String url = userServiceUrl + "/api/v1/users/" + id;
            ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode data = response.getBody().get("data");
                if (data != null) {
                    return objectMapper.treeToValue(data, UserDto.class);
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching user by ID: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    // public UserDto getUserById(Long id, String accessToken) {
    //     try {
    //         String url = userServiceUrl + "/api/v1/users/" + id;
    //         HttpHeaders headers = new HttpHeaders();
    //         headers.set("Authorization", accessToken);
    //         HttpEntity<?> entity = new HttpEntity<>(headers);
    //         ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);
    //         System.out.println("DEBUG: Response từ user-service: " + response.getBody());
    //         // Parse JSON trả về
    //         JsonNode dataNode = response.getBody().get("data");
    //         if (dataNode != null && !dataNode.isNull()) {
    //             ObjectMapper mapper = new ObjectMapper();
    //             return mapper.treeToValue(dataNode, UserDto.class);
    //         }
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //     }
    //     return null;
    // }

    public UserDto getUserById(Long id, String accessToken) {
        try {
            String url = userServiceUrl + "/api/v1/users/" + id;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", accessToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);

            ResponseEntity<JsonNode> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, JsonNode.class);

            System.out.println("DEBUG: Response từ user-service: " + response.getBody());

            JsonNode dataNode = response.getBody().get("data");
            if (dataNode != null && !dataNode.isNull()) {
                ObjectMapper mapper = new ObjectMapper();
                mapper.findAndRegisterModules(); // hỗ trợ JavaTimeModule cho LocalDateTime

                UserDto user = mapper.convertValue(dataNode, UserDto.class);
                System.out.println("DEBUG: UserDto sau khi map: " + user);
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    

    @Override
    public UserDto getUserByEmail(String email) {
        try {
            String url = userServiceUrl + "/api/v1/users/email/" + email;
            ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode data = response.getBody().get("data");
                if (data != null) {
                    return objectMapper.treeToValue(data, UserDto.class);
                }
            }
        } catch (Exception e) {
            // Log error
        }
        return null;
    }

    @Override
    public boolean validateUserCredentials(String email, String password) {
        try {
            String url = userServiceUrl + "/api/v1/users/validate";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Create request body
            String requestBody = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.POST, entity, JsonNode.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode data = response.getBody().get("data");
                return data != null && data.asBoolean();
            }
        } catch (Exception e) {
            // Log error
        }
        return false;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("DEBUG: loadUserByUsername nhận vào: " + username);

        UserDto user = null;
        if (username.matches("\\d+")) {
            System.out.println("DEBUG: username là ID -> gọi getUserById");
            user = getUserById(Long.parseLong(username));
        } else {
            System.out.println("DEBUG: username là email -> gọi getUserByEmail");
            user = getUserByEmail(username);
        }

        System.out.println("DEBUG: UserDto trả về: " + user);

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password("")
                .roles("USER")
                .build();
    }
} 
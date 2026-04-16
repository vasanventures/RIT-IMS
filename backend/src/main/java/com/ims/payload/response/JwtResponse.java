package com.ims.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type; // usually "Bearer"
    private Long id;
    private String email;
    private String name;
    private String role;

    public JwtResponse(String token, Long id, String email, String name, String role) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}

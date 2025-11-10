package com.investorsdeaal.controller;

import com.investorsdeaal.dto.ChangePasswordRequest;
import com.investorsdeaal.dto.UpdateProfileRequest;
import com.investorsdeaal.dto.UserDTO;
import com.investorsdeaal.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }
    
    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
    
    @PutMapping("/settings")
    public ResponseEntity<UserDTO> updateSettings(@RequestBody Map<String, Object> settings) {
        Boolean emailNotifications = (Boolean) settings.get("emailNotifications");
        Boolean smsNotifications = (Boolean) settings.get("smsNotifications");
        Boolean leadAlerts = (Boolean) settings.get("leadAlerts");
        Boolean commissionUpdates = (Boolean) settings.get("commissionUpdates");
        
        return ResponseEntity.ok(userService.updateSettings(null, emailNotifications, 
                smsNotifications, leadAlerts, commissionUpdates));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
}

package com.investorsdeaal.controller;

import com.investorsdeaal.dto.CommissionDTO;
import com.investorsdeaal.dto.PropertyDTO;
import com.investorsdeaal.dto.UserDTO;
import com.investorsdeaal.exception.ResourceNotFoundException;
import com.investorsdeaal.model.CommissionConfig;
import com.investorsdeaal.model.Property;
import com.investorsdeaal.model.User;
import com.investorsdeaal.repository.CommissionConfigRepository;
import com.investorsdeaal.repository.CommissionRepository;
import com.investorsdeaal.repository.LeadRepository;
import com.investorsdeaal.repository.PropertyRepository;
import com.investorsdeaal.repository.UserRepository;
import com.investorsdeaal.service.CommissionService;
import com.investorsdeaal.service.PropertyService;
import com.investorsdeaal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final CommissionRepository commissionRepository;
    private final CommissionConfigRepository commissionConfigRepository;
    private final UserService userService;
    private final PropertyService propertyService;
    private final CommissionService commissionService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProperties", propertyRepository.count());
        stats.put("totalLeads", leadRepository.count());
        stats.put("totalCommissions", commissionRepository.count());
        
        stats.put("pendingAssociates", userRepository.findByStatus(User.UserStatus.PENDING).size());
        stats.put("activeAssociates", userRepository.findByRole(User.UserRole.ASSOCIATE).size());
        stats.put("pendingProperties", propertyRepository.findByStatus(Property.PropertyStatus.PENDING).size());
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestParam(required = false) String role) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @GetMapping("/users/pending")
    public ResponseEntity<List<UserDTO>> getPendingUsers() {
        List<UserDTO> users = userRepository.findByStatus(User.UserStatus.PENDING).stream()
                .map(this::mapUserToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserDTO> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String status = request.get("status");
        user.setStatus(User.UserStatus.valueOf(status.toUpperCase()));
        user = userRepository.save(user);
        
        return ResponseEntity.ok(mapUserToDTO(user));
    }
    
    @GetMapping("/properties/pending")
    public ResponseEntity<List<PropertyDTO>> getPendingProperties() {
        return ResponseEntity.ok(propertyRepository.findByStatus(Property.PropertyStatus.PENDING)
                .stream()
                .map(this::mapPropertyToDTO)
                .collect(Collectors.toList()));
    }
    
    @PutMapping("/properties/{id}/approve")
    public ResponseEntity<PropertyDTO> approveProperty(@PathVariable Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        property.setStatus(Property.PropertyStatus.APPROVED);
        property = propertyRepository.save(property);
        
        return ResponseEntity.ok(mapPropertyToDTO(property));
    }
    
    @PutMapping("/properties/{id}/reject")
    public ResponseEntity<PropertyDTO> rejectProperty(@PathVariable Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        property.setStatus(Property.PropertyStatus.REJECTED);
        property = propertyRepository.save(property);
        
        return ResponseEntity.ok(mapPropertyToDTO(property));
    }
    
    @PutMapping("/properties/{id}/featured")
    public ResponseEntity<PropertyDTO> toggleFeatured(@PathVariable Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        property.setIsFeatured(!property.getIsFeatured());
        property = propertyRepository.save(property);
        
        return ResponseEntity.ok(mapPropertyToDTO(property));
    }
    
    @PutMapping("/properties/{id}/hot-deal")
    public ResponseEntity<PropertyDTO> toggleHotDeal(@PathVariable Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        property.setIsHotDeal(!property.getIsHotDeal());
        property = propertyRepository.save(property);
        
        return ResponseEntity.ok(mapPropertyToDTO(property));
    }
    
    @PutMapping("/commissions/{id}/approve")
    public ResponseEntity<CommissionDTO> approveCommission(@PathVariable Long id) {
        return ResponseEntity.ok(commissionService.approveCommission(id));
    }
    
    @PutMapping("/commissions/{id}/pay")
    public ResponseEntity<CommissionDTO> markCommissionAsPaid(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String transactionId = request.get("transactionId");
        return ResponseEntity.ok(commissionService.markAsPaid(id, transactionId));
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/commission-config")
    public ResponseEntity<CommissionConfig> getCommissionConfig() {
        List<CommissionConfig> configs = commissionConfigRepository.findAll();
        if (configs.isEmpty()) {
            // Create default config if none exists
            CommissionConfig defaultConfig = new CommissionConfig();
            defaultConfig = commissionConfigRepository.save(defaultConfig);
            return ResponseEntity.ok(defaultConfig);
        }
        return ResponseEntity.ok(configs.get(0));
    }
    
    @PutMapping("/commission-config")
    public ResponseEntity<CommissionConfig> updateCommissionConfig(@RequestBody CommissionConfig config) {
        List<CommissionConfig> configs = commissionConfigRepository.findAll();
        if (configs.isEmpty()) {
            config.setId(null);
            return ResponseEntity.ok(commissionConfigRepository.save(config));
        }
        config.setId(configs.get(0).getId());
        return ResponseEntity.ok(commissionConfigRepository.save(config));
    }
    
    private UserDTO mapUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().name().toLowerCase());
        dto.setStatus(user.getStatus().name().toLowerCase());
        dto.setReferralCode(user.getReferralCode());
        return dto;
    }
    
    private PropertyDTO mapPropertyToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setPrice(property.getPrice());
        dto.setCity(property.getCity());
        dto.setStatus(property.getStatus().name().toLowerCase());
        if (property.getListedBy() != null) {
            dto.setListedByUserName(property.getListedBy().getName());
        }
        return dto;
    }
}

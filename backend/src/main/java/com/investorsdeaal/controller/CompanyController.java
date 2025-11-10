package com.investorsdeaal.controller;

import com.investorsdeaal.dto.UserDTO;
import com.investorsdeaal.model.Lead;
import com.investorsdeaal.model.User;
import com.investorsdeaal.repository.LeadRepository;
import com.investorsdeaal.repository.PropertyRepository;
import com.investorsdeaal.repository.UserRepository;
import com.investorsdeaal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('COMPANY')")
public class CompanyController {
    
    private final UserService userService;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get company team members (users referred by company)
        List<User> teamMembers = userRepository.findByRole(User.UserRole.ASSOCIATE);
        
        // Count active leads (OPEN and IN_PROGRESS)
        long activeLeads = leadRepository.findAll().stream()
                .filter(lead -> lead.getStatus() == Lead.LeadStatus.OPEN || 
                               lead.getStatus() == Lead.LeadStatus.IN_PROGRESS)
                .count();
        
        // Count conversions (CLOSED_WON)
        long conversions = leadRepository.findAll().stream()
                .filter(lead -> lead.getStatus() == Lead.LeadStatus.CLOSED_WON)
                .count();
        
        // Calculate revenue (sum of sold property prices)
        BigDecimal revenue = propertyRepository.findAll().stream()
                .filter(p -> p.getStatus() == com.investorsdeaal.model.Property.PropertyStatus.SOLD)
                .map(p -> p.getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("teamMembers", teamMembers.size());
        stats.put("activeLeads", activeLeads);
        stats.put("conversions", conversions);
        stats.put("revenue", revenue.doubleValue());
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/team")
    public ResponseEntity<List<Map<String, Object>>> getTeamMembers() {
        List<User> associates = userRepository.findByRole(User.UserRole.ASSOCIATE);
        
        List<Map<String, Object>> teamData = associates.stream().map(user -> {
            Map<String, Object> memberData = new HashMap<>();
            memberData.put("id", user.getId());
            memberData.put("name", user.getName());
            memberData.put("email", user.getEmail());
            memberData.put("phone", user.getPhone());
            memberData.put("role", user.getRole().name());
            memberData.put("status", user.getStatus().name());
            
            // Count leads for this user
            long leads = leadRepository.findAll().stream()
                    .filter(lead -> lead.getAssignedTo() != null && 
                                   lead.getAssignedTo().getId().equals(user.getId()))
                    .count();
            
            // Count conversions for this user (CLOSED_WON)
            long conversions = leadRepository.findAll().stream()
                    .filter(lead -> lead.getAssignedTo() != null && 
                                   lead.getAssignedTo().getId().equals(user.getId()) &&
                                   lead.getStatus() == Lead.LeadStatus.CLOSED_WON)
                    .count();
            
            memberData.put("leads", leads);
            memberData.put("conversions", conversions);
            
            return memberData;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(teamData);
    }
}

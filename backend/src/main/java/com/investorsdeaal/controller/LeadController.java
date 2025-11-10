package com.investorsdeaal.controller;

import com.investorsdeaal.dto.LeadDTO;
import com.investorsdeaal.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeadController {
    
    private final LeadService leadService;
    
    @GetMapping
    public ResponseEntity<List<LeadDTO>> getAllLeads(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(leadService.getLeadsByStatus(status));
        }
        return ResponseEntity.ok(leadService.getAllLeads());
    }
    
    @GetMapping("/my-leads")
    public ResponseEntity<List<LeadDTO>> getMyLeads() {
        return ResponseEntity.ok(leadService.getMyLeads());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LeadDTO> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }
    
    @GetMapping("/upcoming-followups")
    public ResponseEntity<List<LeadDTO>> getUpcomingFollowups() {
        return ResponseEntity.ok(leadService.getUpcomingFollowups());
    }
    
    @PostMapping
    public ResponseEntity<LeadDTO> createLead(@RequestBody LeadDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(leadService.createLead(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<LeadDTO> updateLead(@PathVariable Long id, @RequestBody LeadDTO dto) {
        return ResponseEntity.ok(leadService.updateLead(id, dto));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<LeadDTO> updateLeadStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        return ResponseEntity.ok(leadService.updateLeadStatus(id, status));
    }
    
    @PostMapping("/{id}/followup")
    public ResponseEntity<LeadDTO> scheduleFollowup(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        LocalDateTime followupDate = LocalDateTime.parse(request.get("followupDate"));
        return ResponseEntity.ok(leadService.scheduleFollowup(id, followupDate));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}

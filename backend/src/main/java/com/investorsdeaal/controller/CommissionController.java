package com.investorsdeaal.controller;

import com.investorsdeaal.dto.CommissionDTO;
import com.investorsdeaal.service.CommissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommissionController {
    
    private final CommissionService commissionService;
    
    @GetMapping
    public ResponseEntity<List<CommissionDTO>> getMyCommissions() {
        return ResponseEntity.ok(commissionService.getMyCommissions());
    }
    
    @GetMapping("/earnings")
    public ResponseEntity<Map<String, Object>> getEarningsSummary() {
        return ResponseEntity.ok(commissionService.getEarningsSummary());
    }
    
    @PostMapping("/calculate")
    public ResponseEntity<Map<String, String>> calculateCommission(@RequestBody Map<String, Long> request) {
        Long propertyId = request.get("propertyId");
        Long associateId = request.get("associateId");
        commissionService.calculateCommission(propertyId, associateId);
        return ResponseEntity.ok(Map.of("message", "Commission calculated successfully"));
    }
}

package com.investorsdeaal.controller;

import com.investorsdeaal.dto.UserDTO;
import com.investorsdeaal.service.MLMService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mlm")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MLMController {
    
    private final MLMService mlmService;
    
    @GetMapping("/referrals")
    public ResponseEntity<List<UserDTO>> getDirectReferrals() {
        return ResponseEntity.ok(mlmService.getDirectReferrals());
    }
    
    @GetMapping("/network")
    public ResponseEntity<Map<String, Object>> getNetworkTree() {
        return ResponseEntity.ok(mlmService.getNetworkTree());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getNetworkStats() {
        return ResponseEntity.ok(mlmService.getNetworkStats());
    }
    
    @GetMapping("/referral-link")
    public ResponseEntity<Map<String, String>> getReferralLink() {
        String link = mlmService.getReferralLink();
        return ResponseEntity.ok(Map.of("referralLink", link != null ? link : ""));
    }
}

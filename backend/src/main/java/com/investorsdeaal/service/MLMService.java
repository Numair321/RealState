package com.investorsdeaal.service;

import com.investorsdeaal.dto.UserDTO;
import com.investorsdeaal.model.User;
import com.investorsdeaal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MLMService {
    
    private final UserRepository userRepository;
    private final UserService userService;
    
    public List<UserDTO> getDirectReferrals() {
        User user = userService.getAuthenticatedUser();
        return userRepository.findDirectReferrals(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getNetworkStats() {
        User user = userService.getAuthenticatedUser();
        
        Map<String, Object> stats = new HashMap<>();
        
        // Direct referrals count
        Long directCount = userRepository.countDirectReferrals(user.getId());
        stats.put("directReferrals", directCount);
        
        // Total network size (all levels)
        int totalNetwork = calculateTotalNetwork(user);
        stats.put("totalNetwork", totalNetwork);
        
        // Active members
        int activeMembers = countActiveMembers(user);
        stats.put("activeMembers", activeMembers);
        
        // Network levels
        stats.put("networkLevels", getNetworkLevels(user));
        
        return stats;
    }
    
    public Map<String, Object> getNetworkTree() {
        User user = userService.getAuthenticatedUser();
        return buildNetworkTree(user, 0, 5); // Max 5 levels
    }
    
    public String getReferralLink() {
        User user = userService.getAuthenticatedUser();
        if (user.getReferralCode() == null) {
            return null;
        }
        return "https://investorsdeaal.com/register?ref=" + user.getReferralCode();
    }
    
    private Map<String, Object> buildNetworkTree(User user, int currentLevel, int maxLevel) {
        Map<String, Object> node = new HashMap<>();
        node.put("id", user.getId());
        node.put("name", user.getName());
        node.put("email", user.getEmail());
        node.put("role", user.getRole().name().toLowerCase());
        node.put("status", user.getStatus().name().toLowerCase());
        node.put("level", currentLevel);
        
        if (currentLevel < maxLevel) {
            List<User> referrals = userRepository.findDirectReferrals(user.getId());
            if (!referrals.isEmpty()) {
                List<Map<String, Object>> children = referrals.stream()
                        .map(referral -> buildNetworkTree(referral, currentLevel + 1, maxLevel))
                        .collect(Collectors.toList());
                node.put("children", children);
                node.put("childrenCount", children.size());
            } else {
                node.put("children", Collections.emptyList());
                node.put("childrenCount", 0);
            }
        }
        
        return node;
    }
    
    private int calculateTotalNetwork(User user) {
        List<User> directReferrals = userRepository.findDirectReferrals(user.getId());
        int total = directReferrals.size();
        
        for (User referral : directReferrals) {
            total += calculateTotalNetwork(referral);
        }
        
        return total;
    }
    
    private int countActiveMembers(User user) {
        List<User> directReferrals = userRepository.findDirectReferrals(user.getId());
        int active = (int) directReferrals.stream()
                .filter(u -> u.getStatus() == User.UserStatus.ACTIVE)
                .count();
        
        for (User referral : directReferrals) {
            active += countActiveMembers(referral);
        }
        
        return active;
    }
    
    private Map<Integer, Integer> getNetworkLevels(User user) {
        Map<Integer, Integer> levels = new HashMap<>();
        calculateNetworkLevels(user, 1, levels, 5);
        return levels;
    }
    
    private void calculateNetworkLevels(User user, int level, Map<Integer, Integer> levels, int maxLevel) {
        if (level > maxLevel) return;
        
        List<User> referrals = userRepository.findDirectReferrals(user.getId());
        levels.put(level, referrals.size());
        
        for (User referral : referrals) {
            calculateNetworkLevels(referral, level + 1, levels, maxLevel);
        }
    }
    
    private UserDTO mapToDTO(User user) {
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
}

package com.investorsdeaal.service;

import com.investorsdeaal.dto.CommissionDTO;
import com.investorsdeaal.exception.ResourceNotFoundException;
import com.investorsdeaal.model.Commission;
import com.investorsdeaal.model.Property;
import com.investorsdeaal.model.User;
import com.investorsdeaal.repository.CommissionRepository;
import com.investorsdeaal.repository.PropertyRepository;
import com.investorsdeaal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommissionService {
    
    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    
    // Commission rates (can be made configurable)
    private static final BigDecimal LEVEL_1_RATE = new BigDecimal("0.02"); // 2%
    private static final BigDecimal LEVEL_2_RATE = new BigDecimal("0.01"); // 1%
    private static final BigDecimal LEVEL_3_RATE = new BigDecimal("0.005"); // 0.5%
    private static final BigDecimal LEVEL_4_RATE = new BigDecimal("0.0025"); // 0.25%
    private static final BigDecimal LEVEL_5_RATE = new BigDecimal("0.0015"); // 0.15%
    private static final BigDecimal REFERRAL_BONUS = new BigDecimal("5000");
    
    public List<CommissionDTO> getMyCommissions() {
        User user = userService.getAuthenticatedUser();
        return commissionRepository.findUserCommissions(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getEarningsSummary() {
        User user = userService.getAuthenticatedUser();
        
        BigDecimal totalEarnings = commissionRepository.getTotalEarnings(user.getId());
        BigDecimal pendingEarnings = commissionRepository.getPendingEarnings(user.getId());
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEarnings", totalEarnings != null ? totalEarnings : BigDecimal.ZERO);
        summary.put("pendingEarnings", pendingEarnings != null ? pendingEarnings : BigDecimal.ZERO);
        summary.put("paidEarnings", totalEarnings != null ? totalEarnings : BigDecimal.ZERO);
        
        // Get earnings by type
        BigDecimal directEarnings = commissionRepository.getEarningsByType(user.getId(), Commission.CommissionType.DIRECT);
        BigDecimal level1Earnings = commissionRepository.getEarningsByType(user.getId(), Commission.CommissionType.LEVEL_1);
        BigDecimal level2Earnings = commissionRepository.getEarningsByType(user.getId(), Commission.CommissionType.LEVEL_2);
        
        summary.put("directEarnings", directEarnings != null ? directEarnings : BigDecimal.ZERO);
        summary.put("networkEarnings", 
            (level1Earnings != null ? level1Earnings : BigDecimal.ZERO)
            .add(level2Earnings != null ? level2Earnings : BigDecimal.ZERO));
        
        return summary;
    }
    
    @Transactional
    public void calculateCommission(Long propertyId, Long associateId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        User associate = userRepository.findById(associateId)
                .orElseThrow(() -> new ResourceNotFoundException("Associate not found"));
        
        BigDecimal propertyPrice = property.getPrice();
        
        // Direct commission for the associate
        BigDecimal directCommission = propertyPrice.multiply(LEVEL_1_RATE);
        createCommission(associate, property, associate, Commission.CommissionType.DIRECT, 
                        directCommission, 1, "Direct commission from property sale");
        
        // Multi-level commissions
        User currentReferrer = associate.getReferrer();
        int level = 1;
        
        while (currentReferrer != null && level <= 5) {
            BigDecimal commissionAmount = calculateLevelCommission(propertyPrice, level);
            Commission.CommissionType type = getCommissionType(level);
            
            createCommission(currentReferrer, property, associate, type, 
                           commissionAmount, level, 
                           "Level " + level + " commission from downline sale");
            
            currentReferrer = currentReferrer.getReferrer();
            level++;
        }
    }
    
    @Transactional
    public void createReferralBonus(Long referrerId, Long newAssociateId) {
        User referrer = userRepository.findById(referrerId)
                .orElseThrow(() -> new ResourceNotFoundException("Referrer not found"));
        
        User newAssociate = userRepository.findById(newAssociateId)
                .orElseThrow(() -> new ResourceNotFoundException("New associate not found"));
        
        createCommission(referrer, null, newAssociate, Commission.CommissionType.REFERRAL_BONUS,
                        REFERRAL_BONUS, 0, "Referral bonus for new associate");
    }
    
    private void createCommission(User user, Property property, User transactionBy,
                                 Commission.CommissionType type, BigDecimal amount,
                                 Integer level, String description) {
        Commission commission = new Commission();
        commission.setUser(user);
        commission.setProperty(property);
        commission.setTransactionBy(transactionBy);
        commission.setType(type);
        commission.setAmount(amount);
        commission.setLevel(level);
        commission.setStatus(Commission.CommissionStatus.PENDING);
        commission.setDescription(description);
        
        commissionRepository.save(commission);
    }
    
    private BigDecimal calculateLevelCommission(BigDecimal propertyPrice, int level) {
        return switch (level) {
            case 1 -> propertyPrice.multiply(LEVEL_1_RATE);
            case 2 -> propertyPrice.multiply(LEVEL_2_RATE);
            case 3 -> propertyPrice.multiply(LEVEL_3_RATE);
            case 4 -> propertyPrice.multiply(LEVEL_4_RATE);
            case 5 -> propertyPrice.multiply(LEVEL_5_RATE);
            default -> BigDecimal.ZERO;
        };
    }
    
    private Commission.CommissionType getCommissionType(int level) {
        return switch (level) {
            case 1 -> Commission.CommissionType.LEVEL_1;
            case 2 -> Commission.CommissionType.LEVEL_2;
            case 3 -> Commission.CommissionType.LEVEL_3;
            case 4 -> Commission.CommissionType.LEVEL_4;
            case 5 -> Commission.CommissionType.LEVEL_5;
            default -> Commission.CommissionType.DIRECT;
        };
    }
    
    @Transactional
    public CommissionDTO approveCommission(Long id) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found"));
        
        commission.setStatus(Commission.CommissionStatus.APPROVED);
        commission = commissionRepository.save(commission);
        
        return mapToDTO(commission);
    }
    
    @Transactional
    public CommissionDTO markAsPaid(Long id, String transactionId) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found"));
        
        commission.setStatus(Commission.CommissionStatus.PAID);
        commission.setTransactionId(transactionId);
        commission.setPaidDate(LocalDateTime.now());
        commission = commissionRepository.save(commission);
        
        return mapToDTO(commission);
    }
    
    private CommissionDTO mapToDTO(Commission commission) {
        CommissionDTO dto = new CommissionDTO();
        dto.setId(commission.getId());
        dto.setUserId(commission.getUser().getId());
        dto.setUserName(commission.getUser().getName());
        
        if (commission.getProperty() != null) {
            dto.setPropertyId(commission.getProperty().getId());
            dto.setPropertyTitle(commission.getProperty().getTitle());
        }
        
        if (commission.getTransactionBy() != null) {
            dto.setTransactionByUserId(commission.getTransactionBy().getId());
            dto.setTransactionByUserName(commission.getTransactionBy().getName());
        }
        
        dto.setType(commission.getType().name().toLowerCase().replace("_", "-"));
        dto.setAmount(commission.getAmount());
        dto.setLevel(commission.getLevel());
        dto.setStatus(commission.getStatus().name().toLowerCase());
        dto.setTransactionId(commission.getTransactionId());
        dto.setPaidDate(commission.getPaidDate());
        dto.setDescription(commission.getDescription());
        dto.setCreatedAt(commission.getCreatedAt());
        
        return dto;
    }
}

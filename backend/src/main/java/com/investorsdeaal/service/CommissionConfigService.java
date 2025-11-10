package com.investorsdeaal.service;

import com.investorsdeaal.model.CommissionConfig;
import com.investorsdeaal.repository.CommissionConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommissionConfigService {
    
    private final CommissionConfigRepository commissionConfigRepository;
    
    public CommissionConfig getConfig() {
        List<CommissionConfig> configs = commissionConfigRepository.findAll();
        if (configs.isEmpty()) {
            // Create default config if none exists
            CommissionConfig defaultConfig = new CommissionConfig();
            return commissionConfigRepository.save(defaultConfig);
        }
        return configs.get(0);
    }
    
    public CommissionConfig updateConfig(CommissionConfig config) {
        CommissionConfig existing = getConfig();
        existing.setLevel1(config.getLevel1());
        existing.setLevel2(config.getLevel2());
        existing.setLevel3(config.getLevel3());
        existing.setLevel4(config.getLevel4());
        existing.setLevel5(config.getLevel5());
        existing.setReferralBonus(config.getReferralBonus());
        existing.setMilestoneBonus(config.getMilestoneBonus());
        return commissionConfigRepository.save(existing);
    }
}

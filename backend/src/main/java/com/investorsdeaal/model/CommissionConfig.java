package com.investorsdeaal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "commission_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommissionConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Double level1 = 2.0;
    
    @Column(nullable = false)
    private Double level2 = 1.0;
    
    @Column(nullable = false)
    private Double level3 = 0.5;
    
    @Column(nullable = false)
    private Double level4 = 0.25;
    
    @Column(nullable = false)
    private Double level5 = 0.15;
    
    @Column(nullable = false)
    private Double referralBonus = 5000.0;
    
    @Column(nullable = false)
    private Double milestoneBonus = 10000.0;
}

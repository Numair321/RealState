package com.investorsdeaal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Commission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
    
    @ManyToOne
    @JoinColumn(name = "transaction_by_user_id")
    private User transactionBy;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommissionType type;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    private Integer level; // For MLM levels (1-5)
    
    @Enumerated(EnumType.STRING)
    private CommissionStatus status = CommissionStatus.PENDING;
    
    private String transactionId;
    private LocalDateTime paidDate;
    
    @Column(length = 1000)
    private String description;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum CommissionType {
        DIRECT, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, REFERRAL_BONUS, MILESTONE_BONUS
    }
    
    public enum CommissionStatus {
        PENDING, APPROVED, PAID, REJECTED
    }
}

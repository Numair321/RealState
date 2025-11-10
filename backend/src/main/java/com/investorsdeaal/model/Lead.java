package com.investorsdeaal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Lead {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Customer Information
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private String customerPhone;
    
    private String customerEmail;
    
    // Property Related
    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;
    
    private String propertyRequirement;
    
    // Assignment
    @ManyToOne
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedTo;
    
    @Enumerated(EnumType.STRING)
    private LeadStatus status = LeadStatus.OPEN;
    
    @Enumerated(EnumType.STRING)
    private LeadPriority priority = LeadPriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    private LeadSource source;
    
    // Tracking
    private LocalDateTime lastContactDate;
    private LocalDateTime nextFollowupDate;
    
    @Column(length = 2000)
    private String notes;
    
    private Integer escalationCount = 0;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum LeadStatus {
        OPEN, IN_PROGRESS, CLOSED_WON, CLOSED_LOST, ESCALATED
    }
    
    public enum LeadPriority {
        LOW, MEDIUM, HIGH, URGENT
    }
    
    public enum LeadSource {
        WEBSITE, REFERRAL, DIRECT, SOCIAL_MEDIA, ADVERTISEMENT
    }
}

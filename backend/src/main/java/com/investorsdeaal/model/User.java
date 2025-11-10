package com.investorsdeaal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.PENDING;
    
    // Profile Information
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String bio;
    private String profilePicture;
    
    // MLM Related
    @ManyToOne
    @JoinColumn(name = "referrer_id")
    private User referrer;
    
    @Column(unique = true)
    private String referralCode;
    
    @OneToMany(mappedBy = "referrer")
    private Set<User> referrals = new HashSet<>();
    
    // Settings
    private Boolean emailNotifications = true;
    private Boolean smsNotifications = false;
    private Boolean leadAlerts = true;
    private Boolean commissionUpdates = true;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum UserRole {
        ADMIN, ASSOCIATE, COMPANY, BUYER, SELLER, CUSTOMER
    }
    
    public enum UserStatus {
        PENDING, ACTIVE, INACTIVE, SUSPENDED
    }
}

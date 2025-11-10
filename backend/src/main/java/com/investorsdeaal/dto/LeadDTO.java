package com.investorsdeaal.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LeadDTO {
    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Long propertyId;
    private String propertyTitle;
    private String propertyRequirement;
    private Long assignedToUserId;
    private String assignedToUserName;
    private String status;
    private String priority;
    private String source;
    private LocalDateTime lastContactDate;
    private LocalDateTime nextFollowupDate;
    private String notes;
    private Integer escalationCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

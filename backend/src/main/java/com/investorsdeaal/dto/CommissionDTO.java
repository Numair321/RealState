package com.investorsdeaal.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CommissionDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long propertyId;
    private String propertyTitle;
    private Long transactionByUserId;
    private String transactionByUserName;
    private String type;
    private BigDecimal amount;
    private Integer level;
    private String status;
    private String transactionId;
    private LocalDateTime paidDate;
    private String description;
    private LocalDateTime createdAt;
}

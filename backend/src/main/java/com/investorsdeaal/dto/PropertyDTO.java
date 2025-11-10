package com.investorsdeaal.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PropertyDTO {
    private Long id;
    private String title;
    private String description;
    private String propertyType;
    private String category;
    private String listingType;
    private BigDecimal price;
    private String location;
    private String city;
    private String state;
    private String pincode;
    private Integer area;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer parking;
    private String furnished;
    private List<String> amenities;
    private List<String> images;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;
    private Long listedByUserId;
    private String listedByUserName;
    private String status;
    private Boolean isFeatured;
    private Boolean isHotDeal;
    private Integer views;
    private Integer leads;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

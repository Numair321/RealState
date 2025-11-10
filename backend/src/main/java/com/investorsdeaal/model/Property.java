package com.investorsdeaal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Property {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType propertyType;
    
    @Enumerated(EnumType.STRING)
    private PropertyCategory category;
    
    @Enumerated(EnumType.STRING)
    private ListingType listingType;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    // Location
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String state;
    
    private String pincode;
    
    // Specifications
    private Integer area; // in sq ft
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer parking;
    
    @Enumerated(EnumType.STRING)
    private FurnishedStatus furnished;
    
    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();
    
    // Owner Details
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;
    
    // Listed By
    @ManyToOne
    @JoinColumn(name = "listed_by_user_id")
    private User listedBy;
    
    @Enumerated(EnumType.STRING)
    private PropertyStatus status = PropertyStatus.PENDING;
    
    private Boolean isFeatured = false;
    private Boolean isHotDeal = false;
    
    private Integer views = 0;
    private Integer leads = 0;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum PropertyType {
        RESIDENTIAL, COMMERCIAL, INDUSTRIAL, LAND
    }
    
    public enum PropertyCategory {
        APARTMENT, VILLA, HOUSE, OFFICE, SHOP, WAREHOUSE, PLOT
    }
    
    public enum ListingType {
        SALE, RENT
    }
    
    public enum FurnishedStatus {
        UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED
    }
    
    public enum PropertyStatus {
        PENDING, APPROVED, REJECTED, SOLD, RENTED
    }
}

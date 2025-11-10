package com.investorsdeaal.controller;

import com.investorsdeaal.dto.PropertyDTO;
import com.investorsdeaal.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PropertyController {
    
    private final PropertyService propertyService;
    
    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAllProperties(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String listingType,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Boolean isHotDeal,
            @RequestParam(required = false) String city) {
        
        List<PropertyDTO> properties;
        
        // Start with base filter
        if ("approved".equalsIgnoreCase(status)) {
            properties = propertyService.getApprovedProperties();
        } else if ("pending".equalsIgnoreCase(status)) {
            properties = propertyService.getAllProperties().stream()
                .filter(p -> "pending".equalsIgnoreCase(p.getStatus()))
                .collect(java.util.stream.Collectors.toList());
        } else {
            properties = propertyService.getAllProperties();
        }
        
        // Apply additional filters
        if (listingType != null) {
            properties = properties.stream()
                .filter(p -> listingType.equalsIgnoreCase(p.getListingType()))
                .collect(java.util.stream.Collectors.toList());
        }
        
        if (propertyType != null) {
            properties = properties.stream()
                .filter(p -> propertyType.equalsIgnoreCase(p.getPropertyType()))
                .collect(java.util.stream.Collectors.toList());
        }
        
        if (isHotDeal != null && isHotDeal) {
            properties = properties.stream()
                .filter(p -> p.getIsHotDeal() != null && p.getIsHotDeal())
                .collect(java.util.stream.Collectors.toList());
        }
        
        if (city != null) {
            properties = properties.stream()
                .filter(p -> city.equalsIgnoreCase(p.getCity()))
                .collect(java.util.stream.Collectors.toList());
        }
        
        return ResponseEntity.ok(properties);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<PropertyDTO>> getFeaturedProperties() {
        return ResponseEntity.ok(propertyService.getFeaturedProperties());
    }
    
    @GetMapping("/hot-deals")
    public ResponseEntity<List<PropertyDTO>> getHotDeals() {
        return ResponseEntity.ok(propertyService.getHotDeals());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<PropertyDTO>> searchProperties(@RequestParam String keyword) {
        return ResponseEntity.ok(propertyService.searchProperties(keyword));
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<List<PropertyDTO>> getPropertiesByCity(@PathVariable String city) {
        return ResponseEntity.ok(propertyService.getPropertiesByCity(city));
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<PropertyDTO>> getPropertiesByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return ResponseEntity.ok(propertyService.getPropertiesByPriceRange(minPrice, maxPrice));
    }
    
    @GetMapping("/my-properties")
    public ResponseEntity<List<PropertyDTO>> getMyProperties() {
        return ResponseEntity.ok(propertyService.getMyProperties());
    }
    
    @PostMapping
    public ResponseEntity<PropertyDTO> createProperty(@RequestBody PropertyDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(propertyService.createProperty(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyDTO dto) {
        return ResponseEntity.ok(propertyService.updateProperty(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }
}

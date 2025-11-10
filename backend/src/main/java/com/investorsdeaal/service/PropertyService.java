package com.investorsdeaal.service;

import com.investorsdeaal.dto.PropertyDTO;
import com.investorsdeaal.exception.BadRequestException;
import com.investorsdeaal.exception.ResourceNotFoundException;
import com.investorsdeaal.model.Property;
import com.investorsdeaal.model.User;
import com.investorsdeaal.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {
    
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    
    public List<PropertyDTO> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PropertyDTO> getApprovedProperties() {
        return propertyRepository.findByStatus(Property.PropertyStatus.APPROVED).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PropertyDTO> getFeaturedProperties() {
        return propertyRepository.findByIsFeaturedTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PropertyDTO> getHotDeals() {
        return propertyRepository.findByIsHotDealTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public PropertyDTO getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        // Increment views
        property.setViews(property.getViews() + 1);
        propertyRepository.save(property);
        
        return mapToDTO(property);
    }
    
    public List<PropertyDTO> searchProperties(String keyword) {
        return propertyRepository.searchProperties(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PropertyDTO> getPropertiesByCity(String city) {
        return propertyRepository.findByCity(city).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<PropertyDTO> getPropertiesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return propertyRepository.findByPriceRange(minPrice, maxPrice).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public PropertyDTO createProperty(PropertyDTO dto) {
        User user = userService.getAuthenticatedUser();
        
        Property property = new Property();
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setPropertyType(Property.PropertyType.valueOf(dto.getPropertyType().toUpperCase()));
        property.setCategory(Property.PropertyCategory.valueOf(dto.getCategory().toUpperCase()));
        property.setListingType(Property.ListingType.valueOf(dto.getListingType().toUpperCase()));
        property.setPrice(dto.getPrice());
        property.setLocation(dto.getLocation());
        property.setCity(dto.getCity());
        property.setState(dto.getState());
        property.setPincode(dto.getPincode());
        property.setArea(dto.getArea());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setParking(dto.getParking());
        
        if (dto.getFurnished() != null) {
            property.setFurnished(Property.FurnishedStatus.valueOf(dto.getFurnished().toUpperCase()));
        }
        
        property.setAmenities(dto.getAmenities());
        property.setImages(dto.getImages());
        property.setOwnerName(dto.getOwnerName());
        property.setOwnerPhone(dto.getOwnerPhone());
        property.setOwnerEmail(dto.getOwnerEmail());
        property.setListedBy(user);
        property.setStatus(Property.PropertyStatus.PENDING);
        
        property = propertyRepository.save(property);
        return mapToDTO(property);
    }
    
    @Transactional
    public PropertyDTO updateProperty(Long id, PropertyDTO dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        User user = userService.getAuthenticatedUser();
        
        // Check if user owns this property or is admin
        if (!property.getListedBy().getId().equals(user.getId()) && 
            user.getRole() != User.UserRole.ADMIN) {
            throw new BadRequestException("You don't have permission to update this property");
        }
        
        if (dto.getTitle() != null) property.setTitle(dto.getTitle());
        if (dto.getDescription() != null) property.setDescription(dto.getDescription());
        if (dto.getPrice() != null) property.setPrice(dto.getPrice());
        if (dto.getLocation() != null) property.setLocation(dto.getLocation());
        if (dto.getCity() != null) property.setCity(dto.getCity());
        if (dto.getState() != null) property.setState(dto.getState());
        if (dto.getPincode() != null) property.setPincode(dto.getPincode());
        if (dto.getArea() != null) property.setArea(dto.getArea());
        if (dto.getBedrooms() != null) property.setBedrooms(dto.getBedrooms());
        if (dto.getBathrooms() != null) property.setBathrooms(dto.getBathrooms());
        if (dto.getParking() != null) property.setParking(dto.getParking());
        if (dto.getAmenities() != null) property.setAmenities(dto.getAmenities());
        if (dto.getImages() != null) property.setImages(dto.getImages());
        
        property = propertyRepository.save(property);
        return mapToDTO(property);
    }
    
    @Transactional
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        
        User user = userService.getAuthenticatedUser();
        
        if (!property.getListedBy().getId().equals(user.getId()) && 
            user.getRole() != User.UserRole.ADMIN) {
            throw new BadRequestException("You don't have permission to delete this property");
        }
        
        propertyRepository.delete(property);
    }
    
    public List<PropertyDTO> getMyProperties() {
        User user = userService.getAuthenticatedUser();
        return propertyRepository.findByListedBy(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    private PropertyDTO mapToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setPropertyType(property.getPropertyType().name().toLowerCase());
        dto.setCategory(property.getCategory().name().toLowerCase());
        dto.setListingType(property.getListingType().name().toLowerCase());
        dto.setPrice(property.getPrice());
        dto.setLocation(property.getLocation());
        dto.setCity(property.getCity());
        dto.setState(property.getState());
        dto.setPincode(property.getPincode());
        dto.setArea(property.getArea());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setParking(property.getParking());
        if (property.getFurnished() != null) {
            dto.setFurnished(property.getFurnished().name().toLowerCase());
        }
        dto.setAmenities(property.getAmenities());
        dto.setImages(property.getImages());
        dto.setOwnerName(property.getOwnerName());
        dto.setOwnerPhone(property.getOwnerPhone());
        dto.setOwnerEmail(property.getOwnerEmail());
        if (property.getListedBy() != null) {
            dto.setListedByUserId(property.getListedBy().getId());
            dto.setListedByUserName(property.getListedBy().getName());
        }
        dto.setStatus(property.getStatus().name().toLowerCase());
        dto.setIsFeatured(property.getIsFeatured());
        dto.setIsHotDeal(property.getIsHotDeal());
        dto.setViews(property.getViews());
        dto.setLeads(property.getLeads());
        dto.setCreatedAt(property.getCreatedAt());
        dto.setUpdatedAt(property.getUpdatedAt());
        return dto;
    }
}

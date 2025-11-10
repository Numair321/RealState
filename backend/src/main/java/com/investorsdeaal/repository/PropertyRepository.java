package com.investorsdeaal.repository;

import com.investorsdeaal.model.Property;
import com.investorsdeaal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    
    List<Property> findByStatus(Property.PropertyStatus status);
    
    List<Property> findByListedBy(User user);
    
    List<Property> findByPropertyType(Property.PropertyType propertyType);
    
    List<Property> findByCity(String city);
    
    List<Property> findByIsFeaturedTrue();
    
    List<Property> findByIsHotDealTrue();
    
    @Query("SELECT p FROM Property p WHERE p.status = 'APPROVED' ORDER BY p.createdAt DESC")
    List<Property> findLatestProperties();
    
    @Query("SELECT p FROM Property p WHERE p.status = 'APPROVED' AND " +
           "LOWER(p.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Property> searchProperties(String keyword);
    
    @Query("SELECT p FROM Property p WHERE p.status = 'APPROVED' AND " +
           "p.price BETWEEN :minPrice AND :maxPrice")
    List<Property> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
}

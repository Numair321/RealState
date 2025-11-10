package com.investorsdeaal.repository;

import com.investorsdeaal.model.Commission;
import com.investorsdeaal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {
    
    List<Commission> findByUser(User user);
    
    List<Commission> findByUserAndStatus(User user, Commission.CommissionStatus status);
    
    @Query("SELECT SUM(c.amount) FROM Commission c WHERE c.user.id = :userId AND c.status = 'PAID'")
    BigDecimal getTotalEarnings(Long userId);
    
    @Query("SELECT SUM(c.amount) FROM Commission c WHERE c.user.id = :userId AND c.status = 'PENDING'")
    BigDecimal getPendingEarnings(Long userId);
    
    @Query("SELECT c FROM Commission c WHERE c.user.id = :userId ORDER BY c.createdAt DESC")
    List<Commission> findUserCommissions(Long userId);
    
    @Query("SELECT SUM(c.amount) FROM Commission c WHERE c.user.id = :userId AND c.type = :type AND c.status = 'PAID'")
    BigDecimal getEarningsByType(Long userId, Commission.CommissionType type);
}

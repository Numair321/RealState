package com.investorsdeaal.repository;

import com.investorsdeaal.model.Lead;
import com.investorsdeaal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    
    List<Lead> findByAssignedTo(User user);
    
    List<Lead> findByStatus(Lead.LeadStatus status);
    
    List<Lead> findByAssignedToAndStatus(User user, Lead.LeadStatus status);
    
    @Query("SELECT l FROM Lead l WHERE l.assignedTo.id = :userId AND l.status = 'OPEN' " +
           "AND l.createdAt < :escalationDate")
    List<Lead> findEscalatedLeads(Long userId, LocalDateTime escalationDate);
    
    @Query("SELECT COUNT(l) FROM Lead l WHERE l.assignedTo.id = :userId AND l.status = 'CLOSED_WON'")
    Long countConvertedLeads(Long userId);
    
    @Query("SELECT l FROM Lead l WHERE l.nextFollowupDate <= :date AND l.status IN ('OPEN', 'IN_PROGRESS')")
    List<Lead> findUpcomingFollowups(LocalDateTime date);
}

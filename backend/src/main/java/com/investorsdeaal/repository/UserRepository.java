package com.investorsdeaal.repository;

import com.investorsdeaal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByReferralCode(String referralCode);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByReferralCode(String referralCode);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByStatus(User.UserStatus status);
    
    List<User> findByReferrer(User referrer);
    
    @Query("SELECT u FROM User u WHERE u.referrer.id = :referrerId")
    List<User> findDirectReferrals(Long referrerId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.referrer.id = :referrerId")
    Long countDirectReferrals(Long referrerId);
}

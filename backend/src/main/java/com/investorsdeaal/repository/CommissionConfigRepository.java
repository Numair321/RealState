package com.investorsdeaal.repository;

import com.investorsdeaal.model.CommissionConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommissionConfigRepository extends JpaRepository<CommissionConfig, Long> {
}

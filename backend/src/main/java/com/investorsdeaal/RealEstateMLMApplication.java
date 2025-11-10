package com.investorsdeaal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RealEstateMLMApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(RealEstateMLMApplication.class, args);
        System.out.println("InvestorsDeaal Backend is running on port 5000");
    }
}

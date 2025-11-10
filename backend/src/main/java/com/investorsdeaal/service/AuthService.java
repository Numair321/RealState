package com.investorsdeaal.service;

import com.investorsdeaal.dto.AuthRequest;
import com.investorsdeaal.dto.AuthResponse;
import com.investorsdeaal.dto.RegisterRequest;
import com.investorsdeaal.dto.UserDTO;
import com.investorsdeaal.exception.BadRequestException;
import com.investorsdeaal.model.User;
import com.investorsdeaal.repository.UserRepository;
import com.investorsdeaal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Set role
        user.setRole(mapRole(request.getRole()));
        
        // Set status (PENDING for associates, ACTIVE for others)
        if (user.getRole() == User.UserRole.ASSOCIATE) {
            user.setStatus(User.UserStatus.PENDING);
        } else {
            user.setStatus(User.UserStatus.ACTIVE);
        }
        
        // Generate referral code for associates
        if (user.getRole() == User.UserRole.ASSOCIATE) {
            user.setReferralCode(generateReferralCode());
        }
        
        // Handle referral
        if (request.getReferralCode() != null && !request.getReferralCode().isEmpty()) {
            User referrer = userRepository.findByReferralCode(request.getReferralCode())
                    .orElseThrow(() -> new BadRequestException("Invalid referral code"));
            user.setReferrer(referrer);
        }
        
        user = userRepository.save(user);
        
        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, mapToDTO(user));
    }
    
    public AuthResponse login(AuthRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        // Get user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        // Check if user is active
        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new BadRequestException("Account is not active. Please wait for admin approval.");
        }
        
        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, mapToDTO(user));
    }
    
    private User.UserRole mapRole(String role) {
        return switch (role.toLowerCase()) {
            case "buyer" -> User.UserRole.BUYER;
            case "seller" -> User.UserRole.SELLER;
            case "associate" -> User.UserRole.ASSOCIATE;
            case "company" -> User.UserRole.COMPANY;
            default -> User.UserRole.CUSTOMER;
        };
    }
    
    private String generateReferralCode() {
        String code;
        do {
            code = "REF" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (userRepository.existsByReferralCode(code));
        return code;
    }
    
    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().name().toLowerCase());
        dto.setStatus(user.getStatus().name().toLowerCase());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setState(user.getState());
        dto.setPincode(user.getPincode());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setReferralCode(user.getReferralCode());
        if (user.getReferrer() != null) {
            dto.setReferrerId(user.getReferrer().getId());
            dto.setReferrerName(user.getReferrer().getName());
        }
        return dto;
    }
}

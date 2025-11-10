package com.investorsdeaal.service;

import com.investorsdeaal.dto.ChangePasswordRequest;
import com.investorsdeaal.dto.UpdateProfileRequest;
import com.investorsdeaal.dto.UserDTO;
import com.investorsdeaal.exception.BadRequestException;
import com.investorsdeaal.exception.ResourceNotFoundException;
import com.investorsdeaal.model.User;
import com.investorsdeaal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserDTO getCurrentUser() {
        User user = getAuthenticatedUser();
        return mapToDTO(user);
    }
    
    @Transactional
    public UserDTO updateProfile(UpdateProfileRequest request) {
        User user = getAuthenticatedUser();
        
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getState() != null) user.setState(request.getState());
        if (request.getPincode() != null) user.setPincode(request.getPincode());
        if (request.getBio() != null) user.setBio(request.getBio());
        
        user = userRepository.save(user);
        return mapToDTO(user);
    }
    
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getAuthenticatedUser();
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        
        // Verify new passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New passwords do not match");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    @Transactional
    public UserDTO updateSettings(User.UserStatus status, Boolean emailNotifications, 
                                   Boolean smsNotifications, Boolean leadAlerts, 
                                   Boolean commissionUpdates) {
        User user = getAuthenticatedUser();
        
        if (emailNotifications != null) user.setEmailNotifications(emailNotifications);
        if (smsNotifications != null) user.setSmsNotifications(smsNotifications);
        if (leadAlerts != null) user.setLeadAlerts(leadAlerts);
        if (commissionUpdates != null) user.setCommissionUpdates(commissionUpdates);
        
        user = userRepository.save(user);
        return mapToDTO(user);
    }
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDTO(user);
    }
    
    public List<UserDTO> getUsersByRole(String role) {
        User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
        return userRepository.findByRole(userRole).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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

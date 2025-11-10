package com.investorsdeaal.service;

import com.investorsdeaal.dto.LeadDTO;
import com.investorsdeaal.exception.BadRequestException;
import com.investorsdeaal.exception.ResourceNotFoundException;
import com.investorsdeaal.model.Lead;
import com.investorsdeaal.model.Property;
import com.investorsdeaal.model.User;
import com.investorsdeaal.repository.LeadRepository;
import com.investorsdeaal.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadService {
    
    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    
    public List<LeadDTO> getAllLeads() {
        return leadRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<LeadDTO> getMyLeads() {
        User user = userService.getAuthenticatedUser();
        return leadRepository.findByAssignedTo(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<LeadDTO> getLeadsByStatus(String status) {
        Lead.LeadStatus leadStatus = Lead.LeadStatus.valueOf(status.toUpperCase().replace("-", "_"));
        return leadRepository.findByStatus(leadStatus).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public LeadDTO getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
        return mapToDTO(lead);
    }
    
    @Transactional
    public LeadDTO createLead(LeadDTO dto) {
        Lead lead = new Lead();
        lead.setCustomerName(dto.getCustomerName());
        lead.setCustomerPhone(dto.getCustomerPhone());
        lead.setCustomerEmail(dto.getCustomerEmail());
        lead.setPropertyRequirement(dto.getPropertyRequirement());
        
        if (dto.getPropertyId() != null) {
            Property property = propertyRepository.findById(dto.getPropertyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
            lead.setProperty(property);
            
            // Increment lead count on property
            property.setLeads(property.getLeads() + 1);
            propertyRepository.save(property);
        }
        
        if (dto.getPriority() != null) {
            lead.setPriority(Lead.LeadPriority.valueOf(dto.getPriority().toUpperCase()));
        }
        
        if (dto.getSource() != null) {
            lead.setSource(Lead.LeadSource.valueOf(dto.getSource().toUpperCase().replace("-", "_")));
        }
        
        lead.setStatus(Lead.LeadStatus.OPEN);
        
        // Auto-assign to current user if associate
        User user = userService.getAuthenticatedUser();
        if (user.getRole() == User.UserRole.ASSOCIATE) {
            lead.setAssignedTo(user);
        }
        
        lead = leadRepository.save(lead);
        return mapToDTO(lead);
    }
    
    @Transactional
    public LeadDTO updateLead(Long id, LeadDTO dto) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
        
        if (dto.getCustomerName() != null) lead.setCustomerName(dto.getCustomerName());
        if (dto.getCustomerPhone() != null) lead.setCustomerPhone(dto.getCustomerPhone());
        if (dto.getCustomerEmail() != null) lead.setCustomerEmail(dto.getCustomerEmail());
        if (dto.getPropertyRequirement() != null) lead.setPropertyRequirement(dto.getPropertyRequirement());
        if (dto.getNotes() != null) lead.setNotes(dto.getNotes());
        
        if (dto.getStatus() != null) {
            lead.setStatus(Lead.LeadStatus.valueOf(dto.getStatus().toUpperCase().replace("-", "_")));
        }
        
        if (dto.getPriority() != null) {
            lead.setPriority(Lead.LeadPriority.valueOf(dto.getPriority().toUpperCase()));
        }
        
        lead = leadRepository.save(lead);
        return mapToDTO(lead);
    }
    
    @Transactional
    public LeadDTO updateLeadStatus(Long id, String status) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
        
        lead.setStatus(Lead.LeadStatus.valueOf(status.toUpperCase().replace("-", "_")));
        lead.setLastContactDate(LocalDateTime.now());
        
        lead = leadRepository.save(lead);
        return mapToDTO(lead);
    }
    
    @Transactional
    public LeadDTO scheduleFollowup(Long id, LocalDateTime followupDate) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
        
        lead.setNextFollowupDate(followupDate);
        lead = leadRepository.save(lead);
        return mapToDTO(lead);
    }
    
    public List<LeadDTO> getUpcomingFollowups() {
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        return leadRepository.findUpcomingFollowups(tomorrow).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
        leadRepository.delete(lead);
    }
    
    public Long getConversionCount(Long userId) {
        return leadRepository.countConvertedLeads(userId);
    }
    
    private LeadDTO mapToDTO(Lead lead) {
        LeadDTO dto = new LeadDTO();
        dto.setId(lead.getId());
        dto.setCustomerName(lead.getCustomerName());
        dto.setCustomerPhone(lead.getCustomerPhone());
        dto.setCustomerEmail(lead.getCustomerEmail());
        
        if (lead.getProperty() != null) {
            dto.setPropertyId(lead.getProperty().getId());
            dto.setPropertyTitle(lead.getProperty().getTitle());
        }
        
        dto.setPropertyRequirement(lead.getPropertyRequirement());
        
        if (lead.getAssignedTo() != null) {
            dto.setAssignedToUserId(lead.getAssignedTo().getId());
            dto.setAssignedToUserName(lead.getAssignedTo().getName());
        }
        
        dto.setStatus(lead.getStatus().name().toLowerCase().replace("_", "-"));
        dto.setPriority(lead.getPriority().name().toLowerCase());
        if (lead.getSource() != null) {
            dto.setSource(lead.getSource().name().toLowerCase().replace("_", "-"));
        }
        dto.setLastContactDate(lead.getLastContactDate());
        dto.setNextFollowupDate(lead.getNextFollowupDate());
        dto.setNotes(lead.getNotes());
        dto.setEscalationCount(lead.getEscalationCount());
        dto.setCreatedAt(lead.getCreatedAt());
        dto.setUpdatedAt(lead.getUpdatedAt());
        
        return dto;
    }
}

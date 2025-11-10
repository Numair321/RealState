package com.investorsdeaal.dto;

import com.investorsdeaal.model.User;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String bio;
    private String profilePicture;
    private String referralCode;
    private Long referrerId;
    private String referrerName;
}

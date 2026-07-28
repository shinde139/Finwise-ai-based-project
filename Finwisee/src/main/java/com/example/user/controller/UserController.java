package com.example.user.controller;

import com.example.user.dto.LoginRequest;
import com.example.user.dto.LoginResponse;
import com.example.user.dto.ResetPasswordRequest;
import com.example.user.entity.User;
import com.example.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // GET ALL USERS
    @GetMapping
    public Collection<User> retrieveAll() {
        return userService.retrieveAll();
    }

    // GET USER BY ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> retrieveById(@PathVariable Integer userId) {

        User user = userService.retrieveById(userId);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    // UPDATE USER
    @PutMapping("/{userId}")
    public ResponseEntity<?> update(
            @PathVariable Integer userId,
            @RequestBody User user) {

        user.setUserId(userId);
        userService.update(user);

        return ResponseEntity.ok("Updated Successfully");
    }

    // DELETE USER
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> delete(@PathVariable Integer userId) {
        userService.deleteById(userId);
        return ResponseEntity.ok("Deleted Successfully");
    }

    // REGISTER
    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    // LOGIN
    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // FORGOT PASSWORD
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        return ResponseEntity.ok(userService.forgotPassword(email));
    }

    // RESET PASSWORD
    @PostMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(userService.resetPassword(request));
    }

    // PROFILE (FIXED)
   
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestHeader("Authorization") String token) {

        try {
            return ResponseEntity.ok(userService.getProfile(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid Token");
        }
    }}
// TransactionController.java
package com.example.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.user.dto.TransactionResponseDTO;
import com.example.user.entity.Transaction;
import com.example.user.service.TransactionService;

@RestController
@RequestMapping("/api/transaction")
@CrossOrigin("*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Add
    @PostMapping("/{userId}/{categoryId}")
    public String addTransaction(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId,
            @RequestBody Transaction transaction){
        return transactionService.addTransaction(userId, categoryId, transaction);
    }

    // Get - UPDATED to return DTOs
    @GetMapping("/{userId}")
    public List<TransactionResponseDTO> getTransactions(
            @PathVariable Integer userId){
        return transactionService.getTransactions(userId);
    }

    // Update
    @PutMapping("/{id}")
    public String updateTransaction(
            @PathVariable Integer id,
            @RequestBody Transaction transaction){
        return transactionService.updateTransaction(id, transaction);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteTransaction(
            @PathVariable Integer id){
        return transactionService.deleteTransaction(id);
    }
}
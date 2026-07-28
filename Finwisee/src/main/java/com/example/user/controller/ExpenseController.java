// ExpenseController.java
package com.example.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.user.dto.ExpenseResponseDTO;
import com.example.user.entity.Expense;
import com.example.user.service.ExpenseService;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/{userId}/{categoryId}")
    public ResponseEntity<?> addExpense(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId,
            @RequestBody Expense expense) {
        String result = expenseService.addExpense(userId, categoryId, expense);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ExpenseResponseDTO>> getExpenses(@PathVariable Integer userId) {
        List<ExpenseResponseDTO> expenses = expenseService.getExpenses(userId);
        return ResponseEntity.ok(expenses);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<String> updateExpense(
            @PathVariable Integer expenseId,
            @RequestBody Expense expense) {
        String result = expenseService.updateExpense(expenseId, expense);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<String> deleteExpense(@PathVariable Integer expenseId) {
        String result = expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok(result);
    }
}
// ExpenseService.java
package com.example.user.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.user.dto.ExpenseResponseDTO;
import com.example.user.entity.Category;
import com.example.user.entity.Expense;
import com.example.user.entity.User;
import com.example.user.repository.CategoryRepository;
import com.example.user.repository.ExpenseRepository;
import com.example.user.repository.UserRepository;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DailyExpenseNotificationService dailyExpenseNotificationService;
    
    @Autowired
    private NotificationGeneratorService notificationGeneratorService;

    // Add Expense
    public String addExpense(
            Integer userId,
            Integer categoryId,
            Expense expense){

        User user = userRepository.findById(userId).orElseThrow();
        Category category = categoryRepository.findById(categoryId).orElseThrow();

        expense.setUser(user);
        expense.setCategory(category);

        Expense savedExpense = expenseRepository.save(expense);

        // Send notification
        String categoryName = category.getCategoryName() != null ? 
                              category.getCategoryName() : "Uncategorized";
        
        dailyExpenseNotificationService.notifyDailyExpenseAdded(
            userId, 
            savedExpense.getAmount(), 
            categoryName
        );

        return "Expense Added Successfully";
    }

    // Get User Expenses - FIXED to return DTOs with proper category data
    @Transactional(readOnly = true)
    public List<ExpenseResponseDTO> getExpenses(Integer userId){
        List<Expense> expenses = expenseRepository.findByUserUserId(userId);
        return expenses.stream()
                .map(expense -> {
                    ExpenseResponseDTO dto = new ExpenseResponseDTO();
                    dto.setExpenseId(expense.getExpenseId());
                    dto.setAmount(expense.getAmount());
                    dto.setDescription(expense.getDescription());
                    dto.setExpenseDate(expense.getExpenseDate());
                    
                    // Explicitly set category data
                    if (expense.getCategory() != null) {
                        dto.setCategoryId(expense.getCategory().getCategoryId());
                        dto.setCategoryName(expense.getCategory().getCategoryName());
                    } else {
                        dto.setCategoryId(null);
                        dto.setCategoryName("Uncategorized");
                    }
                    
                    if (expense.getUser() != null) {
                        dto.setUserId(expense.getUser().getUserId());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Update
    public String updateExpense(
            Integer expenseId,
            Expense expense){

        Expense oldExpense = expenseRepository.findById(expenseId).orElse(null);

        if(oldExpense == null){
            return "Expense Not Found";
        }

        oldExpense.setAmount(expense.getAmount());
        oldExpense.setDescription(expense.getDescription());
        oldExpense.setExpenseDate(expense.getExpenseDate());
        oldExpense.setCategory(expense.getCategory());

        expenseRepository.save(oldExpense);
        return "Expense Updated";
    }

    // Delete
    public String deleteExpense(Integer id){
        expenseRepository.deleteById(id);
        return "Expense Deleted";
    }
}
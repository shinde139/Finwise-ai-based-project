// BudgetService.java
package com.example.user.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.user.dto.BudgetResponseDTO;
import com.example.user.entity.Budget;
import com.example.user.entity.Category;
import com.example.user.entity.User;
import com.example.user.repository.BudgetRepository;
import com.example.user.repository.CategoryRepository;
import com.example.user.repository.UserRepository;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Add Budget
    public String addBudget(
            Integer userId,
            Integer categoryId,
            Budget budget){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

        budget.setUser(user);
        budget.setCategory(category);

        budgetRepository.save(budget);

        return "Budget Added Successfully";
    }

    // Get Budgets - FIXED to return DTOs with proper category data
    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getBudgets(Integer userId){
        List<Budget> budgets = budgetRepository.findByUserUserId(userId);
        return budgets.stream()
                .map(budget -> {
                    BudgetResponseDTO dto = new BudgetResponseDTO();
                    dto.setBudgetId(budget.getBudgetId());
                    dto.setBudgetAmount(budget.getBudgetAmount());
                    dto.setSpentAmount(budget.getSpentAmount());
                    dto.setStartDate(budget.getStartDate());
                    dto.setEndDate(budget.getEndDate());
                    
                    // Explicitly set category data
                    if (budget.getCategory() != null) {
                        dto.setCategoryId(budget.getCategory().getCategoryId());
                        dto.setCategoryName(budget.getCategory().getCategoryName());
                    } else {
                        dto.setCategoryId(null);
                        dto.setCategoryName("Uncategorized");
                    }
                    
                    if (budget.getUser() != null) {
                        dto.setUserId(budget.getUser().getUserId());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Update
    public String updateBudget(
            Integer budgetId,
            Budget budget){

        Budget oldBudget = budgetRepository.findById(budgetId)
                .orElse(null);

        if(oldBudget == null){
            return "Budget Not Found";
        }

        oldBudget.setBudgetAmount(budget.getBudgetAmount());
        oldBudget.setSpentAmount(budget.getSpentAmount());
        oldBudget.setStartDate(budget.getStartDate());
        oldBudget.setEndDate(budget.getEndDate());
        oldBudget.setCategory(budget.getCategory());

        budgetRepository.save(oldBudget);

        return "Budget Updated Successfully";
    }

    // Delete
    public String deleteBudget(Integer id){
        budgetRepository.deleteById(id);
        return "Budget Deleted Successfully";
    }
}
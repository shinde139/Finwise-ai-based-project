package com.example.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.user.dto.CategoryExpenseDTO;
import com.example.user.dto.MonthlyExpenseDTO;
import com.example.user.entity.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

    List<Expense> findByUserUserId(Integer userId);

    List<Expense> findByCategoryCategoryId(Integer categoryId);

    @Query("""
        SELECT COALESCE(SUM(e.amount),0)
        FROM Expense e
        WHERE e.user.userId = :userId
    """)
    Double getTotalExpense(Integer userId);
    
    @Query("""
    		SELECT new com.example.user.dto.CategoryExpenseDTO(
    		c.categoryName,
    		SUM(e.amount))
    		FROM Expense e
    		JOIN e.category c
    		WHERE e.user.userId=:userId
    		GROUP BY c.categoryName
    		""")
    		List<CategoryExpenseDTO> getExpenseByCategory(
    		        @Param("userId") Integer userId);
    
    
    @Query("""
    		SELECT new com.example.user.dto.MonthlyExpenseDTO(
    		MONTH(e.expenseDate),
    		SUM(e.amount))
    		FROM Expense e
    		WHERE e.user.userId=:userId
    		GROUP BY MONTH(e.expenseDate)
    		ORDER BY MONTH(e.expenseDate)
    		""")
    		List<MonthlyExpenseDTO> getMonthlyExpense(
    		        @Param("userId") Integer userId);

}
package com.example.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.user.entity.Budget;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Integer> {

    List<Budget> findByUserUserId(Integer userId);

    @Query("""
        SELECT COALESCE(SUM(b.budgetAmount),0)
        FROM Budget b
        WHERE b.user.userId = :userId
    """)
    Double getTotalBudget(Integer userId);

}
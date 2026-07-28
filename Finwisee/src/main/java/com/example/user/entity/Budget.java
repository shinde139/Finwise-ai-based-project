// Budget.java
package com.example.user.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_id")
    private Integer budgetId;

    private Double budgetAmount;

    private Double spentAmount;

    private LocalDate startDate;

    private LocalDate endDate;

    // Many Budget -> One User
    @ManyToOne(fetch = FetchType.EAGER)  // Add EAGER fetching
    @JoinColumn(name = "user_id")
    private User user;

    // Many Budget -> One Category
    @ManyToOne(fetch = FetchType.EAGER)  // Add EAGER fetching
    @JoinColumn(name = "category_id")
    private Category category;

    public Budget() {}

    // Getters and Setters
    public Integer getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Integer budgetId) {
        this.budgetId = budgetId;
    }

    public Double getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(Double budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public Double getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(Double spentAmount) {
        this.spentAmount = spentAmount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
package com.example.user.dto;

import com.example.user.entity.Transaction;
import java.time.LocalDate;

public class TransactionResponseDTO {
    private Integer transactionId;
    private String transactionType;
    private Double amount;
    private String description;
    private LocalDate transactionDate;
    private Integer categoryId;
    private String categoryName;
    private Integer userId;

    public TransactionResponseDTO() {}

    public static TransactionResponseDTO fromEntity(Transaction transaction) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setTransactionId(transaction.getTransactionId());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setTransactionDate(transaction.getTransactionDate());
        
        if (transaction.getCategory() != null) {
            dto.setCategoryId(transaction.getCategory().getCategoryId());
            dto.setCategoryName(transaction.getCategory().getCategoryName());
        } else {
            dto.setCategoryName("Uncategorized");
        }
        
        if (transaction.getUser() != null) {
            dto.setUserId(transaction.getUser().getUserId());
        }
        
        return dto;
    }

    // Getters and Setters
    public Integer getTransactionId() { return transactionId; }
    public void setTransactionId(Integer transactionId) { this.transactionId = transactionId; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
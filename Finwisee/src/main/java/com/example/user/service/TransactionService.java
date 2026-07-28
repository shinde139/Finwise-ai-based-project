// TransactionService.java
package com.example.user.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.user.dto.TransactionResponseDTO;
import com.example.user.entity.Category;
import com.example.user.entity.Transaction;
import com.example.user.entity.User;
import com.example.user.repository.CategoryRepository;
import com.example.user.repository.TransactionRepository;
import com.example.user.repository.UserRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Add Transaction
    public String addTransaction(Integer userId,
                                 Integer categoryId,
                                 Transaction transaction){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

        transaction.setUser(user);
        transaction.setCategory(category);

        transactionRepository.save(transaction);

        return "Transaction Added Successfully";
    }

    // Get Transactions - FIXED to return DTOs
    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getTransactions(Integer userId){
        List<Transaction> transactions = transactionRepository.findByUserUserId(userId);
        return transactions.stream()
                .map(TransactionResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Update
    public String updateTransaction(Integer id,
                                    Transaction transaction){

        Transaction old = transactionRepository.findById(id)
                .orElse(null);

        if(old == null){
            return "Transaction Not Found";
        }

        old.setTransactionType(transaction.getTransactionType());
        old.setAmount(transaction.getAmount());
        old.setDescription(transaction.getDescription());
        old.setTransactionDate(transaction.getTransactionDate());
        old.setCategory(transaction.getCategory());

        transactionRepository.save(old);

        return "Transaction Updated Successfully";
    }

    // Delete
    public String deleteTransaction(Integer id){
        transactionRepository.deleteById(id);
        return "Transaction Deleted Successfully";
    }
}
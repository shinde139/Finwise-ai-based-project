package com.example.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.user.entity.Category;
import com.example.user.entity.User;
import com.example.user.repository.CategoryRepository;
import com.example.user.repository.UserRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    // ===========================
    // Get Categories By User
    // ===========================

    public List<Category> getAllCategories(Integer userId) {

        return categoryRepository.findByUserUserId(userId);

    }

    // ===========================
    // Get Category By Id
    // ===========================

    public Category getCategory(Integer id) {

        return categoryRepository.findById(id).orElse(null);

    }

    // ===========================
    // Add Category
    // ===========================

    public String addCategory(Integer userId, Category category) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null) {

            return "User Not Found";

        }

        category.setUser(user);

        categoryRepository.save(category);

        return "Category Added Successfully";

    }

    // ===========================
    // Update Category
    // ===========================

    public String updateCategory(Integer id, Category category) {

        Category oldCategory =
                categoryRepository.findById(id).orElse(null);

        if(oldCategory == null) {

            return "Category Not Found";

        }

        oldCategory.setCategoryName(category.getCategoryName());

        categoryRepository.save(oldCategory);

        return "Category Updated Successfully";

    }

    // ===========================
    // Delete Category
    // ===========================

    public String deleteCategory(Integer id) {

        if(!categoryRepository.existsById(id)) {

            return "Category Not Found";

        }

        categoryRepository.deleteById(id);

        return "Category Deleted Successfully";

    }

}
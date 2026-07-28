package com.example.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.user.entity.Category;
import com.example.user.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // ===========================
    // Get Categories By User
    // ===========================

    @GetMapping("/user/{userId}")
    public List<Category> getAllCategories(
            @PathVariable Integer userId) {

        return categoryService.getAllCategories(userId);

    }

    // ===========================
    // Get Category By Id
    // ===========================

    @GetMapping("/{id}")
    public Category getCategory(
            @PathVariable Integer id) {

        return categoryService.getCategory(id);

    }

    // ===========================
    // Add Category
    // ===========================

    @PostMapping("/{userId}")
    public String addCategory(

            @PathVariable Integer userId,

            @RequestBody Category category) {

        return categoryService.addCategory(

                userId,

                category);

    }

    // ===========================
    // Update Category
    // ===========================

    @PutMapping("/{id}")
    public String updateCategory(

            @PathVariable Integer id,

            @RequestBody Category category) {

        return categoryService.updateCategory(

                id,

                category);

    }

    // ===========================
    // Delete Category
    // ===========================

    @DeleteMapping("/{id}")
    public String deleteCategory(

            @PathVariable Integer id) {

        return categoryService.deleteCategory(id);

    }

}
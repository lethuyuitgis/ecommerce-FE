package com.shopcuathuy.service;

import com.shopcuathuy.controller.ProductController;
import com.shopcuathuy.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ProductService {

    public ProductController.Product getProductById(String id) {
        ProductController.Product product = ProductController.products.get(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        return product;
    }

    public List<ProductController.Product> searchProducts(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return ProductController.products.values().stream()
            .filter(p -> p.name.toLowerCase().contains(lowerKeyword) ||
                        (p.description != null && p.description.toLowerCase().contains(lowerKeyword)))
            .toList();
    }

    public List<ProductController.Product> getProductsByCategory(String categoryId) {
        return ProductController.products.values().stream()
            .filter(p -> categoryId.equals(p.categoryId))
            .toList();
    }

    public List<ProductController.Product> getFeaturedProducts() {
        return ProductController.products.values().stream()
            .filter(p -> p.isFeatured != null && p.isFeatured)
            .toList();
    }

    public ProductController.Product createProduct(ProductController.Product product) {
        if (product.id == null) {
            product.id = java.util.UUID.randomUUID().toString();
        }
        ProductController.products.put(product.id, product);
        return product;
    }

    public ProductController.Product updateProduct(String id, ProductController.Product updatedProduct) {
        ProductController.Product existing = getProductById(id);
        // Update fields
        if (updatedProduct.name != null) existing.name = updatedProduct.name;
        if (updatedProduct.description != null) existing.description = updatedProduct.description;
        if (updatedProduct.price != null) existing.price = updatedProduct.price;
        if (updatedProduct.quantity != null) existing.quantity = updatedProduct.quantity;
        if (updatedProduct.status != null) existing.status = updatedProduct.status;
        return existing;
    }

    public void deleteProduct(String id) {
        ProductController.Product product = getProductById(id);
        ProductController.products.remove(id);
    }
}


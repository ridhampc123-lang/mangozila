import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

// Get all products
export const useProducts = (params = {}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const { data } = await productAPI.getAll(params);
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get single product by slug
export const useProduct = (slug) => {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const { data } = await productAPI.getBySlug(slug);
            return data;
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
};

// Create product (admin)
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (formData) => productAPI.create(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create product');
        },
    });
};

// Update product (admin)
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, formData }) => productAPI.update(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update product');
        },
    });
};

// Delete product (admin)
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => productAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete product');
        },
    });
};

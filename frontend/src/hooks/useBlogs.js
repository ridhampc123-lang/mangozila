import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogAPI } from '../services/api';
import toast from 'react-hot-toast';

// Get all blogs
export const useBlogs = (params = {}) => {
    return useQuery({
        queryKey: ['blogs', params],
        queryFn: async () => {
            const { data } = await blogAPI.getAll(params);
            return data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Get single blog by slug
export const useBlog = (slug) => {
    return useQuery({
        queryKey: ['blog', slug],
        queryFn: async () => {
            const { data } = await blogAPI.getBySlug(slug);
            return data;
        },
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
    });
};

// Create blog (admin)
export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (formData) => blogAPI.create(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            toast.success('Blog created successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create blog');
        },
    });
};

// Update blog (admin)
export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, formData }) => blogAPI.update(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            toast.success('Blog updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update blog');
        },
    });
};

// Delete blog (admin)
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => blogAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            toast.success('Blog deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete blog');
        },
    });
};

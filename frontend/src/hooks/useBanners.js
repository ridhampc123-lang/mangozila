import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

// Get hero banners
export const useHeroBanners = () => {
    return useQuery({
        queryKey: ['banners', 'hero'],
        queryFn: async () => {
            const { data } = await adminAPI.getBanners();
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

// Get all banners (admin)
export const useBanners = () => {
    return useQuery({
        queryKey: ['banners', 'all'],
        queryFn: async () => {
            const { data } = await adminAPI.getAllBanners();
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

// Create banner (admin)
export const useCreateBanner = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (formData) => adminAPI.createBanner(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            toast.success('Banner created successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create banner');
        },
    });
};

// Update banner (admin)
export const useUpdateBanner = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, formData }) => adminAPI.updateBanner(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            toast.success('Banner updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update banner');
        },
    });
};

// Delete banner (admin)
export const useDeleteBanner = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => adminAPI.deleteBanner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            toast.success('Banner deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete banner');
        },
    });
};

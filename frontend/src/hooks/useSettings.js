import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsAPI } from '../services/api';
import toast from 'react-hot-toast';

// Get site settings (public)
export const useSettings = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const { data } = await settingsAPI.get();
            return data;
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
        cacheTime: 60 * 60 * 1000, // 1 hour
    });
};

// Get full settings (admin)
export const useFullSettings = () => {
    return useQuery({
        queryKey: ['settings', 'full'],
        queryFn: async () => {
            const { data } = await settingsAPI.getFull();
            return data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

// Update settings (admin)
export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (formData) => settingsAPI.update(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            toast.success('Settings updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update settings');
        },
    });
};

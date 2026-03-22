import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offerAPI } from '../services/api';
import toast from 'react-hot-toast';

// Get active offers
export const useActiveOffers = () => {
    return useQuery({
        queryKey: ['offers', 'active'],
        queryFn: async () => {
            const { data } = await offerAPI.getActive();
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Get all offers (admin)
export const useOffers = (params = {}) => {
    return useQuery({
        queryKey: ['offers', params],
        queryFn: async () => {
            const { data } = await offerAPI.getAll(params);
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

// Get single offer by slug
export const useOffer = (slug) => {
    return useQuery({
        queryKey: ['offer', slug],
        queryFn: async () => {
            const { data } = await offerAPI.getBySlug(slug);
            return data;
        },
        enabled: !!slug,
    });
};

// Create offer (admin)
export const useCreateOffer = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (formData) => offerAPI.create(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            toast.success('Offer created successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create offer');
        },
    });
};

// Update offer (admin)
export const useUpdateOffer = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, formData }) => offerAPI.update(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            toast.success('Offer updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update offer');
        },
    });
};

// Delete offer (admin)
export const useDeleteOffer = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id) => offerAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offers'] });
            toast.success('Offer deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete offer');
        },
    });
};

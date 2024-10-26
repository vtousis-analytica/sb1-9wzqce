import { create } from 'zustand';
import type { User, Estimate, ActionItem, BodyShop } from '../types';

interface State {
  user: User | null;
  estimates: Estimate[];
  actionItems: ActionItem[];
  bodyShops: BodyShop[];
  isLoading: boolean;
  error: string | null;
}

interface Actions {
  setUser: (user: User | null) => void;
  setEstimates: (estimates: Estimate[]) => void;
  addEstimate: (estimate: Estimate) => void;
  updateEstimate: (id: string, estimate: Partial<Estimate>) => void;
  setActionItems: (actionItems: ActionItem[]) => void;
  resolveActionItem: (id: string, resolvedBy: string) => void;
  setBodyShops: (bodyShops: BodyShop[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<State & Actions>((set) => ({
  user: null,
  estimates: [],
  actionItems: [],
  bodyShops: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  setEstimates: (estimates) => set({ estimates }),
  
  addEstimate: (estimate) => 
    set((state) => ({ estimates: [...state.estimates, estimate] })),
  
  updateEstimate: (id, updatedEstimate) =>
    set((state) => ({
      estimates: state.estimates.map((estimate) =>
        estimate.id === id ? { ...estimate, ...updatedEstimate } : estimate
      ),
    })),
  
  setActionItems: (actionItems) => set({ actionItems }),
  
  resolveActionItem: (id, resolvedBy) =>
    set((state) => ({
      actionItems: state.actionItems.map((item) =>
        item.id === id
          ? { ...item, resolved: true, resolvedAt: new Date().toISOString(), resolvedBy }
          : item
      ),
    })),
  
  setBodyShops: (bodyShops) => set({ bodyShops }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));
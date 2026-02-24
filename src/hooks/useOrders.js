import { useOrderContext } from '../context/OrderContext';

export const useOrders = () => {
  const context = useOrderContext();
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
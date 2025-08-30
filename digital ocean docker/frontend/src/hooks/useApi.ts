import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiServices } from '@/lib/api-services';
import { FilterOptions, CreateUserRequest, UpdateUserRequest, CreateClientRequest, UpdateClientRequest } from '@/lib/types';

// Health hooks
export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiServices.health.getHealth(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useHealthFull = () => {
  return useQuery({
    queryKey: ['health', 'full'],
    queryFn: () => apiServices.health.getHealthFull(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Users hooks
export const useUsers = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => apiServices.users.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiServices.users.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: CreateUserRequest) => apiServices.users.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserRequest }) =>
      apiServices.users.updateUser(id, userData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiServices.users.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUnlockUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiServices.users.unlockUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiServices.users.resetUserPassword(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

// Clients hooks
export const useClients = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: () => apiServices.clients.getClients(filters),
    staleTime: 30 * 1000, // 30 seconds - clients change frequently
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => apiServices.clients.getClient(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (clientData: CreateClientRequest) => apiServices.clients.createClient(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, clientData }: { id: string; clientData: UpdateClientRequest }) =>
      apiServices.clients.updateClient(id, clientData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiServices.clients.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useDisconnectClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiServices.clients.disconnectClient(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
    },
  });
};

// Sessions hooks
export const useSessions = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => apiServices.sessions.getSessions(filters),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useSession = (id: string) => {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => apiServices.sessions.getSession(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiServices.sessions.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useRevokeUserSessions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => apiServices.sessions.revokeUserSessions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useCleanupExpiredSessions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiServices.sessions.cleanupExpiredSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useUserSessions = (userId: string, filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['sessions', 'user', userId, filters],
    queryFn: () => apiServices.sessions.getUserSessions(userId, filters),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Monitoring hooks
export const useSecurityAlerts = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['monitoring', 'alerts', filters],
    queryFn: () => apiServices.monitoring.getSecurityAlerts(filters),
    staleTime: 30 * 1000, // 30 seconds - alerts are time-sensitive
  });
};

export const useSystemLogs = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['monitoring', 'logs', filters],
    queryFn: () => apiServices.monitoring.getSystemLogs(filters),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['monitoring', 'metrics'],
    queryFn: () => apiServices.monitoring.getSystemMetrics(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['monitoring', 'dashboard'],
    queryFn: () => apiServices.monitoring.getDashboardStats(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alertId: string) => apiServices.monitoring.resolveAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoring', 'alerts'] });
    },
  });
};

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { PaginatedResponse, ScanResult } from '@/types/api';

async function fetchScans(page: number): Promise<ScanResult[]> {
  const { data } = await apiClient.get<PaginatedResponse<ScanResult> | ScanResult[]>('/scans/', {
    params: { page },
  });

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export function useScans(page = 1) {
  return useQuery({
    queryKey: ['scans', page],
    queryFn: () => fetchScans(page),
    refetchInterval: 8000,
  });
}

export function useScanStats(scans: ScanResult[] | undefined) {
  const list = scans ?? [];

  return {
    total: list.length,
    completed: list.filter((s) => s.status === 'completed').length,
    running: list.filter((s) => s.status === 'running' || s.status === 'pending').length,
    failed: list.filter((s) => s.status === 'failed').length,
    recent: list.slice(0, 6),
  };
}

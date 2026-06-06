/**
 * useAutoRefresh — Zentrale Datenaktualisierung für Portal-Seiten.
 *
 * Nutzt @tanstack/react-query mit Portal-Defaults:
 * - refetchOnWindowFocus: true
 * - refetchOnReconnect: true
 * - staleTime: 30s (global) / überschreibbar
 * - pollingInterval (optional) für Live-Daten
 *
 * usePortalMutation — Mutation mit automatischer Invalidierung.
 *
 * Beispiel:
 *   const { data, isLoading } = useAutoRefresh(['commissions'], () => apiClient.get('/api/commissions'));
 *   const { mutate } = usePortalMutation({ mutationFn: ..., invalidateKeys: ['commissions', 'wallet'] });
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * useAutoRefresh — Daten abrufen mit Auto-Refresh
 * @param {Array} queryKey — Eindeutiger Query-Key (z. B. ['commissions', 'pending'])
 * @param {Function} queryFn — Async-Funktion zum Datenabruf
 * @param {Object} options — Zusätzliche Optionen:
 *   - staleTime (ms): Überschreibt globales staleTime
 *   - refetchInterval (ms): Polling-Intervall (z. B. 30_000 für 30s)
 *   - enabled: Query aktivieren/deaktivieren
 *   - select: Daten transformieren
 * @returns {Object} — { data, isLoading, isError, error, refetch }
 */
export function useAutoRefresh(queryKey, queryFn, options = {}) {
  const { staleTime, refetchInterval, enabled, select } = options;

  return useQuery({
    queryKey,
    queryFn,
    staleTime: staleTime ?? undefined,
    refetchInterval: refetchInterval ?? false,
    enabled: enabled !== false,
    select,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

/**
 * usePortalMutation — Mutation mit automatischer Portal-Invalidierung.
 *
 * Invalidiert automatisch alle angegebenen Query-Keys nach Erfolg.
 *
 * @param {Object} options
 *   - mutationFn: Async-Funktion
 *   - invalidateKeys: Query-Keys die nach Erfolg invalidiert werden sollen
 *   - onSuccess: Zusätzlicher Callback
 *   - onError: Fehler-Callback
 * @returns {Object} — { mutate, mutateAsync, isLoading, isError, error }
 */
export function usePortalMutation({ mutationFn, invalidateKeys = [], onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (data) => {
      // Invalidiere alle betroffenen Query-Keys
      const invalidationPromises = invalidateKeys.map(key =>
        queryClient.invalidateQueries({ queryKey: key })
      );
      await Promise.all(invalidationPromises);
      if (onSuccess) onSuccess(data);
    },
    onError: (err) => {
      if (onError) onError(err);
    },
  });
}

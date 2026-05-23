import { invokeEdgeFunction } from './edgeFunctions';

export async function logAppError(input: {
  source: string;
  action: string;
  message: string;
  metadata?: Record<string, unknown>;
  severity?: 'info' | 'warning' | 'error';
}) {
  try {
    await invokeEdgeFunction('log-app-error', input, {
      requireAuth: false,
    });
  } catch {
    // Logging must never break user workflows.
  }
}

export function getLogMessage(err: unknown, fallback = 'Unknown error') {
  if (err instanceof Error && err.message.trim()) return err.message;
  if (typeof err === 'string' && err.trim()) return err;
  return fallback;
}

export function reportClientError(
  action: string,
  err: unknown,
  metadata?: Record<string, unknown>,
  severity: 'info' | 'warning' | 'error' = 'error',
) {
  logAppError({
    source: 'client',
    action,
    message: getLogMessage(err),
    metadata,
    severity,
  });
}

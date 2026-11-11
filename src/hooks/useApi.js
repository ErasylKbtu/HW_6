import { useEffect, useState } from 'react';
import { invalidateCache } from '../services/cache.js';

// key is a JSON string, so equal parameters do not restart the request.
export default function useApi(request, key = '{}', revision = 0) {
  const [retry, setRetry] = useState(0);
  const identity = `${key}:${revision}:${retry}`;
  const [result, setResult] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setResult({ status: 'loading', data: null, identity });
    request(JSON.parse(key), { signal: controller.signal })
      .then((data) => {
        if (active) setResult({ status: 'success', data, identity });
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError') {
          setResult({ status: 'error', data: null, error, identity });
        }
      });
    return () => { active = false; controller.abort(); };
  }, [request, key, identity]);

  // Hide an old response immediately when the route or parameters change.
  return { ...(result.identity === identity ? result : { status: 'loading', data: null }),
    retry: () => {
      invalidateCache(['assignments']);
      setRetry((value) => value + 1);
    } };
}

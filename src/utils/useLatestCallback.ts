// src/utils/useLatestCallback.ts
import { useCallback, useRef } from 'react';

function useLatestCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  
  // Actualizar la referencia cuando cambia el callback
  callbackRef.current = callback;
  
  // Devolver una función estable que llama a la última versión del callback
  return useCallback(
    ((...args) => {
      return callbackRef.current(...args);
    }) as T,
    []
  );
}

export default useLatestCallback;
// components/AuthProvider.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setInitialized, setLoading } from '../../store/authSlice';
import type { RootState } from '../../store';
import api from '../../api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      if (isInitialized) return; // Prevent duplicate calls

      dispatch(setLoading(true));
      try {
        // This will use the JWT cookie to verify auth
        const response = await api.get('/auth/me', {
          headers: {
            'X-Internal-Check': 'true',
          },
        });
        dispatch(setUser(response.data.user));
      } catch (error) {
        // No valid token/user, set to null
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
        dispatch(setInitialized());
      }
    };

    checkAuth();
  }, [dispatch, isInitialized]);

  return <>{children}</>;
}
'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

export default function UserDebugger() {
  const supabase = createClient();

  useEffect(() => {
    async function logUser() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('❌ Failed to fetch user:', error.message);
      } else if (user) {
        console.log('✅ Logged in as:', user.email);
        console.log('🆔 Session user ID:', user.id);
      } else {
        console.log('❌ No user logged in');
      }
    }

    logUser();
  }, []);

  return null;
}

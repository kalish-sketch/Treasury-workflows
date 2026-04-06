import { Suspense } from 'react';
import TreasuryApp from '@/components/TreasuryApp';

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</div>}>
      <TreasuryApp />
    </Suspense>
  );
}

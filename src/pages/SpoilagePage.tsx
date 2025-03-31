
import { useState } from 'react';
import Layout from '@/components/Layout';
import SpoilageDetection from '@/components/SpoilageDetection';

const SpoilagePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleRefreshInventory = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-spice-800">Spoilage Detection</h1>
        <p className="text-muted-foreground">Monitor ingredient freshness and manage expiring items</p>
        <SpoilageDetection 
          refreshTrigger={refreshTrigger}
          onUpdate={handleRefreshInventory}
        />
      </div>
    </Layout>
  );
};

export default SpoilagePage;


import Layout from '@/components/Layout';
import Inventory from '@/components/Inventory';

const InventoryPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-spice-800">Inventory Management</h1>
        <p className="text-muted-foreground">Manage your ingredient inventory</p>
        <Inventory refreshTrigger={0} />
      </div>
    </Layout>
  );
};

export default InventoryPage;

import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { usePartListStore } from '@/stores/partListStore';
import BuilderToolbar from '@/components/builder/BuilderToolbar';
import CompatibilityBar from '@/components/builder/CompatibilityBar';
import PartTable from '@/components/builder/PartTable';

export default function BuilderPage() {
  const listId = usePartListStore((s) => s.listId);
  const issues = usePartListStore((s) => s.compatibilityIssues);
  const wattage = usePartListStore((s) => s.estimatedWattage);

  return (
    <Layout>
      <Helmet>
        <title>Yapilandirici - PCParcaSecici</title>
      </Helmet>
      <div className="py-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Parcalarini Sec</h1>
        <BuilderToolbar listId={listId} />
        <CompatibilityBar issues={issues} estimatedWattage={wattage} />
        <PartTable />
      </div>
    </Layout>
  );
}

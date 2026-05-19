import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { MetricsData } from './common/metrics-data/lib';

const statusMap = {
  pending: {
    text: '#92400e',
    background: '#fef3c7',
    border: '#f59e0b',
  },
  completed: {
    text: '#065f46',
    background: '#d1fae5',
    border: '#10b981',
  },
  inprogress: {
    text: '#1e40af',
    background: '#dbeafe',
    border: '#3b82f6',
  },
  failed: {
    text: '#b91c1c',
    background: '#fee2e2',
    border: '#ef4444',
  },
};

const theme = {
  primary: '#2a6adf',
  background: '#ffffff',
  surface: '#ffffff',
  text: '#111827',
  textMuted: '#6b7280',
  border: '#d1d5db',
  cardBg: '#ffffff',
  headerBg: '#ffffff',
  gridBg: '#f3f4f6',
  pipelineBg: '#eef2ff',
  shadow: '0 10px 30px rgba(0,0,0,0.08)',
  cardRadius: '14px',
};

function App() {
  const [metricsData, setMetricsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await fetch('https://dummyjson.com/products?limit=100');

        if (!response.ok) {
          throw new Error('Failed to fetch metrics data');
        }

        const result = await response.json();

        const normalizedData = result.products.map((item) => {
          const progress = Math.min(Math.round(item.rating * 20), 100);

          let status = 'pending';

          if (item.stock <= 10) {
            status = 'failed';
          } else if (item.rating >= 4.6) {
            status = 'completed';
          } else if (item.rating >= 4) {
            status = 'inprogress';
          }

          return {
            id: item.id,
            mediaTile: item.thumbnail,
            name: item.title,
            source: item.brand || item.category,
            status,
            progress,
            date: item.meta?.createdAt
              ? item.meta.createdAt.slice(0, 10)
              : '2026-05-18',
            priority: item.stock <= 10 ? 'High' : item.stock <= 30 ? 'Medium' : 'Low',
            category: item.category,
            amount: item.price,
            claims: item.stock,
            description: item.description,
          };
        });

        setMetricsData(normalizedData);
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMetricsData();
  }, []);

  const footerComponent = useMemo(() => {
    if (loading) return <div className="metrics-tag">Loading data...</div>;
    if (errorMessage) return <div className="metrics-tag">Error: {errorMessage}</div>;

    return <div className="metrics-tag">Total Records: {metricsData.length}</div>;
  }, [loading, errorMessage, metricsData.length]);

  return (
    <MetricsData
      mediaDetailsKeys={['name', 'date']}
      title="Metrics Data Component"
      icon="bi bi-bar-chart"
      theme={theme}
      statusMap={statusMap}
      progressBy="completed"
      headerButtons={[
        {
          label: 'Add New',
          icon: 'bi bi-plus-lg',
          tooltip: 'Add new item',
          action: () => alert('Add new item'),
        },
      ]}
      data={metricsData}
      filterBy="status"
      filterStyle={['tabs', 'keyword', 'dropdown', 'date']}
      showViewTypes={[
        {
          view: 'table',
          icon: 'bi bi-table',
          tooltip: 'Table view',
        },
        {
          view: 'grid',
          icon: 'bi bi-card-list',
          tooltip: 'Card view',
        },
        {
          view: 'pipeline',
          icon: 'bi bi-kanban',
          tooltip: 'Pipeline view',
        },
      ]}
      showKpis={[
        { icon: 'bi bi-check-circle', card: 'completed' },
        { icon: 'bi bi-hourglass-split', card: 'pending' },
        { icon: 'bi bi-arrow-repeat', card: 'inprogress' },
        { icon: 'bi bi-x-circle', card: 'failed' },
      ]}
      paginated
      showFooter
      footerComponent={footerComponent}
      pageSize={5}
      customFilter={{
        title: 'Custom Filter',
        button: {
          icon: 'bi bi-gear',
          tooltip: 'Open Custom Filter',
        },
        fields: [
          {
            key: 'status',
            label: 'Status',
            type: 'checkbox',
          },
          {
            key: 'source',
            label: 'Source',
            type: 'radio',
          },
          {
            key: 'priority',
            label: 'Priority',
            type: 'select',
            options: ['High', 'Medium', 'Low'],
          },
          {
            key: 'date',
            label: 'Date',
            type: 'date',
          },
        ],
        onApply: (filters) => console.log('Custom filter applied', filters),
        onReset: (filters) => console.log('Custom filter reset', filters),
      }}
      actionButtons={[
        {
          label: 'View',
          tooltip: 'View detail',
          action: row => alert(`View item: ${row.name}`),
        },
        {
          label: 'More',
          tooltip: 'More actions',
          isDropdown: true,
          options: ['Edit', 'Delete'],
          dropdownAction: (option, row) => alert(`${option} ${row.name}`),
        },
      ]}
    />
  );
}

export default App;
import './App.css';
import { MetricsData } from './common/metrics-data/src';

const statusMap = {
  completed: 'success',
  inprogress: 'info',
  pending: 'warning',
};

const dummyData = [
  {
    mediaTile: 'https://picsum.photos/80?random=1',
    name: 'Marketing Rebase',
    source: 'Campaign Team',
    status: 'completed',
    progress: 92,
    date: '2026-04-12',
    description: 'Monthly campaign pipeline review.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=2',
    name: 'Sales Optimization',
    source: 'Sales Team',
    status: 'inprogress',
    progress: 65,
    date: '2026-04-10',
    description: 'Improving sales funnel performance.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=3',
    name: 'UI Redesign',
    source: 'Design Team',
    status: 'pending',
    progress: 30,
    date: '2026-04-08',
    description: 'Revamping dashboard interface.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=4',
    name: 'Backend Migration',
    source: 'DevOps',
    status: 'inprogress',
    progress: 55,
    date: '2026-04-15',
    description: 'Migrating services to new server.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=5',
    name: 'SEO Audit',
    source: 'Marketing',
    status: 'completed',
    progress: 100,
    date: '2026-04-05',
    description: 'Website SEO performance review.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=6',
    name: 'Client Onboarding',
    source: 'Support Team',
    status: 'pending',
    progress: 20,
    date: '2026-04-18',
    description: 'New client onboarding process.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=7',
    name: 'Mobile App Testing',
    source: 'QA Team',
    status: 'inprogress',
    progress: 75,
    date: '2026-04-11',
    description: 'Testing mobile app features.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=8',
    name: 'Content Strategy',
    source: 'Content Team',
    status: 'completed',
    progress: 88,
    date: '2026-04-07',
    description: 'Planning blog and social content.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=9',
    name: 'Security Audit',
    source: 'IT Team',
    status: 'inprogress',
    progress: 60,
    date: '2026-04-20',
    description: 'System security checks.',
  },
  {
    mediaTile: 'https://picsum.photos/80?random=10',
    name: 'Email Campaign',
    source: 'Marketing',
    status: 'completed',
    progress: 95,
    date: '2026-04-03',
    description: 'Launching email marketing campaign.',
  },
  
];

function App() {
  return (
    <>
      <MetricsData
        title="Metrics Data Component"
        icon="bi bi-bar-chart"
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
        data={dummyData}
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
        paginated
        showFooter
        pageSize={5}
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
    </>
  );
}

export default App;
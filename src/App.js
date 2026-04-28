import './App.css';
import { MetricsData } from './common/metrics-data/src';

const dummyData = [
  {
   
    mediaTile: 'https://via.placeholder.com/80',
    name: 'Marketing Rebase',
    source: 'Campaign Team',
    status: 'completed',
    progress: 92,
    date: '2026-04-12',
    description: 'Monthly campaign pipeline review.',
    
  },


];

function App() {
  return (
    <div className="App" style={{ padding: 24, background: '#f4f6f8', minHeight: '100vh' }}>
      <MetricsData
        title="Metrics React"
        sub="metrics-data"
        progressBy="completed"
        data={dummyData}
        filterBy="status"
        filterStyle={['tabs', 'keyword', 'dropdown', 'date']}
        showViewTypes
        paginated
        showFooter
        pageSize={2}
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
    </div>
  );
}

export default App;

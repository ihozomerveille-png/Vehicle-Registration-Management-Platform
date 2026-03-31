import { useQuery } from '@tanstack/react-query';
import { fetchVehicles } from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 2
  });

  if (isLoading) return <div className="card">Loading vehicles...</div>;
  if (error) return <div className="card">Unable to load vehicles</div>;

  return (
    <div className="card">
      <h1>Public Vehicles List</h1>
      <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead style={{ background: '#e2e8f0' }}>
          <tr>
            <th>ID</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.manufacture}</td>
              <td>{item.model}</td>
              <td>{item.year}</td>
              <td>{item.vehicleStatus}</td>
              <td><Link to={`/vehicle/${item.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;

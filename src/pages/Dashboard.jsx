import { useQuery } from '@tanstack/react-query';
import { fetchVehicles } from '../services/api';

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles
  });

  return (
    <div className="card">
      <h1>Dashboard</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Could not load summary.</p>}
      {data && (
        <>
          <p>Total registered vehicles: {data.length}</p>
          <p>New vehicles: {data.filter((v) => v.vehicleStatus === 'NEW').length}</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;

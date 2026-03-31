import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVehicleSegment, deleteVehicle } from '../services/api';
import { useState } from 'react';

const segments = ['info', 'owner', 'registration', 'insurance'];

const VehicleDetails = () => {
  const { id } = useParams();
  const [active, setActive] = useState('info');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicle', id, active],
    queryFn: () => fetchVehicleSegment(id, active),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });

  const handleDelete = () => {
    if (window.confirm('Delete this vehicle?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) return <div className="card">Loading {active}...</div>;
  if (error) return <div className="card">Error loading vehicle</div>;

  return (
    <div className="card">
      <h1>Vehicle {id} Details</h1>
      <div style={{ marginBottom: '1rem' }}>
        {segments.map((seg) => (
          <button key={seg} style={{ marginRight: '0.5rem', opacity: seg === active ? 1 : 0.6 }} onClick={() => setActive(seg)}>
            {seg}
          </button>
        ))}
      </div>

      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleDelete} style={{ background: '#dc2626' }}>Delete Vehicle</button>
        <Link to="/dashboard" style={{ marginLeft: '1rem' }}>Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default VehicleDetails;

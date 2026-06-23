import { Navigate, useParams, useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useTenantData } from '@/contexts/TenantDataContext';

/** Resolve /dogs/:dogId to the nested household dog edit route. */
export default function DogRedirectPage() {
  const { dogId } = useParams();
  const location = useLocation();
  const { data } = useTenantData();
  const dog = data.dogs.find((entry) => String(entry.id) === dogId);

  if (!dog) {
    return <Alert variant="warning">Dog not found.</Alert>;
  }

  return (
    <Navigate
      to={`/households/${dog.ownerId}/dogs/${dog.id}`}
      replace
      state={location.state}
    />
  );
}

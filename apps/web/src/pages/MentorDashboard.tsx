import { useNavigate } from 'react-router-dom';
import { MentorDashboardView } from '../components/university/MentorDashboardView.js';

export default function MentorDashboard() {
  const navigate = useNavigate();

  return (
    <MentorDashboardView
      onReturnToUniversity={() => navigate('/university')}
      onSwitchToStudent={() => navigate('/student')}
    />
  );
}

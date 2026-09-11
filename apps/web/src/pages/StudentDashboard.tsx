import { useNavigate } from 'react-router-dom';
import { StudentDashboardView } from '../components/student/StudentDashboardView.js';

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <StudentDashboardView
      onReturnToUniversity={() => navigate('/university')}
      onSwitchToMentor={() => navigate('/university/mentor')}
    />
  );
}

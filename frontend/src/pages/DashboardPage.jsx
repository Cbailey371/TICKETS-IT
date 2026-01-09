import { useAuth } from '../context/AuthContext';
import ClientDashboard from '../components/ClientDashboard';
import AgentDashboard from '../components/AgentDashboard';
import SuperadminDashboard from '../components/SuperadminDashboard';

const DashboardPage = () => {
    const { user } = useAuth();

    if (!user) return null;

    if (user.role === 'client') {
        return <ClientDashboard />;
    }

    if (user.role === 'agent') {
        return <AgentDashboard />;
    }

    // Superadmin and Company Admin see metrics view
    return <SuperadminDashboard />;
};

export default DashboardPage;

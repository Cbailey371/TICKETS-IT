import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Activity, Users, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardCard from './DashboardCard';
import { Link } from 'react-router-dom';

const SuperadminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            const userInfo = localStorage.getItem('userInfo');
            const token = userInfo ? JSON.parse(userInfo).token : null;

            try {
                const res = await fetch('http://localhost:3000/api/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const jsonData = await res.json();
                setData(jsonData);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="text-white p-8 animate-pulse">Cargando métricas globales...</div>;
    if (!data) return <div className="text-red-500 p-8">Error cargando datos</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 ml-auto">
                    <Link to="/companies" className="px-4 py-2 bg-surface hover:bg-background border border-border-color text-text-main rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Empresas
                    </Link>
                    <Link to="/users" className="px-4 py-2 bg-surface hover:bg-background border border-border-color text-text-main rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Usuarios
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Incidentes Activos" value={data.metrics.open} icon={AlertCircle} color="bg-blue-500" trend="+12%" delay={0} />
                <DashboardCard title="Resueltos" value={data.metrics.resolved} icon={CheckCircle} color="bg-emerald-500" trend="+5%" delay={0.1} />
                <DashboardCard title="Tiempo Promedio" value={data.metrics.avgResolutionTime || '2h 15m'} icon={Clock} color="bg-orange-500" trend="-2%" delay={0.2} />
                <DashboardCard title="SLA Cumplimiento" value="98%" icon={Activity} color="bg-purple-500" delay={0.3} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="bg-surface border border-border-color rounded-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-border-color flex justify-between items-center bg-background/50">
                    <h2 className="text-lg font-bold text-text-main">Actividad Reciente Global</h2>
                    <Link to="/incidents" className="text-sm text-primary hover:text-primary/80">Ver todo</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-text-muted">
                        <thead className="bg-background/50 uppercase text-xs tracking-wider text-text-muted">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Empresa</th>
                                <th className="px-6 py-4">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color">
                            {data.recentIncidents.map((incident) => (
                                <motion.tr
                                    key={incident.id}
                                    variants={itemVariants}
                                    className="hover:bg-background/30 transition-colors"
                                >
                                    <td className="px-6 py-4 font-mono">#{incident.ticket_code || incident.id}</td>
                                    <td className="px-6 py-4 font-medium text-text-main">{incident.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${incident.status === 'open' ? 'bg-primary/10 text-primary border-primary/20' :
                                            incident.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-surface border-border-color text-text-muted'
                                            }`}>
                                            {incident.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{incident.company?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{new Date(incident.createdAt).toLocaleDateString()}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default SuperadminDashboard;

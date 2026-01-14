import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard';
            case '/companies': return 'Gestión de Empresas';
            case '/users': return 'Gestión de Usuarios';
            case '/incidents': return 'Lista de Incidentes';
            case '/history': return 'Historial de Tickets';
            case '/settings': return 'Configuración';
            default: return 'Tickes SaaS'; // Fallback title
        }
    };

    return (
        <div className="flex bg-background h-screen font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={getTitle()} />
                <main className="flex-1 overflow-auto p-8 bg-black/20">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

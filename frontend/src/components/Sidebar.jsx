import { LayoutDashboard, Ticket, Settings, BarChart3, Building2, Users, LogOut, History, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    const allNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['superadmin', 'company_admin', 'agent', 'client'] },
        { icon: Building2, label: 'Empresas', path: '/companies', roles: ['superadmin'] },
        { icon: Users, label: 'Usuarios', path: '/users', roles: ['company_admin', 'superadmin'] },
        { icon: Ticket, label: 'Incidentes', path: '/incidents', roles: ['superadmin', 'company_admin', 'agent', 'client'] },
        { icon: History, label: 'Historial', path: '/history', roles: ['superadmin', 'company_admin', 'agent', 'client'] },
        { icon: Settings, label: 'Configuración', path: '/settings', roles: ['superadmin', 'company_admin'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <div className={twMerge(
                "fixed md:static inset-y-0 left-0 w-64 h-full bg-surface border-r border-border-color flex flex-col p-4 text-text-muted z-[60] transition-transform duration-300 transform",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="flex items-center justify-between px-4 py-6 mb-4">
                    <img src="/logo.jpg" alt="CBTECH" className="h-12 object-contain" />
                    <button
                        onClick={onClose}
                        className="p-2 md:hidden text-text-muted hover:text-text-main transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => { if (window.innerWidth < 768) onClose(); }}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                    : 'hover:bg-background/50 hover:text-text-main'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto px-4 py-4 border-t border-border-color">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-background border border-border-color flex items-center justify-center text-sm font-bold text-text-muted">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-text-main leading-tight">{user?.name || 'Usuario'}</span>
                                <span className="text-xs text-text-muted capitalize">{user?.role?.replace('_', ' ') || 'Invitado'}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-text-muted"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

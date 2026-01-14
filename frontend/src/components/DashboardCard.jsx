import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const DashboardCard = ({ title, subtitle, value, icon: Icon, color, trend, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className="bg-surface border border-border-color p-6 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
        >
            {/* Decorative Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-text-main/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110`} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-text-muted font-medium text-sm mb-1">{title}</p>
                    {subtitle && <p className="text-[10px] text-text-muted/60 mb-1 leading-tight">{subtitle}</p>}
                    <h3 className="text-3xl font-bold text-text-main tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-opacity-10 flex items-center justify-center ${color.replace('bg-', 'text-')} ${color.replace('bg-', 'bg-')}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
                    <Activity className="w-4 h-4" />
                    <span className="font-semibold">{trend}</span>
                    <span className="text-text-muted ml-1">vs mes anterior</span>
                </div>
            )}
        </motion.div>
    );
};

export default DashboardCard;

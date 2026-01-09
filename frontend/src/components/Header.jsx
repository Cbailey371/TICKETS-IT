import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <header className="h-20 border-b border-border-color bg-surface/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-200">
            <h1 className="text-2xl font-bold text-text-main">{title}</h1>

            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="bg-background border border-border-color text-text-main text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent block w-64 pl-10 p-2.5 transition-all placeholder-text-muted/70"
                        placeholder="Buscar tickets..."
                    />
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-background"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button className="relative p-2 text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-background">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-background"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;

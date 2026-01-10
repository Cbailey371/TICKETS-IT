import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const Combobox = ({ options, value, onChange, placeholder = "Seleccionar...", label, required, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={wrapperRef}>
            {label && (
                <label className="text-sm font-medium text-text-muted mb-1 block">
                    {label}
                </label>
            )}
            <div
                className={`w-full bg-background border rounded-lg px-4 py-2 text-text-main flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isOpen ? 'border-primary ring-2 ring-primary' : 'border-border-color'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={selectedOption ? 'text-text-main' : 'text-text-muted'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-surface border border-border-color rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-border-color bg-background/50 sticky top-0">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                className="w-full bg-background border border-border-color rounded px-8 py-1.5 text-sm text-text-main focus:outline-none focus:border-primary placeholder-text-muted/70"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={`px-4 py-2 text-sm cursor-pointer transition-colors ${opt.value === value ? 'bg-primary/10 text-primary font-medium' : 'text-text-main hover:bg-background/80'}`}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-text-muted text-center italic">
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Hidden input for form requirement handling if needed (mostly for validation messages, though custom components handle validation differently) */}
            {required && !value && <input tabIndex={-1} className="absolute opacity-0 h-0 w-0" required={required} />}
        </div>
    );
};

export default Combobox;

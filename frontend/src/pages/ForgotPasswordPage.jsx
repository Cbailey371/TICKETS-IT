import { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Se ha enviado un correo con las instrucciones.');
            } else {
                setError(data.error || 'Error al procesar la solicitud');
            }
        } catch (err) {
            setError('Error de conexión');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface border border-border-color rounded-2xl p-8 shadow-2xl relative">
                <Link to="/login" className="absolute top-8 left-8 text-text-muted hover:text-text-main transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-main mb-2">Recuperar Contraseña</h1>
                    <p className="text-text-muted text-sm">Ingresa tu email para recibir un enlace de restablecimiento</p>
                </div>

                {message && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg mb-6 text-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Email Corporativo</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-text-muted" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border border-border-color rounded-lg pl-10 pr-4 py-2.5 text-text-main focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-text-muted/70"
                                placeholder="usuario@empresa.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Enlace'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

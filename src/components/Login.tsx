import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Lock, AlertCircle } from 'lucide-react';
import { login } from '../services/api';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function Login({ onClose, onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(password);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-marine-ink/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md glass-blue rounded-[2.5rem] border border-white/20 shadow-2xl p-8"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 glass rounded-full hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-marine-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-marine-cyan/30">
            <Lock className="text-marine-cyan" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Accès Restreint</h2>
          <p className="text-white/50 text-sm mt-2">Veuillez saisir le mot de passe administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-marine-cyan outline-none transition-all text-center text-lg tracking-[0.5em]"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm justify-center"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-marine-blue hover:bg-marine-cyan text-white rounded-2xl font-bold transition-all shadow-lg shadow-marine-blue/20 disabled:opacity-50"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

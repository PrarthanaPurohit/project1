import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../services/authService';
import type { Route } from './+types/login';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Admin Login - Showcase Platform' },
    { name: 'description', content: 'Admin login page' },
  ];
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login({ username, password });
      // Redirect to admin panel after successful login
      navigate('/admin');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Invalid credentials. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        input:focus {
          border-color: #667eea !important;
          background-color: white !important;
        }
        
        button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
        }
      `}</style>
      
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🔐</div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Sign in to manage your showcase platform</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>
              Username or Email
            </label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
                disabled={isLoading}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                disabled={isLoading}
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div style={styles.error}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
          >
            {isLoading ? '🔄 Logging in...' : '🚀 Sign In'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p>Secure admin access • Showcase Platform</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    position: 'relative' as const,
  },
  card: {
    backgroundColor: 'white',
    padding: '50px 40px',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '440px',
    position: 'relative' as const,
    animation: 'slideUp 0.5s ease-out',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  icon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: 'white',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginTop: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    position: 'relative' as const,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '4px',
  },
  inputWrapper: {
    position: 'relative' as const,
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    color: '#95a5a6',
  },
  input: {
    padding: '14px 14px 14px 45px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.3s',
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  error: {
    padding: '14px 16px',
    backgroundColor: '#fee',
    color: '#c0392b',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid #fcc',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  errorIcon: {
    fontSize: '18px',
  },
  button: {
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    marginTop: '8px',
  },
  buttonDisabled: {
    background: '#95a5a6',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center' as const,
    fontSize: '13px',
    color: '#7f8c8d',
  },
};

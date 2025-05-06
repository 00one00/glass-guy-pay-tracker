import React, { useState } from 'react';
import { loginUser, registerUser, resetPassword } from '../firebase/auth';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isResetting) {
        // Handle password reset
        const result = await resetPassword(email);
        if (result.success) {
          setSuccess('Password reset email sent. Check your inbox.');
        } else {
          setError(result.error);
        }
      } else if (isRegistering) {
        // Handle registration
        if (!displayName.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }

        const result = await registerUser(email, password, displayName);
        if (result.success) {
          setSuccess('Account created successfully! You can now log in.');
          setIsRegistering(false);
        } else {
          setError(result.error);
        }
      } else {
        // Handle login
        const result = await loginUser(email, password);
        if (!result.success) {
          setError(result.error);
        }
        // Login is handled by the auth listener in the context
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setError('');
    setSuccess('');
    setIsRegistering(!isRegistering);
    setIsResetting(false);
  };

  const toggleReset = () => {
    setError('');
    setSuccess('');
    setIsResetting(!isResetting);
    setIsRegistering(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>
          {isResetting ? 'Reset Password' : isRegistering ? 'Create Account' : 'Login'}
        </h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="displayName">Full Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={isRegistering}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {!isResetting && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isResetting}
              />
            </div>
          )}
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading
              ? 'Processing...'
              : isResetting
              ? 'Send Reset Link'
              : isRegistering
              ? 'Register'
              : 'Log In'}
          </button>
        </form>
        
        <div className="login-options">
          {!isResetting && (
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleMode}
            >
              {isRegistering
                ? 'Already have an account? Log in'
                : 'New user? Create account'}
            </button>
          )}
          
          {!isRegistering && (
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleReset}
            >
              {isResetting
                ? 'Back to login'
                : 'Forgot password?'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 
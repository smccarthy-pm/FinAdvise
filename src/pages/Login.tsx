import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { SocialLogin } from '../components/auth/SocialLogin';
import { AuthDivider } from '../components/auth/AuthDivider';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      // Implement actual login logic here
      console.log('Logging in with:', email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    try {
      // Implement social login logic here
      console.log('Logging in with:', provider);
      navigate('/');
    } catch (err) {
      setError(`Failed to login with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <SocialLogin onLogin={handleSocialLogin} />
        
        <AuthDivider />
        
        <LoginForm onSubmit={handleEmailLogin} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
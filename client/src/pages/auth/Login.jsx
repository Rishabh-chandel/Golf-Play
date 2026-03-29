import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { loginUser } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'subscriber' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
     const resultAction = await dispatch(loginUser({ email: formData.email, password: formData.password, role: formData.role }));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Welcome back!');
      const userRole = resultAction.payload.user.role;
      if (userRole === 'admin') {
         navigate('/admin');
      } else {
         navigate('/dashboard');
      }
    } else {
      toast.error(resultAction.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-text-primary flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-display font-bold mb-2 text-center">Welcome Back</h2>
            <p className="text-text-secondary text-center mb-8">Sign in to update scores and view draws</p>
            
            {/* Role Selection Tabs */}
            <div className="flex p-1 mb-6 bg-surface-2 rounded-lg">
              <button 
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.role === 'subscriber' ? 'bg-emerald text-obsidian shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setFormData({...formData, role: 'subscriber'})}
              >
                Player
              </button>
              <button 
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.role === 'admin' ? 'bg-emerald text-obsidian shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setFormData({...formData, role: 'admin'})}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input 
                  type="email" 
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-emerald transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                   <label className="block text-sm font-medium text-text-secondary">Password</label>
                   <Link to="/forgot-password" className="text-xs text-emerald hover:underline">Forgot password?</Link>
                </div>
                <input 
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-emerald transition-colors"
                  placeholder="••••••••"
                />
              </div>
              
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <p className="text-center text-sm text-text-secondary mt-8">
              Don't have an account? <Link to="/register" className="text-emerald hover:underline font-medium">Create one</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app this endpoint should be created in the auth route
      // await api.post('/auth/forgot-password', { email });
      toast.success('If an account exists, a reset link will be sent.');
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
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
            <h2 className="text-3xl font-display font-bold mb-2 text-center">Reset Password</h2>
            <p className="text-text-secondary text-center mb-8">Enter your email to receive recovery instructions.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-emerald transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
            
            <p className="text-center text-sm text-text-secondary mt-8">
              Remember your password? <Link to="/login" className="text-emerald hover:underline font-medium">Log in</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;

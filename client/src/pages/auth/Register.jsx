import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { registerUser } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    role: z.enum(['subscriber', 'admin']),
    handicap: z
      .union([z.string(), z.number()])
      .optional()
      .transform((value) => (value === '' || value === undefined ? '' : String(value))),
    referralCode: z.string().optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading } = useSelector((state) => state.auth);
  const referralCode = searchParams.get('referralCode') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'subscriber',
      handicap: '',
      referralCode,
    },
  });

  useEffect(() => {
    if (referralCode) {
      setValue('referralCode', referralCode);
    }
  }, [referralCode, setValue]);

  const onSubmit = async (formData) => {
    const resultAction = await dispatch(registerUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      handicap: formData.handicap ? Number(formData.handicap) : undefined,
      referralCode: formData.referralCode || undefined,
    }));

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Registration successful!');
      navigate(formData.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(resultAction.payload || 'Registration failed');
    }
  };

  const inputClassName = 'w-full bg-surface-2 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-emerald transition-colors';

  return (
    <div className="min-h-screen bg-obsidian text-text-primary flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg mt-8"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-display font-bold mb-2 text-center">Join the Club</h2>
            <p className="text-text-secondary text-center mb-8">Create your account to start contributing & winning.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
                  <input {...register('firstName')} className={inputClassName} placeholder="John" />
                  {errors.firstName && <p className="mt-1 text-xs text-coral">{errors.firstName.message}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
                  <input {...register('lastName')} className={inputClassName} placeholder="Doe" />
                  {errors.lastName && <p className="mt-1 text-xs text-coral">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input type="email" {...register('email')} className={inputClassName} placeholder="you@example.com" />
                {errors.email && <p className="mt-1 text-xs text-coral">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Referral Code</label>
                <input {...register('referralCode')} className={inputClassName} placeholder="Optional referral code" />
                {errors.referralCode && <p className="mt-1 text-xs text-coral">{errors.referralCode.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Role</label>
                <select {...register('role')} className="w-full bg-surface-2 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-emerald transition-colors text-white overflow-hidden">
                  <option className="bg-obsidian" value="subscriber">Player (User)</option>
                  <option className="bg-obsidian" value="admin">Administrator</option>
                </select>
                {errors.role && <p className="mt-1 text-xs text-coral">{errors.role.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Current Handicap Index (Optional)</label>
                <input type="number" step="0.1" {...register('handicap')} className={inputClassName} placeholder="e.g. 12.4" />
                {errors.handicap && <p className="mt-1 text-xs text-coral">{errors.handicap.message}</p>}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                  <input type="password" {...register('password')} className={inputClassName} placeholder="Enter a password" />
                  {errors.password && <p className="mt-1 text-xs text-coral">{errors.password.message}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
                  <input type="password" {...register('confirmPassword')} className={inputClassName} placeholder="Confirm password" />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-coral">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <p className="text-xs text-text-secondary mt-2">By registering, you agree to our Terms of Service and Privacy Policy.</p>
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-8">
              Already have an account? <Link to="/login" className="text-emerald hover:underline font-medium">Log in</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

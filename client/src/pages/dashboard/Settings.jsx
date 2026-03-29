import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../features/auth/authSlice';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Link2 } from 'lucide-react';

const settingsSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  handicap: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? undefined : Number(value)),
    z.number().min(0, 'Handicap must be zero or higher').optional()
  ),
  club: z.string().optional(),
});

const Settings = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [referral, setReferral] = useState(null);
  const [copying, setCopying] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || '',
      handicap: user?.handicap || '',
      club: user?.club || '',
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || '',
      handicap: user?.handicap || '',
      club: user?.club || '',
    });
  }, [reset, user]);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await api.get('/users/me/referrals');
        if (response.data.success) {
          setReferral(response.data.data);
        }
      } catch {
        // Referral data is optional; keep settings usable if it fails.
      }
    };

    fetchReferralData();
  }, []);

  const handleCopyReferral = async () => {
    if (!referral?.referralLink) return;

    try {
      setCopying(true);
      await navigator.clipboard.writeText(referral.referralLink);
      toast.success('Referral link copied');
    } catch {
      toast.error('Unable to copy referral link');
    } finally {
      setCopying(false);
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await api.put('/users/me', formData);
      if (res.data.success) {
        dispatch(updateProfile(res.data.data));
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = 'w-full bg-surface-2 border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-emerald';

  return (
    <div className="space-y-8 mt-10">
      <header className="mb-10">
         <h1 className="text-3xl font-display font-bold">Settings</h1>
         <p className="text-text-secondary mt-2">Manage your account preferences and referral sharing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="font-display font-bold text-xl border-b border-border pb-4 mb-6">Profile Information</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                 <input 
                   {...register('name')}
                   className={inputClassName}
                 />
                 {errors.name && <p className="mt-1 text-xs text-coral">{errors.name.message}</p>}
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                 <input 
                   disabled
                   value={user?.email || ''}
                   className="w-full bg-surface-1 border border-border rounded-lg px-4 py-2 text-text-secondary cursor-not-allowed" 
                   title="Contact support to change email"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-text-secondary mb-1">Current Handicap</label>
                   <input 
                     type="number"
                     step="0.1"
                     {...register('handicap')}
                     className={inputClassName}
                   />
                   {errors.handicap && <p className="mt-1 text-xs text-coral">{errors.handicap.message}</p>}
                </div>
                <div>
                   <label className="block text-sm font-medium text-text-secondary mb-1">Home Club (Optional)</label>
                   <input 
                     {...register('club')}
                     className={inputClassName}
                   />
                   {errors.club && <p className="mt-1 text-xs text-coral">{errors.club.message}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                 <Button type="submit" disabled={loading}>
                   {loading ? 'Saving...' : 'Save Changes'}
                 </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Link2 className="text-emerald" size={18} />
              <h3 className="font-display font-bold text-lg">Referral Program</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Share your referral code with other golfers. New signups using your link are recorded in the audit trail.
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-border bg-surface-2 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-secondary mb-2">Your Code</p>
                <p className="font-mono text-lg text-gold">{referral?.referralCode || user?.referralCode || 'Pending'}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-2 p-4 break-all text-sm text-text-secondary">
                {referral?.referralLink || `${window.location.origin}/register`}
              </div>
              <Button variant="outline" onClick={handleCopyReferral} disabled={!referral?.referralLink || copying} className="w-full">
                <Copy size={16} className="mr-2" />
                {copying ? 'Copying...' : 'Copy Referral Link'}
              </Button>
            </div>
          </Card>

          <Card className="bg-surface-2">
            <h3 className="font-display font-bold text-lg mb-2">Referral Stats</h3>
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Friends joined</span>
              <span className="text-white font-semibold">{referral?.referredUsersCount || 0}</span>
            </div>
            <div className="mt-4 space-y-3">
              {(referral?.referredUsers || []).slice(0, 3).map((friend) => (
                <div key={friend._id} className="flex items-center justify-between rounded-lg bg-surface-1 px-4 py-3">
                  <div>
                    <p className="font-medium">{friend.firstName} {friend.lastName}</p>
                    <p className="text-xs text-text-secondary">{friend.email}</p>
                  </div>
                  <span className="text-xs text-emerald">Joined</span>
                </div>
              ))}
              {(!referral?.referredUsers || referral.referredUsers.length === 0) && (
                <p className="text-sm text-text-secondary">No referrals yet. Share your link to start tracking invites.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

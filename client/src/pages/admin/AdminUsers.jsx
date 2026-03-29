import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        if (response.data.success) {
          setUsers(response.data.data || []);
        }
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-8 mt-4">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold">User Management</h1>
          <p className="text-text-secondary mt-2">View and manage all registered accounts.</p>
        </div>
      </header>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-text-secondary text-sm border-b border-border">
                <th className="pb-3 px-4 font-medium">Name</th>
                <th className="pb-3 px-4 font-medium">Email</th>
                <th className="pb-3 px-4 font-medium">Role</th>
                <th className="pb-3 px-4 font-medium">Plan</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 font-medium">Referral Code</th>
                <th className="pb-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="py-8 text-center text-text-secondary">Loading users...</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{user.name}</td>
                    <td className="py-4 px-4 text-text-secondary">{user.email}</td>
                    <td className="py-4 px-4">
                       <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-gold/20 text-gold' : 'bg-surface-2'}`}>{user.role}</span>
                    </td>
                    <td className="py-4 px-4 capitalize">{user.subscription?.plan || 'Free'}</td>
                    <td className="py-4 px-4">
                       <span className={user.subscription?.status === 'active' ? 'text-emerald' : 'text-text-secondary'}>
                         {user.subscription?.status || 'inactive'}
                       </span>
                    </td>
                    <td className="py-4 px-4 text-text-secondary text-sm">
                      {user.referralCode || '—'}
                    </td>
                    <td className="py-4 px-4 text-right">
                       <button className="text-sm text-text-secondary hover:text-white underline">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;

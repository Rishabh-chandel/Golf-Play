import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../features/auth/authSlice';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const MyCharity = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharity, setSelectedCharity] = useState(user?.selectedCharity || '');

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data.data);
      } catch (err) {
        toast.error('Failed to load charities');
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put('/users/me', { selectedCharity });
      dispatch(updateProfile({ selectedCharity }));
      toast.success('Charity preference updated!');
    } catch (error) {
      toast.error('Failed to update charity');
    }
  };

  const currentCharityDetails = charities.find(c => c._id === selectedCharity);

  return (
    <div className="space-y-8 mt-10">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold">My Charity</h1>
        <p className="text-text-secondary mt-2">Choose where 50% of your subscription goes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-display font-bold text-xl mb-4">Select an Organization</h3>
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald" />
              </div>
            ) : (
              <div className="space-y-4">
                {charities.map(charity => (
                  <div 
                    key={charity._id} 
                    onClick={() => setSelectedCharity(charity._id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedCharity === charity._id 
                        ? 'border-emerald bg-emerald/5' 
                        : 'border-border bg-surface-2 hover:border-text-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-1 flex items-center justify-center overflow-hidden shrink-0">
                        {charity.logoUrl ? (
                          <img src={charity.logoUrl} alt={charity.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-emerald">{charity.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold">{charity.name}</h4>
                        <p className="text-sm text-text-secondary line-clamp-1">{charity.description}</p>
                      </div>
                      <div className="ml-auto">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedCharity === charity._id ? 'border-emerald' : 'border-border'
                        }`}>
                          {selectedCharity === charity._id && <div className="w-2.5 h-2.5 bg-emerald rounded-full" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 flex justify-end">
                   <Button 
                     onClick={handleUpdate} 
                     disabled={selectedCharity === user?.selectedCharity}
                   >
                     Save Preferences
                   </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-surface-2">
            <h3 className="font-display font-bold text-lg mb-2">Current Selection</h3>
            {currentCharityDetails ? (
              <>
                <div className="w-full h-32 bg-surface-1 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                   {currentCharityDetails.logoUrl ? (
                      <img src={currentCharityDetails.logoUrl} alt="Logo" className="w-full h-full object-cover opacity-80" />
                   ) : (
                      <span className="text-4xl text-emerald font-bold">{currentCharityDetails.name.charAt(0)}</span>
                   )}
                </div>
                <h4 className="font-bold text-xl">{currentCharityDetails.name}</h4>
                <p className="text-sm text-text-secondary mt-2">{currentCharityDetails.description}</p>
                <div className="mt-6 pt-4 border-t border-border flex justify-between">
                  <span className="text-sm font-medium">Your Impact</span>
                  <span className="text-emerald font-bold">£{user?.totalContributed || 0}</span>
                </div>
              </>
            ) : (
              <p className="text-text-secondary text-sm">No charity selected. Please select one to ensure your subscription helps those in need.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyCharity;

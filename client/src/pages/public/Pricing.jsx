import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-obsidian text-text-primary">
      <Navbar />
      <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-text-secondary">Join the club, support charities, and win every month.</p>
          
          <div className="flex items-center justify-center mt-8 gap-4">
             <span className={`text-sm ${!isYearly ? 'text-white font-bold' : 'text-text-secondary'}`}>Monthly</span>
             <button 
               onClick={() => setIsYearly(!isYearly)}
               className="w-14 h-7 bg-surface-2 rounded-full relative flex items-center p-1 border border-border"
             >
                <motion.div 
                   className="w-5 h-5 bg-emerald rounded-full"
                   animate={{ x: isYearly ? 26 : 0 }}
                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
             </button>
             <span className={`text-sm ${isYearly ? 'text-white font-bold' : 'text-text-secondary'}`}>
               Yearly <span className="text-emerald text-xs ml-1">(Save 20%)</span>
             </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           {/* Monthly Plan */}
           <Card className={`relative overflow-hidden transition-all duration-300 ${!isYearly ? 'border-emerald shadow-[0_0_30px_rgba(0,200,150,0.15)]' : 'opacity-70'}`}>
              {!isYearly && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald to-gold"></div>}
              <div className="p-4">
                 <h3 className="text-xl font-bold font-display">Monthly Entry</h3>
                 <p className="text-text-secondary mt-2">Perfect for casual players</p>
                 <div className="my-6">
                    <span className="text-4xl font-bold">£9.99</span>
                    <span className="text-text-secondary">/month</span>
                 </div>
                 
                 <div className="space-y-4 mb-8">
                    {['Up to 5 scores per month', 'Donate to your chosen charity', 'Access to monthly prize draw', 'Email notifications for draws'].map((feature, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="min-w-5 flex items-center justify-center rounded-full bg-emerald/10 text-emerald p-1">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span className="text-sm">{feature}</span>
                       </div>
                    ))}
                 </div>
                 <Link to={isAuthenticated ? "/dashboard/subscription" : "/register"}>
                    <Button className="w-full" variant={!isYearly ? "primary" : "flat"}>Subscribe Monthly</Button>
                 </Link>
              </div>
           </Card>

           {/* Yearly Plan */}
           <Card className={`relative overflow-hidden transition-all duration-300 ${isYearly ? 'border-emerald shadow-[0_0_30px_rgba(0,200,150,0.15)]' : 'opacity-70'}`}>
              {isYearly && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald to-gold"></div>}
              {isYearly && (
                 <div className="absolute top-4 right-4 bg-emerald/20 text-emerald text-xs font-bold px-3 py-1 rounded-full border border-emerald/30">
                    RECOMMENDED
                 </div>
              )}
              <div className="p-4">
                 <h3 className="text-xl font-bold font-display">Annual Membership</h3>
                 <p className="text-text-secondary mt-2">Maximum value & impact</p>
                 <div className="my-6">
                    <span className="text-4xl font-bold">£94.99</span>
                    <span className="text-text-secondary">/year</span>
                 </div>
                 
                 <div className="space-y-4 mb-8">
                    {['Up to 5 scores per month', 'Donate to your chosen charity', 'Access to monthly prize draw', 'Priority winner verification', 'Save approx 20% vs monthly'].map((feature, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="min-w-5 flex items-center justify-center rounded-full bg-emerald/10 text-emerald p-1">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span className="text-sm tracking-wide">{feature}</span>
                       </div>
                    ))}
                 </div>
                 <Link to={isAuthenticated ? "/dashboard/subscription" : "/register"}>
                    <Button className="w-full" variant={isYearly ? "primary" : "flat"}>Subscribe Yearly</Button>
                 </Link>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

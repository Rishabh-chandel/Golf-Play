import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { ScrollReveal } from '../../components/animations/ScrollReveal';
import api from '../../utils/api';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await api.get('/charities');
        setCharities(response.data.data);
      } catch (error) {
        console.error("Failed to fetch charities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  return (
    <div className="min-h-screen bg-obsidian text-text-primary">
      <Navbar />
      
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Partner Charities</h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Every stroke you play supports these incredible organizations. 50% of your subscription goes directly to your chosen cause.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity, index) => (
              <ScrollReveal delay={index * 0.1} key={charity._id}>
                <Card className="h-full flex flex-col p-6 hover:border-emerald transition-colors duration-300">
                  <div className="w-16 h-16 rounded-xl bg-surface-2 flex items-center justify-center text-2xl font-bold text-emerald mb-4 shrink-0 overflow-hidden">
                    {charity.logoUrl ? (
                      <img src={charity.logoUrl} alt={charity.name} className="w-full h-full object-cover" />
                    ) : (
                      charity.name.charAt(0)
                    )}
                  </div>
                  <h3 className="text-xl font-bold font-display mb-2">{charity.name}</h3>
                  <p className="text-text-secondary mb-4 flex-1 line-clamp-3">{charity.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Website:</span>
                    <a href={charity.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-emerald hover:underline">Visit Site</a>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Charities;

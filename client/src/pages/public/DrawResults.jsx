import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/layout/Navbar';
import { Card } from '../../components/ui/Card';
import { ScrollReveal } from '../../components/animations/ScrollReveal';
import api from '../../utils/api';
import { format } from 'date-fns';

const DrawResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Updated to use correct endpoint '/draws/results' instead of '/draws/history'
        const response = await api.get('/draws/results');
        if (response.data.success) {
          setResults(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch draw results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-obsidian text-text-primary">
      <Navbar />
      
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gold">Past Winners</h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Real golfers. Real prizes. See the latest luck of the draw.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {results.map((draw, i) => (
              <ScrollReveal delay={i * 0.1} key={draw._id}>
                <Card className="p-6 border border-border hover:border-gold/50 transition-colors">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-display">{format(new Date(draw.drawDate), 'MMMM yyyy')} Draw</h3>
                    <span className="px-3 py-1 bg-surface-2 text-gold rounded-full text-sm font-medium">#{draw._id.toString().slice(-6)}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {draw.winners && draw.winners.length > 0 ? (
                      draw.winners.map((winner, index) => (
                         <div key={index} className="flex justify-between items-center bg-surface-2 p-4 rounded-lg">
                           <div className="flex flex-col">
                             <span className="font-bold text-lg">{winner.user.name}</span>
                             <span className="text-sm text-text-secondary">Club: {winner.user.club || 'Independent'}</span>
                           </div>
                           <div className="text-right">
                             <span className="block font-medium text-emerald">Won {winner.prizeTier.split('_').join(' ').toUpperCase()}</span>
                             <span className="text-sm text-text-secondary">Handicap: {winner.score.handicapIndexUsed}</span>
                           </div>
                         </div>
                      ))
                    ) : (
                      <div className="text-text-secondary italic bg-surface-2 p-4 rounded-lg">Results pending...</div>
                    )}
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-1 rounded-2xl border border-border">
            <p className="text-text-secondary">No recorded draws yet. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DrawResults;

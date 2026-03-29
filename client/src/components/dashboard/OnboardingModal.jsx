import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { CheckCircle2, ArrowRight, Award, Target, HeartHandshake } from 'lucide-react';
import { completeOnboarding } from '../../features/ui/uiSlice';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const OnboardingModal = ({ open }) => {
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/80 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="w-full max-w-3xl"
          >
            <Card className="p-0 overflow-hidden border-emerald/20 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="p-6 md:p-8 border-b border-border bg-gradient-to-r from-emerald/10 via-transparent to-gold/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-emerald mb-3">Quick tour</p>
                    <h2 className="font-display text-3xl font-bold">Everything you need to get started</h2>
                    <p className="text-text-secondary mt-3 max-w-2xl">
                      Complete this short walkthrough to see where to log scores, choose a charity, and track winnings.
                    </p>
                  </div>
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-emerald/10 items-center justify-center text-emerald">
                    <CheckCircle2 size={22} />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 p-6 md:p-8">
                <div className="rounded-2xl border border-border bg-surface-2 p-5">
                  <Target className="text-emerald mb-3" />
                  <h3 className="font-semibold text-lg mb-2">1. Submit scores</h3>
                  <p className="text-sm text-text-secondary">Log up to 5 rounds each month so your entries stay eligible for the draw.</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface-2 p-5">
                  <HeartHandshake className="text-gold mb-3" />
                  <h3 className="font-semibold text-lg mb-2">2. Support a charity</h3>
                  <p className="text-sm text-text-secondary">Pick a partner charity and keep your contribution preferences current.</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface-2 p-5">
                  <Award className="text-coral mb-3" />
                  <h3 className="font-semibold text-lg mb-2">3. Review winnings</h3>
                  <p className="text-sm text-text-secondary">Track draw results, audit activity, and prizes from one dashboard.</p>
                </div>
              </div>

              <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="text-sm text-text-secondary flex items-center gap-2">
                  <ArrowRight size={16} className="text-emerald" />
                  You can reopen this guidance from the dashboard overview at any time.
                </div>
                <Button onClick={() => dispatch(completeOnboarding())}>Finish tour</Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
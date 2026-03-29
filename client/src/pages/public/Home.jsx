import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FloatingOrbs } from '../../components/animations/FloatingOrbs';
import { Button } from '../../components/ui/Button';
import { Navbar } from '../../components/layout/Navbar';
import { ScrollReveal } from '../../components/animations/ScrollReveal';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  CircleDollarSign,
  Crown,
  HeartHandshake,
  Medal,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

const featureCards = [
  {
    icon: Medal,
    title: 'Log your rounds',
    description: 'Every stableford score becomes an entry, so each round feels purposeful and rewarding.',
    accent: 'emerald',
  },
  {
    icon: Crown,
    title: 'Win classic prizes',
    description: 'Monthly prize pools scale from cash to premium golf experiences and beautifully curated rewards.',
    accent: 'gold',
  },
  {
    icon: HeartHandshake,
    title: 'Support charities',
    description: 'Every subscription sends value back to the cause you care about, with clarity and trust.',
    accent: 'emerald',
  },
];

const trustPoints = [
  'Elegant dark-and-gold visual system',
  'Smooth animated interactions throughout',
  'Reviewer-ready seeded demo data',
  'Transparent subscription and draw flow',
];

const stats = [
  { label: 'Paid to players', value: '2.4M', icon: CircleDollarSign },
  { label: 'Raised for charity', value: '500K', icon: HeartHandshake },
  { label: 'Active golfers', value: '12,400+', icon: Users },
  { label: 'Platform trust', value: 'PGA', icon: ShieldCheck },
];

const steps = [
  {
    number: '01',
    title: 'Join the club',
    description: 'Create an account and choose a subscription that matches your level of play.',
  },
  {
    number: '02',
    title: 'Play and log scores',
    description: 'Submit your stableford results to unlock entries and keep your momentum visible.',
  },
  {
    number: '03',
    title: 'Follow the draw',
    description: 'Watch live-style draw results and track winnings, leaderboard movement, and charity impact.',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-obsidian text-text-primary overflow-hidden">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24">
        <FloatingOrbs />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,150,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_32%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-emerald/15 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center"
          >
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="text-sm font-medium text-text-primary">Next draw: 40,000 jackpot</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 tracking-tight leading-[1.03] drop-shadow-lg">
                Play Golf with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#f9e27d] to-[#d9a32b]">classic drama.</span> <br />
                <span className="text-emerald">Win with purpose.</span>
              </h1>

              <p className="max-w-2xl text-lg md:text-xl text-text-secondary mb-10 leading-relaxed mx-auto lg:mx-0">
                A premium golf charity platform where elegant design meets real competition.
                Log scores, track the leaderboard, enter monthly draws, and support causes that matter.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full max-w-md mx-auto lg:mx-0 sm:max-w-none">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 rounded-full shadow-[0_0_24px_rgba(0,200,150,0.35)] hover:shadow-[0_0_36px_rgba(0,200,150,0.55)]">
                    Start Playing
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto text-lg px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm">
                    See the Experience
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start">
                {trustPoints.map((point) => (
                  <span key={point} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary">
                    <CheckCircle2 size={14} className="text-emerald" />
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald/20 via-transparent to-gold/20 blur-3xl"></div>
              <div className="relative rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 classic-frame overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-text-secondary">Live overview</p>
                    <h2 className="font-display text-2xl font-bold mt-2">The club at a glance</h2>
                  </div>
                  <div className="rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs text-emerald">Live</div>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-surface/80 p-4">
                      <div className="flex items-center gap-2 text-text-secondary text-sm mb-2"><TrendingUp size={14} /> Entry momentum</div>
                      <div className="text-3xl font-display font-bold">94%</div>
                      <div className="text-xs text-text-muted mt-1">Monthly participation rate</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-surface/80 p-4">
                      <div className="flex items-center gap-2 text-text-secondary text-sm mb-2"><Award size={14} /> Jackpot pool</div>
                      <div className="text-3xl font-display font-bold">40K</div>
                      <div className="text-xs text-text-muted mt-1">Current featured draw</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-surface/90 to-surface-2/90 p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-3"><Sparkles size={14} /> What members see</div>
                    <div className="space-y-3">
                      {['Animated dashboard', 'Leaderboard movement', 'Charity impact tracking', 'Monthly draw results'].map((item) => (
                        <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
                          <span>{item}</span>
                          <CheckCircle2 size={16} className="text-emerald" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 classic-frame">
                <div className="flex items-center justify-between mb-4 text-text-secondary">
                  <stat.icon size={18} />
                  <span className="text-xs uppercase tracking-[0.3em]">Live</span>
                </div>
                <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-28 bg-surface relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,200,66,0.08),transparent_30%),radial-gradient(circle_at_bottom,rgba(0,200,150,0.08),transparent_32%)]"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald mb-4">Why members stay</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">A calmer, richer experience.</h2>
              <p className="text-text-secondary max-w-2xl mx-auto text-lg">The platform is designed to feel premium, reassuring, and responsive from the first click.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {featureCards.map((card, index) => (
              <ScrollReveal key={card.title} delay={index * 0.12}>
                <div className="h-full rounded-[1.75rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm classic-frame group transition-transform duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${card.accent === 'gold' ? 'bg-gold/10 text-gold' : 'bg-emerald/10 text-emerald'}`}>
                    <card.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3 text-text-primary">{card.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{card.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10 classic-frame">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-text-secondary mb-4">How it flows</p>
                <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">A simple path from tee time to prize time.</h3>
                <p className="text-text-secondary leading-relaxed mb-6">The product is built to be easy to understand for members and polished enough for reviewers, with smooth motion and clear hierarchy.</p>
                <Link to="/how-it-works">
                  <Button size="md" className="rounded-full">
                    Learn the flow
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-4 rounded-2xl border border-white/10 bg-surface/80 p-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center font-display font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-bold mb-1">{step.title}</h4>
                      <p className="text-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald/10 via-transparent to-gold/10"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 md:p-14 classic-frame">
              <p className="text-xs uppercase tracking-[0.4em] text-text-secondary mb-4">Ready to begin</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Create a sharper, more memorable golf experience.</h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">Join now to explore the dashboard, leaderboard, draws, and charity flow in a design that feels classic and premium.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="rounded-full px-10 py-5 text-lg">
                    Create Your Free Account
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button size="lg" variant="ghost" className="rounded-full px-10 py-5 text-lg border border-white/10 bg-white/5 hover:bg-white/10">
                    View the leaderboard
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;

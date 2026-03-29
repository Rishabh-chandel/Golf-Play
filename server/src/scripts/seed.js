import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Charity from '../models/Charity.js';
import Score from '../models/Score.js';
import Subscription from '../models/Subscription.js';
import Draw from '../models/Draw.js';
import Winner from '../models/Winner.js';
import PrizePool from '../models/PrizePool.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to DB for seeding');

    console.log('Resetting demo collections...');
    await Promise.all([
      Winner.deleteMany({}),
      Draw.deleteMany({}),
      PrizePool.deleteMany({}),
      Score.deleteMany({}),
      Subscription.deleteMany({}),
      User.deleteMany({}),
      Charity.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    console.log('Demo collections cleared');

    // 1. Seed Charities
    const charitiesData = [
      {
        name: 'Caddie Foundation',
        slug: 'caddie-foundation',
        description: 'Supporting caddies worldwide with scholarships and healthcare.',
        shortDescription: 'Supporting caddies worldwide.',
        category: 'community',
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Youth Golf Dev',
        slug: 'youth-golf-dev',
        description: 'Helping underprivileged youth access golf equipment and training.',
        shortDescription: 'Youth golf access.',
        category: 'sports',
        isActive: true,
        isFeatured: false
      },
      {
        name: 'Golfers Against Cancer',
        slug: 'golfers-against-cancer',
        description: 'Funding cancer research through community golf tournaments.',
        shortDescription: 'Funding cancer research.',
        category: 'health',
        isActive: true,
        isFeatured: false
      },
      {
        name: 'Veterans Golf Initiative',
        slug: 'veterans-golf',
        description: 'Rehabilitation for veterans through the game of golf.',
        shortDescription: 'Rehab for veterans.',
        category: 'health',
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Blind Golf Assoc',
        slug: 'blind-golf-assoc',
        description: 'Providing resources and organizing tournaments for visually impaired golfers.',
        shortDescription: 'Empowering blind golfers.',
        category: 'community',
        isActive: true,
        isFeatured: false
      },
      {
        name: 'Mindful Strokes',
        slug: 'mindful-strokes',
        description: 'Promoting mental health awareness through sports and community.',
        shortDescription: 'Mental health awareness.',
        category: 'health',
        isActive: true,
        isFeatured: false
      }
    ];

    const insertedCharities = await Charity.insertMany(charitiesData);
    console.log('Charities seeded');

    // 2. Seed Users
    const salt = await bcrypt.genSalt(12);
    const adminPassword = await bcrypt.hash('password123', salt);
    const userPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin',
      country: 'United Kingdom',
      isEmailVerified: true,
      referralCode: 'ADMIN-2025'
    });

    const john = await User.create({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      passwordHash: userPassword,
      role: 'subscriber',
      country: 'United Kingdom',
      referralCode: 'JOHN-2025',
      selectedCharity: insertedCharities[0]._id,
      isEmailVerified: true
    });

    const emma = await User.create({
      firstName: 'Emma',
      lastName: 'Brown',
      email: 'emma@example.com',
      passwordHash: userPassword,
      role: 'subscriber',
      country: 'United Kingdom',
      referralCode: 'EMMA-2025',
      referredBy: john._id,
      selectedCharity: insertedCharities[3]._id,
      isEmailVerified: true
    });
    console.log('Users seeded');

    // 3. Seed Subscriptions & Scores
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const johnSub = await Subscription.create({
      user: john._id,
      plan: 'monthly',
      status: 'active',
      amount: 999,
      stripeCustomerId: 'cus_demo_john',
      stripeSubscriptionId: 'sub_demo_john',
      stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_demo',
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
      charityContribution: 500,
      prizePoolContribution: 499
    });

    const emmaSub = await Subscription.create({
      user: emma._id,
      plan: 'yearly',
      status: 'active',
      amount: 9999,
      stripeCustomerId: 'cus_demo_emma',
      stripeSubscriptionId: 'sub_demo_emma',
      stripePriceId: process.env.STRIPE_ANNUAL_PRICE_ID || 'price_annual_demo',
      currentPeriodStart: now,
      currentPeriodEnd: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
      charityContribution: 5000,
      prizePoolContribution: 4999
    });

    await User.findByIdAndUpdate(john._id, { subscription: johnSub._id });
    await User.findByIdAndUpdate(emma._id, { subscription: emmaSub._id });

    const johnScores = [];
    const emmaScores = [];
    for (let i = 0; i < 5; i++) {
      johnScores.push({
        value: 26 + i,
        datePlayed: new Date(now.getFullYear(), now.getMonth(), now.getDate() - i),
        enteredAt: new Date(now.getTime() - i * 86400000)
      });

      emmaScores.push({
        value: 24 + i,
        datePlayed: new Date(now.getFullYear(), now.getMonth(), now.getDate() - i - 1),
        enteredAt: new Date(now.getTime() - (i + 1) * 86400000)
      });
    }

    await Score.create({ user: john._id, scores: johnScores });
    await Score.create({ user: emma._id, scores: emmaScores });
    console.log('Subscriptions and scores seeded');

    // 4. Seed Prize Pools, Draws, Winners
    const drawDate = new Date(now);
    drawDate.setMonth(drawDate.getMonth() - 1);
    
    const pool = await PrizePool.create({
        month: drawDate.getMonth() + 1,
        year: drawDate.getFullYear(),
        totalCollected: 100000, // in pence
        tier5Pool: 40000,
        tier4Pool: 35000,
        tier3Pool: 25000,
        isFinalized: true
    });

    const draw = await Draw.create({
        month: drawDate.getMonth() + 1,
        year: drawDate.getFullYear(),
        drawDate: drawDate,
        status: 'published',
        drawType: 'random',
        winningNumbers: [10, 15, 22, 31, 40],
        prizePool: {
            total: 100000,
            tier5: 40000,
            tier4: 35000,
            tier3: 25000,
            jackpotRolledOver: 0
        },
        stats: {
            totalParticipants: 3,
            tier5Winners: 0,
            tier4Winners: 1,
            tier3Winners: 0
        },
        publishedAt: drawDate,
        publishedBy: admin._id
    });

      const scheduledDrawDate = new Date(now);
      scheduledDrawDate.setMonth(scheduledDrawDate.getMonth() + 1);

      await Draw.create({
        month: scheduledDrawDate.getMonth() + 1,
        year: scheduledDrawDate.getFullYear(),
        drawDate: scheduledDrawDate,
        status: 'scheduled',
        drawType: 'random',
        winningNumbers: [],
        prizePool: {
          total: 120000,
          tier5: 50000,
          tier4: 40000,
          tier3: 30000,
          jackpotRolledOver: 0
        },
        stats: {
          totalParticipants: 2,
          tier5Winners: 0,
          tier4Winners: 0,
          tier3Winners: 0
        },
        publishedBy: admin._id
      });
    
    pool.draw = draw._id;
    await pool.save();

    await Winner.create({
        user: john._id,
        draw: draw._id,
        matchedNumbers: [10, 15, 22, 31],
        matchTier: 4,
        prizeAmount: 35000,
        verificationStatus: 'approved',
        paymentStatus: 'paid',
        paidAt: new Date(),
        paidBy: admin._id
    });

      await Winner.create({
        user: emma._id,
        draw: draw._id,
        matchedNumbers: [10, 15, 22],
        matchTier: 3,
        prizeAmount: 25000,
        verificationStatus: 'approved',
        paymentStatus: 'paid',
        paidAt: new Date(),
        paidBy: admin._id
      });

    await Notification.insertMany([
      {
        user: john._id,
        type: 'subscription',
        title: 'Subscription active',
        message: 'Your monthly plan is active and ready for this month\'s draw.',
        link: '/dashboard/subscription',
        isRead: false
      },
      {
        user: john._id,
        type: 'draw_result',
        title: 'You placed in the draw',
        message: 'You matched numbers in the latest published draw.',
        link: '/dashboard/winnings',
        isRead: false
      },
      {
        user: emma._id,
        type: 'winner_alert',
        title: 'Winner verified',
        message: 'Your winning submission has been approved and paid.',
        link: '/dashboard/winnings',
        isRead: true
      }
    ]);

    await AuditLog.insertMany([
      {
        actor: admin._id,
        action: 'seed_run',
        entityType: 'System',
        description: 'Demo dataset seeded',
        metadata: { source: 'seed.js' },
        ipAddress: '127.0.0.1'
      },
      {
        actor: john._id,
        action: 'register',
        entityType: 'User',
        entityId: john._id,
        description: 'Demo subscriber account created',
        metadata: { referralCode: null }
      },
      {
        actor: emma._id,
        action: 'register',
        entityType: 'User',
        entityId: emma._id,
        description: 'Demo subscriber account created from referral',
        metadata: { referralCode: 'JOHN-2025' }
      }
    ]);

    console.log('Draws, pools, and winners seeded');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

import Subscription from '../models/Subscription.js';
import PrizePool from '../models/PrizePool.js';

const PRIZE_POOL_PERCENT = 0.30;
const MONTHLY_PRICE = 9.99;
const YEARLY_PRICE_MONTHLY_EQ = 94.99 / 12;

export const calculateMonthlyPool = async (month, year) => {
  // Count active subscribers
  const monthlySubs = await Subscription.countDocuments({ status: 'active', plan: 'monthly' });
  const yearlySubs = await Subscription.countDocuments({ status: 'active', plan: 'yearly' });

  const monthlyContribution = monthlySubs * (MONTHLY_PRICE * PRIZE_POOL_PERCENT);
  const yearlyContribution = yearlySubs * (YEARLY_PRICE_MONTHLY_EQ * PRIZE_POOL_PERCENT);

  const totalCollected = monthlyContribution + yearlyContribution;

  // Find carryover from previous finalized pool
  let previousMonth = month - 1;
  let previousYear = year;
  if (previousMonth === 0) {
    previousMonth = 12;
    previousYear -= 1;
  }

  const prevPool = await PrizePool.findOne({ month: previousMonth, year: previousYear });
  const jackpotCarryover = prevPool ? prevPool.jackpotCarryover : 0;

  const tier5Pool = (totalCollected * 0.40) + jackpotCarryover;
  const tier4Pool = totalCollected * 0.35;
  const tier3Pool = totalCollected * 0.25;

  let currentPool = await PrizePool.findOne({ month, year });
  if (!currentPool) {
    currentPool = new PrizePool({
      month,
      year,
      totalCollected,
      tier5Pool,
      tier4Pool,
      tier3Pool,
      jackpotCarryover
    });
    await currentPool.save();
  }

  return currentPool;
};

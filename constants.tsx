
import { Theme } from './types';

export const THEMES: Theme[] = [
  {
    name: 'Verdan Meadow',
    bg: 'bg-emerald-900',
    card: 'bg-emerald-800/40',
    accent: 'bg-lime-500',
    secondary: 'bg-emerald-700/60'
  },
  {
    name: 'Midnight Lavender',
    bg: 'bg-indigo-950',
    card: 'bg-indigo-900/40',
    accent: 'bg-purple-500',
    secondary: 'bg-indigo-800/60'
  },
  {
    name: 'Oceanic Depths',
    bg: 'bg-slate-950',
    card: 'bg-blue-900/30',
    accent: 'bg-cyan-500',
    secondary: 'bg-slate-800/50'
  },
  {
    name: 'Sunset Rose',
    bg: 'bg-rose-950',
    card: 'bg-rose-900/30',
    accent: 'bg-orange-500',
    secondary: 'bg-rose-800/50'
  },
  {
    name: 'Emerald Forest',
    bg: 'bg-emerald-950',
    card: 'bg-emerald-900/30',
    accent: 'bg-lime-500',
    secondary: 'bg-emerald-800/50'
  },
  {
    name: 'Solar Flare',
    bg: 'bg-orange-950',
    card: 'bg-amber-900/30',
    accent: 'bg-yellow-500',
    secondary: 'bg-orange-800/50'
  },
  {
    name: 'Cyberpunk Neon',
    bg: 'bg-black',
    card: 'bg-zinc-900/50',
    accent: 'bg-pink-600',
    secondary: 'bg-zinc-800/80'
  }
];

export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1.0 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.79 },
  JPY: { symbol: '¥', name: 'Japanese Yen', rate: 150.14 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', rate: 0.88 },
  CNY: { symbol: '¥', name: 'Chinese Yuan', rate: 7.19 },
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 82.90 },
  BTC: { symbol: '₿', name: 'Bitcoin', rate: 0.0000104 }
};

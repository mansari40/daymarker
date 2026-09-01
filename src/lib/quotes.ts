// lib/quotes.ts
// Curated quotes for Daymarker's daily line.
// Mix of well-known quotes (attributed) and original lines written in
// Daymarker's own "quiet ritual" voice (unattributed, author: "").
// Edit freely — add, remove, or reorder without breaking anything.

export interface Quote {
  content: string;
  author: string;
}

export const quotes: Quote[] = [
  { content: "Small marks add up.", author: "" },
  { content: "The next right thing is enough.", author: "" },
  { content: "One mark, well made, beats ten half-finished.", author: "" },
  { content: "Today doesn't need a plan. It needs a start.", author: "" },
  { content: "Quiet days build the longest streaks.", author: "" },
  { content: "You don't have to see the whole day. Just the next hour.", author: "" },
  { content: "Do less, but mean it.", author: "" },
  { content: "The chain is made of days like this one.", author: "" },
  { content: "Finish before you multiply.", author: "" },
  { content: "A day is a small thing, done well.", author: "" },

  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { content: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { content: "Well begun is half done.", author: "Aristotle" },
  { content: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { content: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { content: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { content: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { content: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { content: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { content: "Do the one thing you think you cannot do.", author: "Eleanor Roosevelt" },
  { content: "Not the finishing, but the doing, is the thing.", author: "Robert Louis Stevenson" },
  { content: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { content: "You will never find time for anything. You must make it.", author: "Charles Buxton" },
  { content: "Order and simplification are the first steps toward mastery.", author: "Thomas Mann" },
  { content: "Nothing is particularly hard if you divide it into small jobs.", author: "Henry Ford" },
  { content: "The best way to get something done is to begin.", author: "Unknown" },
  { content: "Progress is impossible without change.", author: "George Bernard Shaw" },

  { content: "You already know the one thing. Say it out loud.", author: "" },
  { content: "Not everything. One thing.", author: "" },
  { content: "The list can wait. Today can't.", author: "" },
  { content: "A mark isn't a task. It's a decision.", author: "" },
  { content: "You're not behind. You're here.", author: "" },
  { content: "Let today be simple on purpose.", author: "" },
  { content: "The streak isn't the point. The showing up is.", author: "" },
  { content: "Some days the mark is small. That still counts.", author: "" },
  { content: "Clarity first, momentum after.", author: "" },
  { content: "This is the version of today you get to shape.", author: "" },

  { content: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { content: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { content: "What we do every day matters more than what we do once in a while.", author: "Gretchen Rubin" },
  { content: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { content: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { content: "Until we can manage time, we can manage nothing else.", author: "Peter Drucker" },
  { content: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
  { content: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { content: "The shortest answer is doing.", author: "Lord Herbert" },
];

// Deterministic daily pick — same quote all day for every user,
// rotates automatically at midnight, no DB write and no network call.
export function getTodaysQuote(): Quote {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / 86_400_000
  );
  return quotes[dayOfYear % quotes.length];
}
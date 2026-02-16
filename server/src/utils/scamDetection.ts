import { PrismaClient } from '@prisma/client';

const DEFAULT_BLOCKED_PHRASES = [
  'send money', 'wire transfer', 'bitcoin', 'crypto', 'investment opportunity',
  'gofundme', 'cashapp', 'venmo', 'paypal me', 'donate', 'bank account',
  'financial help', 'inheritance',
];

let cachedPhrases: string[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function getBlockedPhrases(prisma: PrismaClient): Promise<string[]> {
  const now = Date.now();
  if (cachedPhrases && now - cacheTime < CACHE_TTL) return cachedPhrases;

  const dbPhrases = await prisma.blockedPhrase.findMany({
    where: { isActive: true },
    select: { phrase: true },
  });

  cachedPhrases = dbPhrases.length > 0
    ? dbPhrases.map(p => p.phrase.toLowerCase())
    : DEFAULT_BLOCKED_PHRASES;
  cacheTime = now;
  return cachedPhrases;
}

export function invalidatePhrasesCache() {
  cachedPhrases = null;
}

export async function checkForScam(
  text: string,
  prisma: PrismaClient
): Promise<{ flagged: boolean; matchedPhrase?: string }> {
  const phrases = await getBlockedPhrases(prisma);
  const lowered = text.toLowerCase();
  const matched = phrases.find(phrase => lowered.includes(phrase));
  return matched ? { flagged: true, matchedPhrase: matched } : { flagged: false };
}

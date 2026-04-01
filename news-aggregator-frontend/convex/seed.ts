import { mutation } from "./_generated/server";

const newsData = [
  {
    title: "AI-Powered Climate Monitoring System Launches in East Africa",
    summary: "A groundbreaking AI system that monitors deforestation patterns in real-time has been deployed across Kenya and Tanzania, processing satellite imagery every 15 minutes.",
    aiDraft: "Breaking: East Africa leads the charge in tech-driven conservation! A new AI-powered climate monitoring system is now live across Kenya and Tanzania, scanning satellite feeds every 15 minutes to detect deforestation in real-time. This could be a game-changer for environmental protection in the region. #ClimateAction #AIforGood #EastAfrica",
    platform: "twitter" as const,
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    originalUrl: "https://example.com/ai-climate",
    author: "@TechInAfrica",
    publishedAt: "2026-04-01T12:30:00Z",
    locationCountry: "Kenya",
    locationRegion: "Nairobi",
    metricsLikes: 45200,
    metricsShares: 12800,
    metricsComments: 3400,
    metricsVelocity: 2340,
    trendScore: 92,
    hashtags: ["#ClimateAI", "#EastAfrica", "#TechForGood"],
    isAutoPostEnabled: false,
    status: "trending" as const,
  },
  {
    title: "Gen Z Financial Literacy Movement Goes Viral on TikTok",
    summary: "A series of TikTok videos explaining cryptocurrency and stock market basics has amassed over 50 million combined views in just 48 hours.",
    aiDraft: "The next generation is taking financial education into their own hands! Gen Z creators on TikTok are making investing accessible with bite-sized lessons that have racked up 50M+ views in 2 days. From crypto basics to stock picking, this movement is reshaping how young people think about money. #FinTok #GenZFinance #InvestingMadeSimple",
    platform: "tiktok" as const,
    category: "Finance",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    videoUrl: "https://example.com/tiktok-video",
    originalUrl: "https://example.com/genz-finance",
    author: "@FinanceGuru",
    publishedAt: "2026-04-01T10:15:00Z",
    locationCountry: "United States",
    locationRegion: "California",
    metricsLikes: 128000,
    metricsShares: 45600,
    metricsComments: 8900,
    metricsVelocity: 5600,
    trendScore: 97,
    hashtags: ["#FinTok", "#GenZFinance", "#CryptoBasics"],
    isAutoPostEnabled: true,
    status: "trending" as const,
  },
  {
    title: "Underground Music Scene in Lagos Gains Global Attention",
    summary: "Afrobeats fusion artists from Lagos are trending on Instagram with a new sound that blends traditional Yoruba rhythms with electronic beats.",
    aiDraft: "Lagos is the epicenter of a musical revolution! Afrobeats fusion artists are crafting a new sound that weaves traditional Yoruba rhythms with cutting-edge electronic production. The world is listening, and this underground movement is about to go mainstream. #Afrobeats #LagosMusic #AfricanRhythms",
    platform: "instagram" as const,
    category: "Entertainment",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    videoUrl: "https://example.com/ig-reel",
    originalUrl: "https://example.com/lagos-music",
    author: "@AfrobeatsDaily",
    publishedAt: "2026-04-01T08:45:00Z",
    locationCountry: "Nigeria",
    locationRegion: "Lagos",
    metricsLikes: 89400,
    metricsShares: 23100,
    metricsComments: 5600,
    metricsVelocity: 3200,
    trendScore: 88,
    hashtags: ["#Afrobeats", "#LagosMusic", "#MusicDiscovery"],
    isAutoPostEnabled: false,
    status: "trending" as const,
  },
  {
    title: "Remote Work Revolution: Companies Adopting 4-Day Work Week",
    summary: "A Reddit thread documenting companies switching to 4-day work weeks has gone viral, with thousands sharing their experiences and productivity data.",
    aiDraft: "The 4-day work week is no longer just an experiment - it is becoming the new normal! Companies across the globe are reporting higher productivity and happier employees after making the switch. Here is what the data shows and why your company might be next. #FutureOfWork #4DayWorkWeek #RemoteWork",
    platform: "reddit" as const,
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    originalUrl: "https://reddit.com/r/antiwork/example",
    author: "u/WorkLifeBalance",
    publishedAt: "2026-04-01T06:20:00Z",
    locationCountry: "United Kingdom",
    locationRegion: "London",
    metricsLikes: 67800,
    metricsShares: 18900,
    metricsComments: 12300,
    metricsVelocity: 1800,
    trendScore: 82,
    hashtags: ["#4DayWorkWeek", "#FutureOfWork", "#Productivity"],
    isAutoPostEnabled: true,
    status: "scheduled" as const,
  },
  {
    title: "Electric Vehicle Sales Surpass Gas Cars for First Time in Europe",
    summary: "March 2026 marks a historic milestone as EV sales in Europe officially overtake traditional combustion engine vehicles for the first time ever.",
    aiDraft: "History has been made! For the first time EVER, electric vehicle sales in Europe have surpassed gas-powered cars. March 2026 will be remembered as the tipping point in the automotive revolution. Here is the breakdown by country and what it means for the industry. #EVRevolution #ElectricCars #Sustainability",
    platform: "facebook" as const,
    category: "Automotive",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=400&fit=crop",
    originalUrl: "https://example.com/ev-sales",
    author: "EV World News",
    publishedAt: "2026-04-01T04:00:00Z",
    locationCountry: "Germany",
    locationRegion: "Bavaria",
    metricsLikes: 156000,
    metricsShares: 52000,
    metricsComments: 9800,
    metricsVelocity: 4100,
    trendScore: 95,
    hashtags: ["#EVRevolution", "#ElectricCars", "#GreenEnergy"],
    isAutoPostEnabled: false,
    status: "draft" as const,
  },
  {
    title: "Breakthrough in Malaria Vaccine Shows 95% Efficacy in Trials",
    summary: "Oxford researchers announce a next-generation malaria vaccine showing unprecedented 95% efficacy in Phase 3 clinical trials across Sub-Saharan Africa.",
    aiDraft: "MASSIVE breakthrough in global health! Oxford researchers have developed a next-gen malaria vaccine with 95% efficacy - the highest ever recorded. Phase 3 trials across Sub-Saharan Africa show incredible promise. This could save hundreds of thousands of lives annually. #MalariaVaccine #GlobalHealth #MedicalBreakthrough",
    platform: "twitter" as const,
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop",
    originalUrl: "https://example.com/malaria-vaccine",
    author: "@WHOAfrica",
    publishedAt: "2026-03-31T22:00:00Z",
    locationCountry: "Kenya",
    locationRegion: "Kisumu",
    metricsLikes: 234000,
    metricsShares: 89000,
    metricsComments: 15600,
    metricsVelocity: 7800,
    trendScore: 99,
    hashtags: ["#MalariaVaccine", "#GlobalHealth", "#Africa"],
    isAutoPostEnabled: true,
    status: "posted" as const,
  },
  {
    title: "Street Food Festival in Bangkok Breaks Attendance Records",
    summary: "Bangkok's annual street food festival attracted over 2 million visitors this year, with vendors from 30 countries showcasing fusion cuisines.",
    aiDraft: "Bangkok just hosted the BIGGEST street food festival in history! 2 million foodies from around the world descended on the city to taste fusion creations from 30 countries. From spicy Thai-Mexican tacos to Japanese-Thai curry ramen - the flavors were unreal! #StreetFood #Bangkok #FoodFestival",
    platform: "instagram" as const,
    category: "Food & Culture",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    videoUrl: "https://example.com/bangkok-food-reel",
    originalUrl: "https://example.com/bangkok-food",
    author: "@FoodieAdventures",
    publishedAt: "2026-03-31T18:30:00Z",
    locationCountry: "Thailand",
    locationRegion: "Bangkok",
    metricsLikes: 312000,
    metricsShares: 67000,
    metricsComments: 21000,
    metricsVelocity: 3400,
    trendScore: 85,
    hashtags: ["#StreetFood", "#Bangkok", "#FoodLovers"],
    isAutoPostEnabled: false,
    status: "trending" as const,
  },
  {
    title: "SpaceX Starship Successfully Lands on Mars Simulation Site",
    summary: "SpaceX completed a full-scale Mars landing simulation in the Mojave Desert, demonstrating the Starship's capability to land on Mars-like terrain.",
    aiDraft: "SpaceX just pulled off something incredible! A full-scale Mars landing simulation in the Mojave Desert was completed successfully, proving Starship can handle Mars-like terrain. We are one step closer to becoming a multi-planetary species. #SpaceX #Mars #Starship",
    platform: "reddit" as const,
    category: "Space",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop",
    originalUrl: "https://reddit.com/r/spacex/example",
    author: "u/SpaceEnthusiast",
    publishedAt: "2026-03-31T14:00:00Z",
    locationCountry: "United States",
    locationRegion: "Nevada",
    metricsLikes: 445000,
    metricsShares: 123000,
    metricsComments: 34000,
    metricsVelocity: 9200,
    trendScore: 98,
    hashtags: ["#SpaceX", "#Mars", "#Starship", "#Space"],
    isAutoPostEnabled: true,
    status: "posted" as const,
  },
];

const trendTimelineData = [
  { time: "00:00", twitter: 1200, tiktok: 800, instagram: 950, facebook: 1100, reddit: 600 },
  { time: "02:00", twitter: 1400, tiktok: 1200, instagram: 1100, facebook: 900, reddit: 750 },
  { time: "04:00", twitter: 1100, tiktok: 1800, instagram: 1300, facebook: 800, reddit: 900 },
  { time: "06:00", twitter: 2100, tiktok: 2400, instagram: 1800, facebook: 1200, reddit: 1100 },
  { time: "08:00", twitter: 3200, tiktok: 3100, instagram: 2800, facebook: 1800, reddit: 1600 },
  { time: "10:00", twitter: 4500, tiktok: 4800, instagram: 3600, facebook: 2400, reddit: 2100 },
  { time: "12:00", twitter: 5200, tiktok: 5600, instagram: 4200, facebook: 3100, reddit: 2800 },
  { time: "14:00", twitter: 4800, tiktok: 6200, instagram: 4800, facebook: 3500, reddit: 3200 },
  { time: "16:00", twitter: 5100, tiktok: 5800, instagram: 5200, facebook: 3800, reddit: 3500 },
  { time: "18:00", twitter: 6200, tiktok: 7100, instagram: 5800, facebook: 4200, reddit: 3800 },
  { time: "20:00", twitter: 5800, tiktok: 6800, instagram: 5400, facebook: 3900, reddit: 3400 },
  { time: "22:00", twitter: 4200, tiktok: 5200, instagram: 4100, facebook: 2800, reddit: 2600 },
];

const locationData = [
  { name: "Kenya", code: "KE", type: "country" as const },
  { name: "Nairobi", code: "NBO", type: "county" as const, parentCode: "KE" },
  { name: "Mombasa", code: "MSA", type: "county" as const, parentCode: "KE" },
  { name: "Kisumu", code: "KSM", type: "county" as const, parentCode: "KE" },
  { name: "Nakuru", code: "NKU", type: "county" as const, parentCode: "KE" },
  { name: "Eldoret", code: "ELD", type: "county" as const, parentCode: "KE" },
  { name: "Kiambu", code: "KBU", type: "county" as const, parentCode: "KE" },
  { name: "Machakos", code: "MKS", type: "county" as const, parentCode: "KE" },
  { name: "United States", code: "US", type: "country" as const },
  { name: "California", code: "CA", type: "state" as const, parentCode: "US" },
  { name: "New York", code: "NY", type: "state" as const, parentCode: "US" },
  { name: "Texas", code: "TX", type: "state" as const, parentCode: "US" },
  { name: "Florida", code: "FL", type: "state" as const, parentCode: "US" },
  { name: "Nevada", code: "NV", type: "state" as const, parentCode: "US" },
  { name: "Washington", code: "WA", type: "state" as const, parentCode: "US" },
  { name: "United Kingdom", code: "GB", type: "country" as const },
  { name: "London", code: "LDN", type: "county" as const, parentCode: "GB" },
  { name: "Manchester", code: "MAN", type: "county" as const, parentCode: "GB" },
  { name: "Birmingham", code: "BHM", type: "county" as const, parentCode: "GB" },
  { name: "Edinburgh", code: "EDI", type: "county" as const, parentCode: "GB" },
  { name: "Nigeria", code: "NG", type: "country" as const },
  { name: "Lagos", code: "LOS", type: "state" as const, parentCode: "NG" },
  { name: "Abuja", code: "ABJ", type: "state" as const, parentCode: "NG" },
  { name: "Kano", code: "KAN", type: "state" as const, parentCode: "NG" },
  { name: "Port Harcourt", code: "PHC", type: "state" as const, parentCode: "NG" },
  { name: "Germany", code: "DE", type: "country" as const },
  { name: "Bavaria", code: "BAV", type: "state" as const, parentCode: "DE" },
  { name: "Berlin", code: "BER", type: "state" as const, parentCode: "DE" },
  { name: "Hamburg", code: "HAM", type: "state" as const, parentCode: "DE" },
  { name: "Thailand", code: "TH", type: "country" as const },
  { name: "Bangkok", code: "BKK", type: "state" as const, parentCode: "TH" },
  { name: "Chiang Mai", code: "CNX", type: "state" as const, parentCode: "TH" },
  { name: "Phuket", code: "HKT", type: "state" as const, parentCode: "TH" },
];

const socialAccountsData = [
  { platform: "twitter" as const, handle: "@TrendPulse", avatar: "", connected: true, followers: 125000 },
  { platform: "instagram" as const, handle: "@trendpulse.daily", avatar: "", connected: true, followers: 89000 },
  { platform: "facebook" as const, handle: "TrendPulse News", avatar: "", connected: true, followers: 234000 },
  { platform: "tiktok" as const, handle: "@trendpulse", avatar: "", connected: false, followers: 0 },
  { platform: "reddit" as const, handle: "u/TrendPulseBot", avatar: "", connected: false, followers: 0 },
];

const autoPostRulesData = [
  { platform: "twitter" as const, threshold: 85, enabled: true, accounts: ["1"] },
  { platform: "instagram" as const, threshold: 90, enabled: false, accounts: ["2"] },
  { platform: "facebook" as const, threshold: 80, enabled: true, accounts: ["3"] },
];

const predictionsData = [
  {
    topic: "Quantum Computing Breakthrough",
    currentScore: 42,
    predictedPeak: 94,
    timeToTrend: "~3 hours",
    velocity: 8.5,
    platforms: ["twitter" as const, "reddit" as const],
    confidence: 89,
    dataPoints: [
      { time: "6h ago", score: 5 },
      { time: "5h ago", score: 8 },
      { time: "4h ago", score: 14 },
      { time: "3h ago", score: 22 },
      { time: "2h ago", score: 31 },
      { time: "1h ago", score: 38 },
      { time: "Now", score: 42 },
      { time: "+1h", score: 58 },
      { time: "+2h", score: 76 },
      { time: "+3h", score: 94 },
    ],
  },
  {
    topic: "New Sustainability Policy EU",
    currentScore: 35,
    predictedPeak: 88,
    timeToTrend: "~5 hours",
    velocity: 6.2,
    platforms: ["facebook" as const, "twitter" as const, "web" as const],
    confidence: 76,
    dataPoints: [
      { time: "6h ago", score: 3 },
      { time: "5h ago", score: 6 },
      { time: "4h ago", score: 11 },
      { time: "3h ago", score: 18 },
      { time: "2h ago", score: 24 },
      { time: "1h ago", score: 30 },
      { time: "Now", score: 35 },
      { time: "+1h", score: 45 },
      { time: "+2h", score: 58 },
      { time: "+3h", score: 72 },
    ],
  },
  {
    topic: "Viral Dance Challenge #MoveWithMe",
    currentScore: 58,
    predictedPeak: 99,
    timeToTrend: "~1 hour",
    velocity: 14.2,
    platforms: ["tiktok" as const, "instagram" as const],
    confidence: 95,
    dataPoints: [
      { time: "6h ago", score: 2 },
      { time: "5h ago", score: 8 },
      { time: "4h ago", score: 18 },
      { time: "3h ago", score: 30 },
      { time: "2h ago", score: 42 },
      { time: "1h ago", score: 52 },
      { time: "Now", score: 58 },
      { time: "+1h", score: 99 },
    ],
  },
  {
    topic: "African Startup Funding Record",
    currentScore: 28,
    predictedPeak: 82,
    timeToTrend: "~6 hours",
    velocity: 4.8,
    platforms: ["twitter" as const, "facebook" as const],
    confidence: 68,
    dataPoints: [
      { time: "6h ago", score: 2 },
      { time: "5h ago", score: 5 },
      { time: "4h ago", score: 9 },
      { time: "3h ago", score: 14 },
      { time: "2h ago", score: 20 },
      { time: "1h ago", score: 25 },
      { time: "Now", score: 28 },
      { time: "+1h", score: 35 },
      { time: "+2h", score: 48 },
      { time: "+3h", score: 62 },
    ],
  },
  {
    topic: "Celebrity NFT Art Collection Drop",
    currentScore: 51,
    predictedPeak: 91,
    timeToTrend: "~2 hours",
    velocity: 11.3,
    platforms: ["twitter" as const, "instagram" as const, "tiktok" as const],
    confidence: 83,
    dataPoints: [
      { time: "6h ago", score: 4 },
      { time: "5h ago", score: 10 },
      { time: "4h ago", score: 19 },
      { time: "3h ago", score: 28 },
      { time: "2h ago", score: 38 },
      { time: "1h ago", score: 46 },
      { time: "Now", score: 51 },
      { time: "+1h", score: 70 },
      { time: "+2h", score: 91 },
    ],
  },
];

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingNews = await ctx.db.query("news").first();
    if (existingNews) {
      return "Database already seeded";
    }

    // Seed news
    for (const item of newsData) {
      await ctx.db.insert("news", item);
    }

    // Seed trend timeline
    for (const item of trendTimelineData) {
      await ctx.db.insert("trendTimeline", item);
    }

    // Seed locations
    for (const item of locationData) {
      await ctx.db.insert("locations", item);
    }

    // Seed social accounts
    for (const item of socialAccountsData) {
      await ctx.db.insert("socialAccounts", item);
    }

    // Seed auto-post rules
    for (const item of autoPostRulesData) {
      await ctx.db.insert("autoPostRules", item);
    }

    // Seed predictions
    for (const item of predictionsData) {
      await ctx.db.insert("predictions", item);
    }

    return "Database seeded successfully";
  },
});

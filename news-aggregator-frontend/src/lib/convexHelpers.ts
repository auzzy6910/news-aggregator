import { Doc } from "../../convex/_generated/dataModel";
import { NewsItem } from "../types";

export function toNewsItem(doc: Doc<"news">): NewsItem {
  return {
    id: doc._id,
    title: doc.title,
    summary: doc.summary,
    aiDraft: doc.aiDraft,
    platform: doc.platform,
    category: doc.category,
    imageUrl: doc.imageUrl,
    videoUrl: doc.videoUrl,
    originalUrl: doc.originalUrl,
    author: doc.author,
    publishedAt: doc.publishedAt,
    location: {
      country: doc.locationCountry,
      region: doc.locationRegion,
    },
    metrics: {
      likes: doc.metricsLikes,
      shares: doc.metricsShares,
      comments: doc.metricsComments,
      velocity: doc.metricsVelocity,
    },
    trendScore: doc.trendScore,
    hashtags: doc.hashtags,
    isAutoPostEnabled: doc.isAutoPostEnabled,
    status: doc.status,
  };
}

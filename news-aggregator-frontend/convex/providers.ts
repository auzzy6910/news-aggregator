/**
 * External-service provider helpers used by the automation pipeline.
 *
 * Each provider is env-gated: if the required API key is missing, the helper
 * falls back to a deterministic stub so the pipeline can be exercised end to
 * end without real credentials.
 *
 * Configure real providers by setting environment variables in the Convex
 * dashboard (Settings → Environment Variables):
 *
 *   Video generation (choose one or more; first available is used):
 *     RUNWAY_API_KEY        — https://runwayml.com
 *     REPLICATE_API_TOKEN   — https://replicate.com
 *     PIKA_API_KEY          — https://pika.art
 *
 *   Clip combination:
 *     SHOTSTACK_API_KEY
 *     SHOTSTACK_ENV         — "stage" (default) or "v1"
 *
 *   Social posting:
 *     TWITTER_BEARER_TOKEN
 *     TIKTOK_ACCESS_TOKEN
 *     INSTAGRAM_ACCESS_TOKEN
 *     FACEBOOK_PAGE_ACCESS_TOKEN
 *     REDDIT_ACCESS_TOKEN, REDDIT_USER_AGENT
 */

export type VideoProvider = "runway" | "replicate" | "pika" | "stub";
export type SocialPlatform =
  | "twitter"
  | "tiktok"
  | "instagram"
  | "facebook"
  | "reddit";

export interface GeneratedClip {
  provider: VideoProvider;
  externalId?: string;
  clipUrl: string;
  durationSec: number;
}

export interface CombinedVideo {
  provider: "shotstack" | "stub";
  finalVideoUrl: string;
  durationSec: number;
  externalRenderId?: string;
}

export interface PostResult {
  platform: SocialPlatform;
  success: boolean;
  externalPostId?: string;
  postUrl?: string;
  message?: string;
  error?: string;
}

/* -------------------------------------------------------------------------- */
/* Video generation                                                           */
/* -------------------------------------------------------------------------- */

function pickVideoProvider(): VideoProvider {
  if (process.env.RUNWAY_API_KEY) return "runway";
  if (process.env.REPLICATE_API_TOKEN) return "replicate";
  if (process.env.PIKA_API_KEY) return "pika";
  return "stub";
}

export async function generateClip(
  prompt: string,
  index: number
): Promise<GeneratedClip> {
  const provider = pickVideoProvider();
  try {
    switch (provider) {
      case "runway":
        return await callRunway(prompt);
      case "replicate":
        return await callReplicate(prompt);
      case "pika":
        return await callPika(prompt);
      default:
        return stubClip(prompt, index);
    }
  } catch (err) {
    console.error(`[providers] ${provider} generateClip failed:`, err);
    return stubClip(prompt, index);
  }
}

function stubClip(prompt: string, index: number): GeneratedClip {
  const slug = encodeURIComponent(prompt.slice(0, 40));
  return {
    provider: "stub",
    externalId: `stub-${Date.now()}-${index}`,
    clipUrl: `https://stub.trendpulse.invalid/clips/${slug}-${index}.mp4`,
    durationSec: 6,
  };
}

async function callRunway(prompt: string): Promise<GeneratedClip> {
  const key = process.env.RUNWAY_API_KEY!;
  const res = await fetch("https://api.runwayml.com/v1/text_to_video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "X-Runway-Version": "2024-11-06",
    },
    body: JSON.stringify({
      promptText: prompt,
      model: "gen3a_turbo",
      duration: 5,
      ratio: "9:16",
    }),
  });
  if (!res.ok) throw new Error(`Runway ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { id: string; output?: string[] };
  return {
    provider: "runway",
    externalId: data.id,
    clipUrl: data.output?.[0] ?? "",
    durationSec: 5,
  };
}

async function callReplicate(prompt: string): Promise<GeneratedClip> {
  const key = process.env.REPLICATE_API_TOKEN!;
  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version:
        "9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      input: { prompt, num_frames: 24, fps: 6 },
    }),
  });
  if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    id: string;
    output?: string | string[];
  };
  const out = Array.isArray(data.output) ? data.output[0] : data.output;
  return {
    provider: "replicate",
    externalId: data.id,
    clipUrl: out ?? "",
    durationSec: 4,
  };
}

async function callPika(prompt: string): Promise<GeneratedClip> {
  const key = process.env.PIKA_API_KEY!;
  const res = await fetch("https://api.pika.art/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, duration: 5, aspect_ratio: "9:16" }),
  });
  if (!res.ok) throw new Error(`Pika ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { id: string; video_url?: string };
  return {
    provider: "pika",
    externalId: data.id,
    clipUrl: data.video_url ?? "",
    durationSec: 5,
  };
}

/* -------------------------------------------------------------------------- */
/* Clip combination (Shotstack)                                               */
/* -------------------------------------------------------------------------- */

export async function combineClips(
  clipUrls: string[],
  title: string
): Promise<CombinedVideo> {
  const key = process.env.SHOTSTACK_API_KEY;
  if (!key || clipUrls.length === 0) {
    return {
      provider: "stub",
      finalVideoUrl: `https://stub.trendpulse.invalid/final/${encodeURIComponent(
        title.slice(0, 40)
      )}.mp4`,
      durationSec: clipUrls.length * 5 || 15,
    };
  }
  try {
    const env = process.env.SHOTSTACK_ENV || "stage";
    const tracks = [
      {
        clips: clipUrls.map((url, i) => ({
          asset: { type: "video", src: url },
          start: i * 5,
          length: 5,
          transition: { in: "fade", out: "fade" },
        })),
      },
    ];
    const res = await fetch(
      `https://api.shotstack.io/${env}/render`,
      {
        method: "POST",
        headers: { "x-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          timeline: { tracks },
          output: { format: "mp4", resolution: "hd" },
        }),
      }
    );
    if (!res.ok)
      throw new Error(`Shotstack ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { response?: { id: string } };
    const renderId = data.response?.id ?? "";
    return {
      provider: "shotstack",
      finalVideoUrl: `https://cdn.shotstack.io/au/${env}/${renderId}.mp4`,
      durationSec: clipUrls.length * 5,
      externalRenderId: renderId,
    };
  } catch (err) {
    console.error("[providers] Shotstack combineClips failed:", err);
    return {
      provider: "stub",
      finalVideoUrl: `https://stub.trendpulse.invalid/final/${encodeURIComponent(
        title.slice(0, 40)
      )}.mp4`,
      durationSec: clipUrls.length * 5 || 15,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Social posting                                                             */
/* -------------------------------------------------------------------------- */

export interface SocialPostInput {
  platform: SocialPlatform;
  account: string;
  message: string;
  videoUrl?: string;
  imageUrl?: string;
  originalUrl?: string;
  hashtags: string[];
}

export async function postToPlatform(
  input: SocialPostInput
): Promise<PostResult> {
  try {
    switch (input.platform) {
      case "twitter":
        return await postTwitter(input);
      case "tiktok":
        return await postTikTok(input);
      case "instagram":
        return await postInstagram(input);
      case "facebook":
        return await postFacebook(input);
      case "reddit":
        return await postReddit(input);
    }
  } catch (err) {
    return {
      platform: input.platform,
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function stubPost(input: SocialPostInput): PostResult {
  const id = `stub-${input.platform}-${Date.now()}`;
  return {
    platform: input.platform,
    success: true,
    externalPostId: id,
    postUrl: `https://stub.trendpulse.invalid/${input.platform}/${id}`,
    message: `(stub) Would post to ${input.platform}: ${input.message.slice(0, 60)}`,
  };
}

async function postTwitter(i: SocialPostInput): Promise<PostResult> {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) return stubPost(i);
  const body = buildMessage(i, 280);
  const res = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: body }),
  });
  if (!res.ok) throw new Error(`Twitter ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { data?: { id: string } };
  const id = data.data?.id ?? "";
  return {
    platform: "twitter",
    success: true,
    externalPostId: id,
    postUrl: id ? `https://twitter.com/i/status/${id}` : undefined,
    message: body,
  };
}

async function postTikTok(i: SocialPostInput): Promise<PostResult> {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token || !i.videoUrl) return stubPost(i);
  const res = await fetch(
    "https://open.tiktokapis.com/v2/post/publish/video/init/",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_info: {
          title: buildMessage(i, 150),
          privacy_level: "PUBLIC_TO_EVERYONE",
        },
        source_info: {
          source: "PULL_FROM_URL",
          video_url: i.videoUrl,
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`TikTok ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    data?: { publish_id?: string };
  };
  return {
    platform: "tiktok",
    success: true,
    externalPostId: data.data?.publish_id,
    message: i.message,
  };
}

async function postInstagram(i: SocialPostInput): Promise<PostResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;
  if (!token || !igUserId) return stubPost(i);
  const mediaUrl = i.videoUrl || i.imageUrl;
  if (!mediaUrl) return stubPost(i);
  const createRes = await fetch(
    `https://graph.facebook.com/v19.0/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [i.videoUrl ? "video_url" : "image_url"]: mediaUrl,
        caption: buildMessage(i, 2000),
        media_type: i.videoUrl ? "REELS" : "IMAGE",
        access_token: token,
      }),
    }
  );
  if (!createRes.ok)
    throw new Error(`Instagram ${createRes.status}: ${await createRes.text()}`);
  const { id: creationId } = (await createRes.json()) as { id: string };
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: creationId, access_token: token }),
    }
  );
  if (!publishRes.ok)
    throw new Error(
      `Instagram publish ${publishRes.status}: ${await publishRes.text()}`
    );
  const published = (await publishRes.json()) as { id: string };
  return {
    platform: "instagram",
    success: true,
    externalPostId: published.id,
    message: i.message,
  };
}

async function postFacebook(i: SocialPostInput): Promise<PostResult> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!token || !pageId) return stubPost(i);
  const endpoint = i.videoUrl
    ? `https://graph-video.facebook.com/v19.0/${pageId}/videos`
    : `https://graph.facebook.com/v19.0/${pageId}/feed`;
  const payload: Record<string, string> = {
    access_token: token,
    message: buildMessage(i, 5000),
  };
  if (i.videoUrl) payload.file_url = i.videoUrl;
  if (i.originalUrl && !i.videoUrl) payload.link = i.originalUrl;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Facebook ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { id?: string; post_id?: string };
  const id = data.post_id || data.id || "";
  return {
    platform: "facebook",
    success: true,
    externalPostId: id,
    postUrl: id ? `https://facebook.com/${id}` : undefined,
    message: i.message,
  };
}

async function postReddit(i: SocialPostInput): Promise<PostResult> {
  const token = process.env.REDDIT_ACCESS_TOKEN;
  const subreddit = process.env.REDDIT_SUBREDDIT || i.account;
  if (!token || !subreddit) return stubPost(i);
  const ua = process.env.REDDIT_USER_AGENT || "trendpulse/1.0";
  const form = new URLSearchParams({
    sr: subreddit.replace(/^r\//, ""),
    kind: i.originalUrl ? "link" : "self",
    title: buildMessage(i, 300),
    ...(i.originalUrl ? { url: i.originalUrl } : { text: i.message }),
    api_type: "json",
  });
  const res = await fetch("https://oauth.reddit.com/api/submit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": ua,
    },
    body: form.toString(),
  });
  if (!res.ok) throw new Error(`Reddit ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    json?: { data?: { url?: string; name?: string } };
  };
  return {
    platform: "reddit",
    success: true,
    externalPostId: data.json?.data?.name,
    postUrl: data.json?.data?.url,
    message: i.message,
  };
}

function buildMessage(i: SocialPostInput, maxLen: number): string {
  const tags = i.hashtags
    .slice(0, 5)
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .join(" ");
  const parts = [i.message, tags, i.originalUrl].filter(Boolean) as string[];
  let out = parts.join("\n\n");
  if (out.length > maxLen) out = `${out.slice(0, maxLen - 1)}…`;
  return out;
}

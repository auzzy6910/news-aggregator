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
 *   Narration / TTS (choose one or more; first available is used):
 *     ELEVENLABS_API_KEY    — https://elevenlabs.io
 *     ELEVENLABS_VOICE_ID   — optional; defaults to "Rachel" (21m00Tcm4TlvDq8ikWAM)
 *     OPENAI_API_KEY        — https://platform.openai.com
 *     OPENAI_TTS_VOICE      — optional; defaults to "alloy"
 *     OPENAI_TTS_MODEL      — optional; defaults to "tts-1"
 *     GOOGLE_TTS_API_KEY    — Google Cloud TTS API key
 *     GOOGLE_TTS_VOICE      — optional; defaults to "en-US-Neural2-F"
 *
 *   Social posting:
 *     TWITTER_BEARER_TOKEN
 *     TIKTOK_ACCESS_TOKEN
 *     INSTAGRAM_ACCESS_TOKEN
 *     FACEBOOK_PAGE_ACCESS_TOKEN
 *     REDDIT_ACCESS_TOKEN, REDDIT_USER_AGENT
 */

export type VideoProvider = "runway" | "replicate" | "pika" | "stub";
export type NarrationProvider = "elevenlabs" | "openai" | "google" | "stub";
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

/**
 * Result of a TTS call. Real providers return raw audio bytes which the
 * orchestrator uploads to Convex file storage; the stub provider returns
 * a pre-baked fake URL.
 */
export interface NarrationResult {
  provider: NarrationProvider;
  /** Raw audio bytes, when a real provider synthesised audio. */
  audioBytes?: ArrayBuffer;
  contentType: string;
  /** Stub URL when no provider was available. */
  stubUrl?: string;
  /** Best-effort estimate; real duration is measured when the file is combined. */
  durationSec: number;
  voice?: string;
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
  title: string,
  narrationUrl?: string
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
    const tracks: Array<Record<string, unknown>> = [
      {
        clips: clipUrls.map((url, i) => ({
          asset: { type: "video", src: url },
          start: i * 5,
          length: 5,
          transition: { in: "fade", out: "fade" },
        })),
      },
    ];
    const totalLength = clipUrls.length * 5;
    const timeline: Record<string, unknown> = { tracks };
    if (narrationUrl) {
      // Dedicated audio track so the narration mixes with clip audio rather
      // than replacing it. Shotstack trims to the shorter of video/audio.
      tracks.push({
        clips: [
          {
            asset: { type: "audio", src: narrationUrl },
            start: 0,
            length: totalLength,
          },
        ],
      });
    }
    const res = await fetch(
      `https://api.shotstack.io/${env}/render`,
      {
        method: "POST",
        headers: { "x-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          timeline,
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

/* -------------------------------------------------------------------------- */
/* Narration / TTS                                                            */
/* -------------------------------------------------------------------------- */

function pickNarrationProvider(): NarrationProvider {
  if (process.env.ELEVENLABS_API_KEY) return "elevenlabs";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GOOGLE_TTS_API_KEY) return "google";
  return "stub";
}

/**
 * Generate narration audio for the given text. Mirrors the video-provider
 * pattern: first available API key wins; otherwise falls back to a deterministic
 * stub so the pipeline runs end to end.
 *
 * Real providers return raw audio bytes — the caller is expected to upload
 * them to Convex file storage and pass the resulting public URL to
 * `combineClips`.
 */
export async function generateNarration(
  text: string
): Promise<NarrationResult> {
  const provider = pickNarrationProvider();
  try {
    switch (provider) {
      case "elevenlabs":
        return await callElevenLabs(text);
      case "openai":
        return await callOpenAITTS(text);
      case "google":
        return await callGoogleTTS(text);
      default:
        return stubNarration(text);
    }
  } catch (err) {
    console.error(`[providers] ${provider} generateNarration failed:`, err);
    return stubNarration(text);
  }
}

function stubNarration(text: string): NarrationResult {
  const slug = encodeURIComponent(text.slice(0, 40));
  // ~150 words per minute → rough duration estimate
  const words = text.split(/\s+/).filter(Boolean).length;
  const durationSec = Math.max(5, Math.round((words / 150) * 60));
  return {
    provider: "stub",
    contentType: "audio/mpeg",
    stubUrl: `https://stub.trendpulse.invalid/narration/${slug}.mp3`,
    durationSec,
  };
}

async function callElevenLabs(text: string): Promise<NarrationResult> {
  const key = process.env.ELEVENLABS_API_KEY!;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  if (!res.ok)
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const audioBytes = await res.arrayBuffer();
  const words = text.split(/\s+/).filter(Boolean).length;
  return {
    provider: "elevenlabs",
    audioBytes,
    contentType: "audio/mpeg",
    durationSec: Math.max(5, Math.round((words / 150) * 60)),
    voice: voiceId,
  };
}

async function callOpenAITTS(text: string): Promise<NarrationResult> {
  const key = process.env.OPENAI_API_KEY!;
  const voice = process.env.OPENAI_TTS_VOICE || "alloy";
  const model = process.env.OPENAI_TTS_MODEL || "tts-1";
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input: text, voice, response_format: "mp3" }),
  });
  if (!res.ok) throw new Error(`OpenAI TTS ${res.status}: ${await res.text()}`);
  const audioBytes = await res.arrayBuffer();
  const words = text.split(/\s+/).filter(Boolean).length;
  return {
    provider: "openai",
    audioBytes,
    contentType: "audio/mpeg",
    durationSec: Math.max(5, Math.round((words / 150) * 60)),
    voice,
  };
}

async function callGoogleTTS(text: string): Promise<NarrationResult> {
  const key = process.env.GOOGLE_TTS_API_KEY!;
  const voiceName = process.env.GOOGLE_TTS_VOICE || "en-US-Neural2-F";
  const languageCode = voiceName.split("-").slice(0, 2).join("-");
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(
      key
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode, name: voiceName },
        audioConfig: { audioEncoding: "MP3" },
      }),
    }
  );
  if (!res.ok)
    throw new Error(`Google TTS ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { audioContent?: string };
  if (!data.audioContent) throw new Error("Google TTS returned no audioContent");
  const audioBytes = base64ToArrayBuffer(data.audioContent);
  const words = text.split(/\s+/).filter(Boolean).length;
  return {
    provider: "google",
    audioBytes,
    contentType: "audio/mpeg",
    durationSec: Math.max(5, Math.round((words / 150) * 60)),
    voice: voiceName,
  };
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function buildNarrationText(news: {
  title: string;
  summary?: string;
  aiDraft?: string;
}): string {
  const base = news.aiDraft || news.summary || news.title;
  const combined = news.summary
    ? `${news.title}. ${base}`
    : base;
  // TTS providers generally charge per character; keep narrations tight.
  const MAX = 800;
  const text = combined.replace(/\s+/g, " ").trim();
  if (text.length <= MAX) return text;
  return `${text.slice(0, MAX - 1)}…`;
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

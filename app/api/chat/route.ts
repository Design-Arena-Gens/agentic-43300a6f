import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/constants";

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
  meta: z
    .object({
      actionItems: z.array(z.string()).optional(),
      followUp: z.string().nullable().optional(),
      sentiment: z.enum(["positive", "neutral", "negative"]).optional()
    })
    .optional()
});

const payloadSchema = z.object({
  messages: z.array(messageSchema).min(1),
  visitorProfile: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      company: z.string().optional(),
      intent: z.string().optional()
    })
    .optional()
});

const FALLBACK_RESPONSES = [
  "I'm currently operating in demo mode, but I'd still love to help you out. Could you share your name and what brings you in today?",
  "Thanks for stopping by! While the live AI is offline, we can still capture your details and route you to the right teammate.",
  "Appreciate your patience—our concierge AI is warming up. Drop a short summary of what you need and we'll follow up ASAP."
];

function fallbackReply(): string {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

function buildMessages(
  messages: z.infer<typeof messageSchema>[],
  visitorProfile?: Record<string, unknown>
) {
  const visitorPrimer = visitorProfile
    ? `Current visitor profile:\n${JSON.stringify(visitorProfile, null, 2)}`
    : "No visitor metadata yet.";

  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "system",
      content: visitorPrimer
    },
    ...messages.map(({ role, content }) => ({ role: role as "user" | "assistant", content }))
  ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid payload.",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply: `${fallbackReply()}\n\n> Tip: Add an \`OPENAI_API_KEY\` environment variable to unlock live intelligence.`,
      meta: {
        followUp: "Collect visitor contact details manually and notify the concierge team."
      }
    });
  }

  const { messages, visitorProfile } = parsed.data;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const completion = await openai.chat.completions.create({
      temperature: 0.3,
      model: "gpt-4o-mini",
      messages: buildMessages(messages, visitorProfile),
      max_tokens: 600
    });

    const responseMessage = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({
      reply:
        responseMessage ??
        "I'm here and ready to help! Could you share a few more details so we can assist effectively?"
    });
  } catch (error) {
    console.error("Chat endpoint error", error);
    return NextResponse.json(
      {
        reply: fallbackReply(),
        meta: {
          followUp:
            "The AI channel timed out. Forward the visitor's latest message to the human concierge."
        }
      },
      { status: 500 }
    );
  }
}

import { Idea, UserProfile } from '../types';

export const sendToWebhook = async (ideas: Idea[], user: UserProfile) => {
  if (!user.webhookUrl) {
    throw new Error("Webhook URL is not configured.");
  }

  const payload = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.companyName
    },
    ideas: ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      language: idea.language,
      topic: idea.topic,
      generatedAt: idea.generatedAt
    })),
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(user.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Webhook Error:", error);
    throw error;
  }
};

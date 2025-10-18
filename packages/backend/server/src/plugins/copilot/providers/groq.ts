import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

import { OpenAIProvider } from './openai';
import { CopilotProviderType, ModelInputType, ModelOutputType } from './types';

export type GroqConfig = {
  apiKey: string;
  baseURL?: string;
};

const ModelListSchema = z.object({
  data: z.array(z.object({ id: z.string() })),
});

export class GroqProvider extends OpenAIProvider {
  override readonly models = [
    // Production Models
    {
      id: 'llama-3.1-8b-instant',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [
            ModelOutputType.Text,
            ModelOutputType.Object,
            ModelOutputType.Structured,
          ],
          defaultForOutputType: true,
        },
      ],
    },
    {
      id: 'llama-3.1-70b-versatile',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [
            ModelOutputType.Text,
            ModelOutputType.Object,
            ModelOutputType.Structured,
          ],
        },
      ],
    },
    {
      id: 'llama-3.3-70b-versatile',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [
            ModelOutputType.Text,
            ModelOutputType.Object,
            ModelOutputType.Structured,
          ],
        },
      ],
    },
    {
      id: 'llama-3.3-70b-specdec',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [
            ModelOutputType.Text,
            ModelOutputType.Object,
            ModelOutputType.Structured,
          ],
        },
      ],
    },
    {
      id: 'mixtral-8x7b-32768',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [
            ModelOutputType.Text,
            ModelOutputType.Object,
            ModelOutputType.Structured,
          ],
        },
      ],
    },
    {
      id: 'gemma2-9b-it',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [
            ModelOutputType.Text,
            ModelOutputType.Object,
            ModelOutputType.Structured,
          ],
        },
      ],
    },
    {
      id: 'gemma-7b-it',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [
            ModelOutputType.Text,
            ModelOutputType.Object,
            ModelOutputType.Structured,
          ],
        },
      ],
    },
    // Experimental Models
    {
      id: 'llama-3.2-1b-preview',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [ModelOutputType.Text],
        },
      ],
    },
    {
      id: 'llama-3.2-3b-preview',
      capabilities: [
        {
          input: [ModelInputType.Text],
          output: [ModelOutputType.Text],
        },
      ],
    },
    {
      id: 'llama-3.2-11b-vision-preview',
      capabilities: [
        {
          input: [ModelInputType.Text, ModelInputType.Image],
          output: [ModelOutputType.Text],
        },
      ],
    },
    {
      id: 'llama-3.2-90b-vision-preview',
      capabilities: [
        {
          input: [ModelInputType.Text, ModelInputType.Image],
          output: [ModelOutputType.Text],
        },
      ],
    },
    // Whisper for audio transcription
    {
      id: 'whisper-large-v3',
      capabilities: [
        {
          input: [ModelInputType.Audio],
          output: [ModelOutputType.Text],
        },
      ],
    },
    {
      id: 'whisper-large-v3-turbo',
      capabilities: [
        {
          input: [ModelInputType.Audio],
          output: [ModelOutputType.Text],
        },
      ],
    },
    // Distil-Whisper English
    {
      id: 'distil-whisper-large-v3-en',
      capabilities: [
        {
          input: [ModelInputType.Audio],
          output: [ModelOutputType.Text],
        },
      ],
    },
  ];

  override readonly type = CopilotProviderType.Groq as any;

  protected override setup() {
    // Call the base CopilotProvider setup method
    super.setup();

    // Create the OpenAI instance with Groq's base URL, overriding the parent's private instance
    (this as any)['#instance'] = createOpenAI({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL || 'https://api.groq.com/openai/v1',
    });
  }

  override async refreshOnlineModels() {
    if (!this.configured()) {
      return;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = ModelListSchema.safeParse(data);
        if (parsed.success) {
          this.onlineModelList = parsed.data.data.map(model => model.id);
        }
      }
    } catch (error) {
      this.logger.warn('Failed to fetch Groq models:', error);
    }
  }
}

import { AiTool } from './types';

export const INITIAL_TOOLS: AiTool[] = [
  {
    id: '1',
    name: 'Jasper',
    description: 'An AI writing assistant that helps you create high-quality content faster. Great for blog posts, social media, and marketing copy.',
    category: 'Writing & Copy',
    url: 'https://www.jasper.ai',
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'Generates realistic and artistic images from natural language descriptions. Perfect for designers and artists needing inspiration.',
    category: 'Image Generation',
    url: 'https://www.midjourney.com',
  },
  {
    id: '3',
    name: 'Synthesia',
    description: 'Create professional AI videos from text in multiple languages. No camera or actors needed.',
    category: 'Video Creation',
    url: 'https://www.synthesia.io',
  },
  {
    id: '4',
    name: 'Otter.ai',
    description: 'AI meeting assistant that records audio, writes notes, captures slides, and generates summaries.',
    category: 'Productivity',
    url: 'https://otter.ai',
  },
  {
    id: '5',
    name: 'GitHub Copilot',
    description: 'Your AI pair programmer. Uses OpenAI Codex to suggest code and entire functions in real-time right from your editor.',
    category: 'Developer Tools',
    url: 'https://github.com/features/copilot',
  }
];
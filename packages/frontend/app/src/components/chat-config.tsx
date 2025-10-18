import { Menu, MenuItem, MenuSeparator, MenuSub, Switch } from '@afk/component';
import {
  AiIcon,
  CodeIcon,
  MakeItRealIcon,
  PageIcon,
  SelectionIcon,
  ThinkingIcon,
  WebIcon,
} from '@blocksuite/icons/rc';
import type { Dispatch, SetStateAction } from 'react';

import { GeminiIcon } from '@/icons/gemini';
import { GroqIcon } from '@/icons/groq';

// Helper function to check if a provider has credentials
// TODO: Replace with actual credential checking from backend
const hasCredentials = (provider: string): boolean => {
  // For now, assume Gemini models are available (using default API key)
  // and Groq models need user-provided credentials
  if (provider === 'gemini') return true; // TODO: Check actual credentials
  if (provider === 'groq') return true; // TODO: Check actual credentials
  return true;
};

export const tempModels = [
  // Default model - Gemini 2.5 Flash Lite
  {
    label: 'Gemini 2.5 Flash Lite',
    value: 'gemini-2.5-flash-lite',
    icon: <GeminiIcon />,
    provider: 'gemini',
    disabled: !hasCredentials('gemini'),
  },
  {
    label: 'Gemini 2.5 Pro',
    value: 'gemini-2.5-pro',
    icon: <GeminiIcon />,
    provider: 'gemini',
    disabled: !hasCredentials('gemini'),
  },
  {
    label: 'Gemini 2.5 Flash',
    value: 'gemini-2.5-flash',
    icon: <GeminiIcon />,
    provider: 'gemini',
    disabled: !hasCredentials('gemini'),
  },
  // Groq models
  {
    label: 'Llama 3.1 8B Instant',
    value: 'llama-3.1-8b-instant',
    icon: <GroqIcon />,
    provider: 'groq',
    disabled: !hasCredentials('groq'),
  },
  {
    label: 'Llama 3.1 70B Versatile',
    value: 'llama-3.1-70b-versatile',
    icon: <GroqIcon />,
    provider: 'groq',
    disabled: !hasCredentials('groq'),
  },
  {
    label: 'Llama 3.3 70B Versatile',
    value: 'llama-3.3-70b-versatile',
    icon: <GroqIcon />,
    provider: 'groq',
    disabled: !hasCredentials('groq'),
  },
  {
    label: 'Llama 3.3 70B SpecDec',
    value: 'llama-3.3-70b-specdec',
    icon: <GroqIcon />,
    provider: 'groq',
    disabled: !hasCredentials('groq'),
  },
  {
    label: 'Mixtral 8x7B',
    value: 'mixtral-8x7b-32768',
    icon: <GroqIcon />,
    provider: 'groq',
    disabled: !hasCredentials('groq'),
  },
  {
    label: 'Gemma2 9B IT',
    value: 'gemma2-9b-it',
    icon: <GroqIcon />,
    provider: 'groq',
    disabled: !hasCredentials('groq'),
  },
  {
    label: 'Gemma 7B IT',
    value: 'gemma-7b-it',
    icon: <GroqIcon />,
    provider: 'groq',
    disabled: !hasCredentials('groq'),
  },
  // Commented out non-Gemini models
  // {
  //   label: 'Claude Sonnet 4',
  //   value: 'claude-sonnet-4@20250514',
  //   icon: <ClaudeIcon />,
  // },
  // { label: 'GPT-5', value: 'gpt-5', icon: <ChatGPTIcon /> },
  // { label: 'o4 Mini', value: 'o4-mini', icon: <ChatGPTIcon /> },
];

export const configurableTools = [
  {
    label: 'Code Artifact',
    icon: <CodeIcon />,
    value: 'codeArtifact',
  },
  {
    label: 'Make It Real',
    icon: <MakeItRealIcon />,
    value: 'makeItReal',
  },
  {
    label: 'Doc Compose',
    icon: <PageIcon />,
    value: 'docCompose',
  },
  {
    label: 'Web Search',
    icon: <WebIcon />,
    value: 'webSearch',
  },
  // {
  //   label: 'Web Crawl',
  //   icon: <WebIcon />,
  //   value: 'web_crawl_exa',
  // },
  // {
  //   label: 'Todo',
  // },
  {
    label: 'Python',
    icon: <CodeIcon />,
    value: ['pythonCoding', 'pythonSandbox'],
  },
  {
    label: 'Browser Use',
    icon: <SelectionIcon />,
    value: 'browserUse',
  },
  {
    label: 'Task Analysis',
    icon: <ThinkingIcon />,
    value: 'taskAnalysis',
  },
];

export const defaultTools = [
  'conversationSummary',
  'todoList',
  'markTodo',
  'docEdit',
  'choose',
  ...configurableTools.map(tool => tool.value).flat(),
];

export const ChatConfigMenu = ({
  model,
  setModel,
  children,
  tools,
  setTools,
}: {
  children: React.ReactNode;
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
  tools: string[];
  setTools: Dispatch<SetStateAction<string[]>>;
}) => {
  return (
    <Menu
      contentOptions={{
        style: { padding: 0 },
      }}
      items={
        <div>
          <div className="flex flex-col px-2 pt-2">
            <MenuSub
              items={tempModels.map(m => (
                <MenuItem
                  key={m.value}
                  onClick={() => !m.disabled && setModel(m.value)}
                  prefixIcon={m.icon}
                  selected={model === m.value}
                  disabled={m.disabled}
                  style={{
                    opacity: m.disabled ? 0.5 : 1,
                    cursor: m.disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{m.label}</span>
                    {m.disabled && (
                      <span className="text-xs text-gray-500 ml-2">
                        No API Key
                      </span>
                    )}
                  </div>
                </MenuItem>
              ))}
              triggerOptions={{
                prefixIcon: <AiIcon />,
              }}
              subContentOptions={{
                sideOffset: 14,
                alignOffset: -8,
              }}
            >
              Foundation Model
            </MenuSub>
          </div>
          <MenuSeparator />
          <div className="flex flex-col gap-1 items-stretch px-2 pb-2 w-full">
            {configurableTools.map(tool => {
              const toolNames = Array.isArray(tool.value)
                ? tool.value
                : [tool.value];
              const isEnabled = toolNames.every(name => tools.includes(name));
              return (
                <div
                  className="flex gap-2 items-center w-full"
                  style={{ minWidth: 'min(100vw, 300px)' }}
                  key={tool.label}
                >
                  <div className="size-6 text-xl text-icon-primary flex items-center justify-center">
                    {tool.icon}
                  </div>
                  <div className="flex-1">{tool.label}</div>
                  <Switch
                    size={20}
                    checked={isEnabled}
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    onChange={checked => {
                      if (checked) {
                        setTools(prev =>
                          Array.from(new Set([...prev, ...toolNames]))
                        );
                      } else {
                        setTools(prev =>
                          prev.filter(name => !toolNames.includes(name))
                        );
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      {children}
    </Menu>
  );
};

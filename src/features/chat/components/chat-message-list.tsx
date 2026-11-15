
"use client";

import type { UIMessage } from "ai";

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export function ChatMessageList({
  messages,
  isLoading,
}: ChatMessageListProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      {messages.length === 0 && (
        <div className="m-auto max-w-md text-center">
          <h2 className="text-xl font-semibold">
            Welcome to Todo AI
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask me to create, update, delete, or find your tasks.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "border bg-card"
            }`}
          >
            {message.parts.map((part, index) => {
              if (part.type !== "text") return null;

              return (
                <p key={`${message.id}-${index}`} className="whitespace-pre-wrap">
                  {part.text}
                </p>
              );
            })}
          </div>
        </div>
      ))}

      {isLoading && (
        <p className="text-sm text-muted-foreground">
          AI is thinking...
        </p>
      )}
    </div>
  );
}


"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send, Square } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSubmit: (message: string) => Promise<void>;
  onStop: () => void;
  isLoading: boolean;
}

export function ChatInput({
  onSubmit,
  onStop,
  isLoading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) return;

    setMessage("");
    await onSubmit(trimmedMessage);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Todo AI anything..."
          rows={1}
          disabled={isLoading}
          className="max-h-40 min-h-11 flex-1 resize-y rounded-lg border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

        {isLoading ? (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onStop}
            aria-label="Stop generating"
          >
            <Square size={16} />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim()}
            aria-label="Send message"
          >
            <Send size={16} />
          </Button>
        )}
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
}

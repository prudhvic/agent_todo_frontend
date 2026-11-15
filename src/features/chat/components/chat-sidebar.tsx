
"use client";

import { useState } from "react";
import {
    MessageSquare,
    Plus,
    Loader2,
    Pencil,
    Check,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Conversation } from "../types/chat.types";

interface ChatSidebarProps {
    conversations: Conversation[];
    threadId: string | null;
    isLoading: boolean;
    onNewChat: () => void;
    onSelectConversation: (id: string) => Promise<void>;
    onRenameConversation: (id: string, title: string) => Promise<void>;
}

export function ChatSidebar({
    conversations,
    threadId,
    isLoading,
    onNewChat,
    onSelectConversation,
    onRenameConversation,
}: ChatSidebarProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const startEditing = (conversation: Conversation) => {
        setEditingId(conversation.id);
        setEditedTitle(conversation.title || "");
    };

    const saveTitle = async (id: string) => {
        if (!editedTitle.trim() || isSaving) return;

        try {
            setIsSaving(true);
            await onRenameConversation(id, editedTitle);
            setEditingId(null);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-muted/20">
            <div className="border-b p-4">
                <Button className="w-full" onClick={onNewChat}>
                    <Plus className="mr-2 size-4" />
                    New Chat
                </Button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
                <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recent conversations
                </h3>

                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="size-5 animate-spin" />
                    </div>
                ) : conversations.length === 0 ? (
                    <p className="px-2 py-4 text-sm text-muted-foreground">
                        No conversations yet.
                    </p>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`flex items-center gap-2 rounded-lg px-2 py-2 ${
                                threadId === conversation.id
                                    ? "bg-accent"
                                    : "hover:bg-accent/50"
                            }`}
                        >
                            <MessageSquare className="size-4 shrink-0" />

                            {editingId === conversation.id ? (
                                <>
                                    <input
                                        autoFocus
                                        value={editedTitle}
                                        onChange={(event) =>
                                            setEditedTitle(event.target.value)
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                void saveTitle(conversation.id);
                                            }
                                            if (event.key === "Escape") {
                                                setEditingId(null);
                                            }
                                        }}
                                        className="min-w-0 flex-1 rounded border bg-background px-2 py-1 text-sm"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => void saveTitle(conversation.id)}
                                        disabled={isSaving || !editedTitle.trim()}
                                        aria-label="Save title"
                                    >
                                        <Check className="size-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        aria-label="Cancel editing"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void onSelectConversation(conversation.id)
                                        }
                                        className="min-w-0 flex-1 truncate text-left text-sm"
                                    >
                                        {conversation.title || "New conversation"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => startEditing(conversation)}
                                        aria-label="Rename conversation"
                                        className="shrink-0 text-muted-foreground hover:text-foreground"
                                    >
                                        <Pencil className="size-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}

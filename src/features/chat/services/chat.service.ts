
import { DefaultChatTransport } from "ai";
import { apiClient } from "@/lib/api/client";

import type {
    ChatDecisionRequest,
    ChatResponse,
    ChatHistoryResponse,
} from "../types/chat.types";

export function createChatTransport() {
    return new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_API_URL}/chat/stream`,

        headers: (): Record<string, string> => {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("access_token")
                    : null;

            if (!token) return {};

            return {
                Authorization: `Bearer ${token}`,
            };
        },

        prepareSendMessagesRequest: ({ messages, body }) => {
            const lastMessage = messages[messages.length - 1];

            const message = lastMessage?.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");

            return {
                body: {
                    message,
                    thread_id: body?.thread_id ?? null,
                },
            };
        },
    });
}

export async function submitChatDecision(
    payload: ChatDecisionRequest
): Promise<ChatResponse> {
    const { data } = await apiClient.post<ChatResponse>(
        "/chat/decision",
        payload
    );

    return data;
}

// Get all conversations belonging to the current user.
export interface Conversation {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export async function getConversations(): Promise<Conversation[]> {
    const { data } = await apiClient.get<{
        conversations: Conversation[];
        total: number;
        limit: number;
        offset: number;
    }>("/chat/conversations");

    return data.conversations;
}
// Get messages from a selected conversation.
export async function getChatHistory(
    threadId: string
): Promise<ChatHistoryResponse> {
    const { data } = await apiClient.get<ChatHistoryResponse>(
        `/chat/history/${threadId}`
    );

    return data;
}


export async function renameConversation(
    threadId: string,
    title: string
): Promise<void> {
    await apiClient.patch(`/chat/conversations/${threadId}`, {
        title,
    });
}
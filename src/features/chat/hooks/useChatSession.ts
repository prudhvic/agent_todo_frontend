
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

import {
    createChatTransport,
    submitChatDecision,
    getConversations,
    getChatHistory,
    renameConversation,
} from "../services/chat.service";

import type {
    Conversation,
    ChatApproval,
    ChatDecision,
    HITLInterrupt,
} from "../types/chat.types";

export function useChatSession() {
    // Conversation state
    const [threadId, setThreadId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    // HITL state
    const [approval, setApproval] = useState<HITLInterrupt | null>(null);
    const [isDecisionSubmitting, setIsDecisionSubmitting] = useState(false);

    const transport = useMemo(() => createChatTransport(), []);

    // Handle approval events received from streaming.
    const handleApprovalEvent = useCallback((data: unknown) => {
        const event = data as ChatApproval;
        const pending = event.interrupts?.[0];

        if (pending) {
            setThreadId(event.thread_id);
            setApproval(pending);
        }
    }, []);

    const {
        messages,
        sendMessage,
        status,
        error,
        stop,
        setMessages,
    } = useChat({
        transport,
        onData: (dataPart) => {
            if (dataPart.type === "data-approval") {
                handleApprovalEvent(dataPart.data);
            }
        },
    });

    // Fetch conversations.
    const refreshConversations = useCallback(async () => {
        try {
            const data = await getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations:", error);
        }
    }, []);

    // Initial conversation loading.
    useEffect(() => {
        let cancelled = false;

        getConversations()
            .then((data) => {
                if (!cancelled) {
                    setConversations(data);
                }
            })
            .catch((error) => {
                console.error("Failed to load conversations:", error);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Send a message.
    const submitMessage = useCallback(
        async (text: string) => {
            const trimmedText = text.trim();

            if (
                !trimmedText ||
                status === "submitted" ||
                status === "streaming" ||
                isDecisionSubmitting
            ) {
                return;
            }

            const currentThreadId = threadId ?? crypto.randomUUID();

            if (!threadId) {
                setThreadId(currentThreadId);
            }

            setApproval(null);

            await sendMessage(
                { text: trimmedText },
                { body: { thread_id: currentThreadId } }
            );

            await refreshConversations();
        },
        [
            threadId,
            sendMessage,
            status,
            isDecisionSubmitting,
            refreshConversations,
        ]
    );

    // Submit HITL decisions.
    const submitDecision = useCallback(
        async (decision: ChatDecision) => {
            if (!threadId || !approval || isDecisionSubmitting) return;

            try {
                setIsDecisionSubmitting(true);

                const response = await submitChatDecision({
                    thread_id: threadId,
                    decisions: [decision],
                });

                setApproval(null);

                if (response.assistant_message) {
                    setMessages((previous) => [
                        ...previous,
                        {
                            id: crypto.randomUUID(),
                            role: "assistant",
                            parts: [
                                {
                                    type: "text",
                                    text: response.assistant_message,
                                },
                            ],
                        } as UIMessage,
                    ]);
                }

                if (response.pending_approvals?.length) {
                    setApproval(response.pending_approvals[0]);
                }

                await refreshConversations();
            } finally {
                setIsDecisionSubmitting(false);
            }
        },
        [
            threadId,
            approval,
            isDecisionSubmitting,
            setMessages,
            refreshConversations,
        ]
    );

    // Approve.
    const approve = useCallback(
        () => submitDecision({ type: "approve" }),
        [submitDecision]
    );

    // Reject.
    const reject = useCallback(
        () => submitDecision({ type: "reject" }),
        [submitDecision]
    );
    const renameChat = useCallback(
        async (selectedThreadId: string, title: string) => {
            const trimmedTitle = title.trim();

            if (!trimmedTitle) {
                throw new Error("Conversation title cannot be empty.");
            }

            await renameConversation(selectedThreadId, trimmedTitle);

            await refreshConversations();
        },
        [refreshConversations]
    );
    // Edit.
    const edit = useCallback(
        (editedAction: {
            name: string;
            args: Record<string, unknown>;
        }) =>
            submitDecision({
                type: "edit",
                edited_action: editedAction,
            }),
        [submitDecision]
    );

    // Load an existing conversation and restore pending approvals.
    const loadConversation = useCallback(
        async (selectedThreadId: string) => {
            if (
                status === "submitted" ||
                status === "streaming" ||
                isDecisionSubmitting
            ) {
                return;
            }

            try {
                setIsHistoryLoading(true);
                setApproval(null);

                const history = await getChatHistory(selectedThreadId);

                const restoredMessages: UIMessage[] =
                    history.messages.map((message) => ({
                        id: crypto.randomUUID(),
                        role: message.role,
                        parts: [
                            {
                                type: "text",
                                text: message.content,
                            },
                        ],
                    }));

                setMessages(restoredMessages);
                setThreadId(history.thread_id);

                // Restore pending HITL approval.
                setApproval(history.pending_approvals?.[0] ?? null);

            } catch (error) {
                console.error("Failed to load conversation:", error);
            } finally {
                setIsHistoryLoading(false);
            }
        },
        [status, isDecisionSubmitting, setMessages]
    );

    // Start a new conversation.
    const startNewConversation = useCallback(() => {
        if (
            status === "submitted" ||
            status === "streaming" ||
            isDecisionSubmitting
        ) {
            return;
        }

        setThreadId(null);
        setMessages([]);
        setApproval(null);
    }, [status, isDecisionSubmitting, setMessages]);

    return {
        // Messages
        messages,
        submitMessage,

        // Conversation management
        threadId,
        conversations,
        isHistoryLoading,
        loadConversation,
        startNewConversation,
        refreshConversations,

        // Streaming
        status,
        error,
        stop,

        // HITL
        approval,
        approve,
        reject,
        edit,
        isDecisionSubmitting,
        renameChat
    };
}

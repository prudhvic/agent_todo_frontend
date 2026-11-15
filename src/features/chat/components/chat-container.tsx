
"use client";

import { useChatSession } from "../hooks/useChatSession";
import { ChatHeader } from "./chat-header";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { ChatApproval } from "./chat-approval";
import { ChatSidebar } from "./chat-sidebar";

export function ChatContainer() {
    const {
        messages,
        submitMessage,
        status,
        error,
        stop,
        threadId,
        renameChat,
        approval,
        approve,
        reject,
        edit,
        isDecisionSubmitting,
        conversations,
        isHistoryLoading,
        loadConversation,
        startNewConversation,
    } = useChatSession();

    const isLoading =
        status === "submitted" || status === "streaming";

    return (
        <div className="flex h-full min-h-0 overflow-hidden rounded-xl border bg-background">
            <ChatSidebar
                conversations={conversations}
                threadId={threadId}
                isLoading={isHistoryLoading}
                onNewChat={startNewConversation}
                onSelectConversation={loadConversation}
                onRenameConversation={renameChat}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <ChatHeader />

                <ChatMessageList
                    messages={messages}
                    isLoading={isLoading || isDecisionSubmitting || isHistoryLoading}
                />

                {approval && (
                    <ChatApproval
                        approval={approval}
                        onApprove={approve}
                        onReject={reject}
                        onEdit={edit}
                        isSubmitting={isDecisionSubmitting}
                    />
                )}

                {error && (
                    <p className="px-4 py-2 text-sm text-destructive">
                        {error.message || "Something went wrong. Please try again."}
                    </p>
                )}

                <ChatInput
                    onSubmit={submitMessage}
                    onStop={stop}
                    isLoading={
                        isLoading ||
                        isDecisionSubmitting ||
                        isHistoryLoading ||
                        Boolean(approval)
                    }
                />

                {threadId && (
                    <p className="px-4 pb-2 text-xs text-muted-foreground">
                        Conversation: {threadId}
                    </p>
                )}
            </div>
        </div>
    );
}

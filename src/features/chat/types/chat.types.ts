
export interface ChatRequest {
    message: string;
    thread_id?: string;
}

export interface Conversation {
    id: string;
    title?: string;
    updated_at?: string;
}

export interface HITLActionRequest {
    name: string;
    args: Record<string, unknown>;
}

export interface HITLReviewConfig {
    action_name: string;
    allowed_decisions: ("approve" | "edit" | "reject")[];
}

export interface HITLInterrupt {
    action_requests: HITLActionRequest[];
    review_configs: HITLReviewConfig[];
}

export interface ChatApproval {
    interrupts: HITLInterrupt[];
    thread_id: string;
}

export interface ChatDecision {
    type: "approve" | "reject" | "edit";
    message?: string;
    edited_action?: {
        name: string;
        args: Record<string, unknown>;
    };
}

export interface ChatDecisionRequest {
    thread_id: string;
    decisions: ChatDecision[];
}

export interface ChatResponse {
    thread_id: string;
    assistant_message: string;
    pending_approvals: HITLInterrupt[];
}


export interface ChatHistoryMessage {
    role: "user" | "assistant";
    content: string;
}

export interface ChatHistoryResponse {
    thread_id: string;
    messages: ChatHistoryMessage[];
    pending_approvals: HITLInterrupt[];
}
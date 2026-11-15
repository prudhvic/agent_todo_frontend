
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { HITLInterrupt } from "../types/chat.types";

interface ChatApprovalProps {
    approval: HITLInterrupt;
    onApprove: () => Promise<void>;
    onReject: () => Promise<void>;
    onEdit: (editedAction: {
        name: string;
        args: Record<string, unknown>;
    }) => Promise<void>;
    isSubmitting: boolean;
}

export function ChatApproval({
    approval,
    onApprove,
    onReject,
    onEdit,
    isSubmitting,
}: ChatApprovalProps) {
    const [editing, setEditing] = useState(false);
    const [editedArgs, setEditedArgs] = useState("");
    const [editError, setEditError] = useState("");

    const action = approval.action_requests[0];

    if (!action) return null;

    const canEdit = approval.review_configs.some(
        (config) =>
            config.action_name === action.name &&
            config.allowed_decisions.includes("edit")
    );

    const startEditing = () => {
        setEditedArgs(JSON.stringify(action.args, null, 2));
        setEditError("");
        setEditing(true);
    };

    const submitEdit = async () => {
        try {
            const parsedArgs: unknown = JSON.parse(editedArgs);

            if (
                typeof parsedArgs !== "object" ||
                parsedArgs === null ||
                Array.isArray(parsedArgs)
            ) {
                setEditError("Arguments must be a JSON object.");
                return;
            }

            await onEdit({
                name: action.name,
                args: parsedArgs as Record<string, unknown>,
            });

            setEditing(false);
            setEditError("");
        } catch {
            setEditError("Please enter valid JSON.");
        }
    };

    return (
        <div className="mx-4 my-3 space-y-4 rounded-xl border bg-card p-4">
            <div>
                <h3 className="font-semibold">Approval required</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Review the proposed task operation before proceeding.
                </p>
            </div>

            <div className="rounded-lg bg-muted p-3">
                <p className="font-medium capitalize">
                    {action.name.replaceAll("_", " ")}
                </p>

                {editing ? (
                    <div className="mt-3 space-y-2">
                        <textarea
                            value={editedArgs}
                            onChange={(event) => {
                                setEditedArgs(event.target.value);
                                setEditError("");
                            }}
                            className="min-h-40 w-full rounded-md border bg-background p-3 font-mono text-xs"
                        />

                        {editError && (
                            <p className="text-sm text-destructive">
                                {editError}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <Button
                                onClick={submitEdit}
                                disabled={isSubmitting}
                            >
                                Submit Edit
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setEditing(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
                        {JSON.stringify(action.args, null, 2)}
                    </pre>
                )}
            </div>

            {!editing && (
                <div className="flex flex-wrap gap-2">
                    <Button onClick={onApprove} disabled={isSubmitting}>
                        Approve
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onReject}
                        disabled={isSubmitting}
                    >
                        Reject
                    </Button>

                    {canEdit && (
                        <Button
                            variant="outline"
                            onClick={startEditing}
                            disabled={isSubmitting}
                        >
                            Edit
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

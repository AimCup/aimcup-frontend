"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { syncParticipantsSpreadsheetAction } from "@/actions/admin/auctionActions";

export default function SyncSpreadsheetButton({ tournamentAbbreviation }: { tournamentAbbreviation: string }) {
    const [isSyncing, setIsSyncing] = useState(false);

    async function handleSync() {
        setIsSyncing(true);
        const result = await syncParticipantsSpreadsheetAction(tournamentAbbreviation);
        setIsSyncing(false);
        if (!result.status) {
            toast.error(result.errorMessage, { duration: 4000 });
        } else {
            toast.success(result.response?.message ?? "Spreadsheet sync started.", { duration: 4000 });
        }
    }

    return (
        <button className="btn btn-secondary" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? (
                <>
                    <span className="loading loading-spinner loading-sm" />
                    Syncing...
                </>
            ) : (
                "Sync with Spreadsheet"
            )}
        </button>
    );
}

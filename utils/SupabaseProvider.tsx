// src/app/components/SupabaseProvider.tsx
'use client';

import { ReactNode } from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient";

export default function SupabaseProvider({ children }: { children: ReactNode; }) {
    return (
        <SessionContextProvider supabaseClient={supabase}>
            {children}
        </SessionContextProvider>
    );
}

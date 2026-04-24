// src/app/hook/useProposalChat.tsx
"use client"
import { useState } from "react";


export const useProposalChat = () => {
    const [chatSearch, setChatSearch] = useState("");


    return {
        chatSearch,
        setChatSearch,


    };
};  

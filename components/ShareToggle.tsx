"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

interface ShareToggleProps {
  promptId: string;
  isPublic: boolean;
}

export default function ShareToggle({ promptId, isPublic }: ShareToggleProps) {
  const [publicStatus, setPublicStatus] = useState(isPublic);

  const toggleShare = async () => {
    const { error } = await supabase
      .from("prompts")
      .update({ is_public: !publicStatus })
      .eq("id", promptId);

    if (!error) {
      setPublicStatus(!publicStatus);
    } else {
      console.error("Error updating share status:", error);
    }
  };

  return (
    <button
      onClick={toggleShare}
      className={`px-3 py-1 rounded text-white ${
        publicStatus ? "bg-green-500" : "bg-gray-500"
      }`}
    >
      {publicStatus ? "Public" : "Private"}
    </button>
  );
}

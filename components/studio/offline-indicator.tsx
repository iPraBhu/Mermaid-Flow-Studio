"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import { CloudDownload, CloudOff, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return window.navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function OfflineIndicator() {
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(() => setReady(true))
        .catch(() => setReady(false));
    }
  }, []);

  if (!online) {
    return (
      <Badge className="gap-2 border-rose-500/20 bg-rose-500/10 text-rose-200 dark:text-rose-200">
        <CloudOff className="h-3.5 w-3.5" />
        Offline mode
      </Badge>
    );
  }

  if (ready) {
    return (
      <Badge className="gap-2 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200">
        <CloudDownload className="h-3.5 w-3.5" />
        Offline ready
      </Badge>
    );
  }

  return (
    <Badge className="gap-2 border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-200">
      <Wifi className="h-3.5 w-3.5" />
      Caching app shell
    </Badge>
  );
}

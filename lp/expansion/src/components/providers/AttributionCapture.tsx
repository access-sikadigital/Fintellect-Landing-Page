"use client";

import { useEffect } from "react";
import { attribution } from "@/lib/track";

/**
 * Saves the ad click's UTMs and fbclid to session storage (ft-attribution) as soon as any page loads,
 * not only when the quiz submits, so they still reach the booking page and GHL if the URL changes first.
 */
export function AttributionCapture() {
  useEffect(() => {
    attribution();
  }, []);
  return null;
}

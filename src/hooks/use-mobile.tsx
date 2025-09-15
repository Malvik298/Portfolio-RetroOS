
"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Start with `false` on the server, and `null` on the client until we can check.
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // This effect runs only on the client.
    const checkDevice = () => window.innerWidth < MOBILE_BREAKPOINT;
    
    // Set the initial value on the client.
    setIsMobile(checkDevice());

    const handleResize = () => {
      setIsMobile(checkDevice());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures this runs only once on mount.

  return isMobile;
}

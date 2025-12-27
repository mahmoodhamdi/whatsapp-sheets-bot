"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Something went wrong!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We apologize for the inconvenience. Please try again.
            </p>

            {error.digest && (
              <p className="text-xs text-gray-500 mb-4">
                Error ID: {error.digest}
              </p>
            )}

            <Button onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}

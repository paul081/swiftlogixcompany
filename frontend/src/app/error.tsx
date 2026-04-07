'use client';

import React from 'react';

/**
 * Global Error Boundary UI for the entire application.
 * Provides a "premium" error state instead of a blank white screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="rounded-2xl bg-white p-12 shadow-2xl transition-all hover:scale-[1.01]">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100/50">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900">
          Something went wrong!
        </h2>
        <p className="mb-8 max-w-sm text-gray-500">
          {error.message || "An unexpected error occurred while processing your request. Please try again or contact support."}
        </p>
        <button
          onClick={() => reset()}
          className="w-full rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

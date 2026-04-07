import React from 'react';

/**
 * Global Loading UI for the entire application.
 * This provides a smooth "premium" transition when navigating pages.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="animate-pulse text-lg font-semibold text-gray-700">Loading SwiftLogix...</p>
      </div>
    </div>
  );
}

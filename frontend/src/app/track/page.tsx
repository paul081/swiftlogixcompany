'use client';

import React, { Suspense } from 'react';
import Home from '../page';

export default function TrackPage() {
  return (
    <Suspense fallback={<div>Loading Tracking Module...</div>}>
      <Home hideHero={true} />
    </Suspense>
  );
}

'use client';

import React, { JSX } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
        Something went wrong!
      </h2>
      <p style={{ color: '#999', marginBottom: '24px' }}>
        {error.message}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          background: '#0071e3',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Try again
      </button>
    </div>
  );
}

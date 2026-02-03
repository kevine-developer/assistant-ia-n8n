"use client";

import React from "react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md text-center">
        {/* Logo/Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight uppercase mb-2">
            Workflows
          </h1>
          <p className="text-sm font-mono opacity-60">n8n assistant</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="w-3 h-3 bg-foreground animate-pulse" />
          <div className="w-3 h-3 bg-foreground animate-pulse delay-100" />
          <div className="w-3 h-3 bg-foreground animate-pulse delay-200" />
        </div>

        {/* Message */}
        <p className="text-sm font-mono text-muted-foreground">
          Vérification de l'accès...
        </p>
      </div>
    </div>
  );
}

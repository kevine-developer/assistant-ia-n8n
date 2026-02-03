"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowUp,
  Briefcase,
  Share2,
  Lightbulb,
  Lock,
  Unlock,
  Check,
  X,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  workflow?: string;
}

interface Workflow {
  id: string;
  name: string;
  webhook: string;
  icon: React.ElementType;
}

const WORKFLOWS: Workflow[] = [
  {
    id: "job-offer",
    name: "Offre d'emploi",
    webhook: process.env.N8N_WEBHOOK_JOB_OFFER || "",
    icon: Briefcase,
  },
  {
    id: "social-content",
    name: "Contenu réseaux",
    webhook: process.env.N8N_WEBHOOK_SOCIAL_CONTENT || "",
    icon: Share2,
  },
  {
    id: "idea-improvement",
    name: "Amélioration d'idée",
    webhook: process.env.N8N_WEBHOOK_IDEA_IMPROVEMENT || "",
    icon: Lightbulb,
  },
];

const AUTH_USERNAME = process.env.N8N_AUTH_USERNAME || "";
const AUTH_PASSWORD = process.env.N8N_AUTH_PASSWORD || "";

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>(
    WORKFLOWS[0].id,
  );

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const workflow = WORKFLOWS.find((w) => w.id === selectedWorkflow);

      if (!workflow) {
        throw new Error("Workflow non trouvé");
      }

      console.log(` Envoi au workflow ${workflow.name}:`, messageContent);

      // Create Basic Auth header
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (AUTH_USERNAME && AUTH_PASSWORD) {
        const credentials = btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);
        headers["Authorization"] = `Basic ${credentials}`;
        console.log(" Utilisation de Basic Auth");
      }

      const response = await fetch(workflow.webhook, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: messageContent,
          timestamp: new Date().toISOString(),
          workflow: workflow.id,
        }),
      });

      console.log(
        ` ${workflow.name} - Réponse reçue, status:`,
        response.status,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(` ${workflow.name} - Données reçues:`, data);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || JSON.stringify(data),
        role: "assistant",
        timestamp: new Date(),
        workflow: workflow.name,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(" Erreur:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Erreur de connexion au workflow. Vérifiez que le webhook n8n est accessible.`,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Workflow Selector - Horizontal on mobile */}
      <div className="border-b border-foreground/10 bg-muted/30 px-4 py-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <RadioGroup
            value={selectedWorkflow}
            onValueChange={setSelectedWorkflow}
            className="flex flex-row gap-2 md:gap-3"
          >
            {WORKFLOWS.map((workflow) => {
              const Icon = workflow.icon;
              const isSelected = selectedWorkflow === workflow.id;
              return (
                <label
                  key={workflow.id}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer  transition-all border-2 ${
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/20 hover:border-foreground/40"
                  }`}
                >
                  <RadioGroupItem value={workflow.id} className="hidden" />
                  <Icon
                    className={`h-3 w-3 shrink-0 ${isSelected ? "text-background" : "text-foreground"}`}
                  />
                  <span
                    className={`font-medium text-xs  ${isSelected ? "text-background" : "text-foreground"}`}
                  >
                    {workflow.name}
                  </span>
                </label>
              );
            })}
          </RadioGroup>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-8"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
              <div className="space-y-4">
                <div className="text-6xl md:text-9xl font-bold opacity-5">
                  {"///"}
                </div>
                <p className="text-sm md:text-base font-mono text-muted-foreground">
                  {"Commencez une conversation"}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-2 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {message.role === "user" ? "Vous" : "Assistant"}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] md:max-w-[75%] px-4 py-3 border-l-4 ${
                    message.role === "user"
                      ? "border-foreground bg-foreground/5"
                      : "border-foreground/30 bg-transparent"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {"Assistant"}
              </span>
              <div className="flex gap-1 mt-1">
                <div className="w-2 h-2 bg-foreground animate-pulse" />
                <div className="w-2 h-2 bg-foreground animate-pulse delay-75" />
                <div className="w-2 h-2 bg-foreground animate-pulse delay-150" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed Bottom */}
      <div className="border-t-2 border-foreground px-4 py-4 md:px-8 md:py-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Votre message..."
              disabled={isLoading}
              className="flex-1 border-2 border-foreground/20 focus-visible:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 bg-background text-base h-12 md:h-14 px-4 font-mono"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-12 w-12 md:h-14 md:w-14 shrink-0 bg-foreground hover:bg-foreground/90 text-background border-2 border-foreground disabled:opacity-30"
            >
              <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-3 text-center md:text-left">
            {`${WORKFLOWS.find((w) => w.id === selectedWorkflow)?.name} actif`}
          </p>
        </div>
      </div>
    </div>
  );
}

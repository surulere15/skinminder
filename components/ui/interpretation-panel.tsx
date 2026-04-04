"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterpretationPanelProps {
  summary: string;
  imageUrl?: string;
  confidence?: number;
  recommendations?: string[];
  className?: string;
}

export function InterpretationPanel({ 
  summary, 
  imageUrl, 
  confidence,
  recommendations = [],
  className 
}: InterpretationPanelProps) {
  const getConfidenceLevel = (conf: number) => {
    if (conf >= 90) return { label: "High confidence", color: "text-green-600", bg: "bg-green-50" };
    if (conf >= 70) return { label: "Medium confidence", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { label: "Lower confidence", color: "text-orange-600", bg: "bg-orange-50" };
  };

  const confLevel = confidence ? getConfidenceLevel(confidence) : null;

  return (
    <Card className={cn(
      "p-6 rounded-2xl bg-white border border-skin-lavender",
      className
    )}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        {imageUrl && (
          <div className="w-full md:w-48 h-64 md:h-auto rounded-xl overflow-hidden shrink-0">
            <img src={imageUrl} alt="Your scan" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Analysis */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">What we found</h3>
            <p className="text-muted">{summary}</p>
          </div>

          {confLevel && (
            <div className={cn("p-3 rounded-lg flex items-center gap-2", confLevel.bg)}>
              <Info size={16} className={confLevel.color} />
              <span className={cn("text-sm font-medium", confLevel.color)}>
                {confLevel.label}
              </span>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">What to do next:</h4>
              <ul className="space-y-2">
                {recommendations.slice(0, 3).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted">
              Scan again in 1 week to track progress
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

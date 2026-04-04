"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Hydration", A: 85, fullMark: 100 },
  { subject: "Texture", A: 72, fullMark: 100 },
  { subject: "Pigmentation", A: 65, fullMark: 100 },
  { subject: "Sensitivity", A: 45, fullMark: 100 },
  { subject: "Elasticity", A: 78, fullMark: 100 },
];

export function SkinRadar() {
  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#FFFFFF10" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#8C93B5", fontSize: 11, fontWeight: 600 }}
          />
          <Radar
            name="Skin Health"
            dataKey="A"
            stroke="#6F8BFF"
            fill="#6F8BFF"
            fillOpacity={0.2}
            strokeWidth={2}
            animationDuration={1500}
            animationBegin={200}
            isAnimationActive={true}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

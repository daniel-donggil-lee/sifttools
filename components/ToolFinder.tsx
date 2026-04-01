"use client";

import { useState } from "react";
import Link from "next/link";

interface ToolData {
  id: string;
  name: string;
  category: string;
  url: string;
  pricing: string;
  description: string;
  budget_tier: string;
  team_size: string[];
  strengths: string[];
}

const STEPS = [
  {
    question: "What do you need AI for?",
    key: "category" as const,
    options: [
      { value: "Writing", label: "Writing & Copy", icon: "✏️" },
      { value: "Image", label: "Image & Design", icon: "🎨" },
      { value: "Video", label: "Video Creation", icon: "🎬" },
      { value: "Audio", label: "Audio & Voice", icon: "🎙️" },
      { value: "Coding", label: "Coding", icon: "💻" },
      { value: "Productivity", label: "Productivity", icon: "⚡" },
      { value: "Chatbot", label: "AI Chatbot", icon: "🤖" },
    ],
  },
  {
    question: "What's your budget?",
    key: "budget" as const,
    options: [
      { value: "free", label: "Free only", icon: "🆓" },
      { value: "budget", label: "Under $30/mo", icon: "💰" },
      { value: "premium", label: "$30+/mo", icon: "💎" },
      { value: "any", label: "No limit", icon: "🚀" },
    ],
  },
  {
    question: "Team size?",
    key: "team" as const,
    options: [
      { value: "solo", label: "Just me", icon: "👤" },
      { value: "small", label: "Small team", icon: "👥" },
      { value: "enterprise", label: "Enterprise", icon: "🏢" },
    ],
  },
  {
    question: "What matters most?",
    key: "strength" as const,
    options: [
      { value: "quality", label: "Output quality", icon: "✨" },
      { value: "speed", label: "Speed", icon: "⚡" },
      { value: "ease", label: "Ease of use", icon: "🎯" },
      { value: "integration", label: "Integrations", icon: "🔗" },
    ],
  },
];

type Answers = {
  category?: string;
  budget?: string;
  team?: string;
  strength?: string;
};

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

function scoreTools(tools: ToolData[], answers: Answers): ToolData[] {
  return tools
    .map((tool) => {
      let score = 0;

      // Category match (must match)
      if (answers.category && tool.category !== answers.category && tool.category !== "SEO") {
        return { tool, score: -1 };
      }
      if (answers.category === "Writing" && tool.category === "SEO") {
        score += 2; // SEO is related to writing
      }
      if (tool.category === answers.category) score += 10;

      // Budget match
      if (answers.budget && answers.budget !== "any") {
        if (answers.budget === "free" && tool.budget_tier === "free") score += 5;
        else if (answers.budget === "budget" && (tool.budget_tier === "free" || tool.budget_tier === "budget")) score += 4;
        else if (answers.budget === "premium") score += 3;
      }

      // Team size match
      if (answers.team && tool.team_size.includes(answers.team)) score += 4;

      // Strength match
      if (answers.strength && tool.strengths.includes(answers.strength)) score += 5;

      return { tool, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.tool);
}

export default function ToolFinder({ tools }: { tools: ToolData[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (key: string, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const results = scoreTools(tools, answers);
    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Your perfect matches
          </h2>
          <p className="mt-2 text-gray-400 font-medium">
            Based on your preferences, we recommend:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {results.map((tool, i) => {
            const domain = getDomain(tool.url);
            const slug = tool.id;
            return (
              <Link
                key={tool.id}
                href={`/tools/${slug}`}
                className="group relative block bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                {i === 0 && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-600/20">
                    Best Match
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  {domain && (
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                        alt={tool.name}
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {tool.name}
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">{tool.pricing}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-4 text-emerald-600 text-sm font-semibold group-hover:underline">
                  Read full review →
                </div>
              </Link>
            );
          })}
        </div>

        {results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No exact matches found. Try different criteria.</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  const currentStep = STEPS[step];

  return (
    <div className="animate-fade-in-up">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="text-center mb-8">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
          Step {step + 1} of {STEPS.length}
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-gray-900 tracking-tight">
          {currentStep.question}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {currentStep.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleAnswer(currentStep.key, opt.value)}
            className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="text-3xl">{opt.icon}</span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setStep(step - 1)}
            className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

import ToolFinder from "@/components/ToolFinder";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "AI Tool Finder — Find Your Perfect AI Tool",
  description:
    "Answer 4 quick questions and get personalized AI tool recommendations. Writing, image, video, coding, and more.",
};

function getToolsDb() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data/tools_db.json"),
    "utf-8"
  );
  return JSON.parse(raw).tools;
}

export default function FinderPage() {
  const tools = getToolsDb();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Find Your Perfect AI Tool
        </h1>
        <p className="mt-3 text-gray-400 font-medium max-w-md mx-auto">
          Answer 4 quick questions. Get personalized recommendations.
        </p>
      </div>

      <ToolFinder tools={tools} />
    </div>
  );
}

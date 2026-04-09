"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateContent } from "@/app/actions";
import { Loader2, UploadCloud, FileText } from "lucide-react";

export default function Page() {
  const [loadingMode, setLoadingMode] = useState<"quiz" | "flashcard" | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: "quiz" | "flashcard") => {
    e.preventDefault();
    setLoadingMode(mode);
    
    const formData = new FormData(e.currentTarget);
    formData.append("mode", mode);
    formData.append("count", "10");
    if (file) {
      formData.append("file", file);
    }
    
    try {
      await generateContent(formData);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please try again.");
      setLoadingMode(null);
    }
  };

  return (
    <div className="flex min-h-svh p-6 bg-slate-50 items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Quizzy AI</h1>
          <p className="text-slate-500 mt-2 text-sm">Generate high-quality quizzes and flashcards from your notes or documents.</p>
        </div>
        
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Paste your notes</label>
            <textarea
              name="notes"
              className="min-h-[200px] w-full rounded-md border border-slate-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-y"
              placeholder="Paste your study notes here..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Or upload a document (.pdf, .docx, .txt)</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {file ? (
                  <>
                    <FileText className="w-8 h-8 text-slate-500 mb-2" />
                    <p className="text-sm text-slate-600 font-medium">{file.name}</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
                    <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loadingMode !== null}
              onClick={(e) => handleSubmit(e.currentTarget.form as any, "quiz")}
            >
              {loadingMode === "quiz" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Quiz
            </Button>
            <Button
              type="button"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={loadingMode !== null}
              onClick={(e) => handleSubmit(e.currentTarget.form as any, "flashcard")}
            >
              {loadingMode === "flashcard" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Flash card
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

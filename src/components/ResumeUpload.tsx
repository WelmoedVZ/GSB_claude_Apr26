'use client';

import { useState, useRef } from 'react';
import { ParseResumeResponse } from '@/types';

interface ResumeUploadProps {
  onParsed: (data: ParseResumeResponse) => void;
}

export default function ResumeUpload({ onParsed }: ResumeUploadProps) {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [pasteText, setPasteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to parse resume');
      }

      const data: ParseResumeResponse = await res.json();
      onParsed(data);
      setSuccess('Resume parsed successfully! Profile fields have been updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handlePasteSubmit() {
    if (pasteText.trim().length < 50) {
      setError('Please paste at least 50 characters of resume text.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: pasteText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to parse resume');
      }

      const data: ParseResumeResponse = await res.json();
      onParsed(data);
      setSuccess('Resume parsed successfully! Profile fields have been updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Import from Resume</h3>
      <p className="mt-1 text-sm text-gray-500">
        Upload a PDF or paste your resume text. AI will extract your profile details.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setMode('paste')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'paste'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Paste Text
        </button>
      </div>

      <div className="mt-4">
        {mode === 'upload' ? (
          <div>
            <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-indigo-400 transition-colors">
              <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
              </svg>
              <span className="mt-2 text-sm text-gray-600">Click to upload a PDF resume</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={loading}
              />
            </label>
          </div>
        ) : (
          <div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={8}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handlePasteSubmit}
              disabled={loading || pasteText.trim().length < 50}
              className="mt-3 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Parsing...' : 'Parse Resume'}
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Analyzing your resume with AI...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}
    </div>
  );
}

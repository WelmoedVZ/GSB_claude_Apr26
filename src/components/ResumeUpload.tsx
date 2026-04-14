'use client';

import { useState, useRef, useCallback } from 'react';
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
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
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
  }, [onParsed]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleClickUpload() {
    fileInputRef.current?.click();
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
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
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />

            {/* Click + drag-and-drop zone */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleClickUpload}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClickUpload(); }}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              } ${loading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="mt-2 text-sm font-medium text-gray-700">
                {dragOver ? 'Drop your PDF here' : 'Click to upload or drag and drop'}
              </span>
              <span className="mt-1 text-xs text-gray-500">PDF files only</span>
            </div>
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

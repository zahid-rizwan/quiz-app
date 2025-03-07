import React from 'react';

interface ChapterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const chapters = [
  'Introduction to Databases',
  'SQL Fundamentals',
  'Database Design',
  'Normalization',
  'Indexing and Performance',
  'Transaction Management',
  'Database Security',
];

export default function ChapterSelect({ value, onChange }: ChapterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      required
    >
      <option value="">Select a chapter</option>
      {chapters.map((chapter) => (
        <option key={chapter} value={chapter}>
          {chapter}
        </option>
      ))}
    </select>
  );
}
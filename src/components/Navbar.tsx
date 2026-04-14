import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          InterviewPrep AI
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/practice"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Practice
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

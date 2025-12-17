import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-400">
          &copy; {currentYear} United Studio Collective. All rights reserved.
        </div>

        <div className="flex gap-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/projects" className="text-sm text-gray-400 hover:text-white transition-colors">
            Projects
          </Link>
          <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

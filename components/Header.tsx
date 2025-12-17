import Link from 'next/link';

export default function Header({ currentPage }: { currentPage?: string }) {
  const navItems = ['Home', 'About', 'Projects', 'Contact'];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-8 py-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white text-2xl font-bold">
          United Studio Collective
        </Link>

        <ul className="flex gap-8">
          {navItems.map((item) => (
            <li key={item}>
              <Link
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={`text-lg transition-colors ${
                  currentPage === item
                    ? 'text-white font-semibold border-b-2 border-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

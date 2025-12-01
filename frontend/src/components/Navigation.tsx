'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: '/fixtures', label: 'Fixtures' },
    { href: '/vendors', label: 'Vendors' },
    { href: '/community', label: 'Community' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-dark border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-3xl">
            <img src="/riderready-logo.png" alt="RiderReady" className="h-16 w-auto" />
            <span className="text-white">RiderReady</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-amber-500'
                    : 'text-gray-300 hover:text-amber-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-amber-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 font-medium ${
                  pathname === link.href
                    ? 'text-amber-500'
                    : 'text-gray-300 hover:text-amber-400'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

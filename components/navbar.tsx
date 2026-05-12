'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, ShoppingCart } from 'lucide-react'

const navLinks = [
  { href: '#intro', label: 'Acasă' },
  { href: '#adopta', label: 'Adoptă un pom' },
  { href: '#evenimente', label: 'Evenimente' },
  { href: '#galerie', label: 'Galerie' },
  { href: '#cta', label: 'Comandă' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl"
      >
        <nav
          className={`px-6 lg:px-8 rounded-full transition-all duration-500 ${
            isScrolled
              ? 'bg-cream/85 backdrop-blur-xl shadow-lg border border-forest/8'
              : 'bg-transparent border border-transparent'
          }`}
        >
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <motion.span
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative block h-20 w-20 translate-y-1 lg:h-28 lg:w-28 lg:translate-y-1.5">
                  <Image
                    src="/logo&favicon/logofructulbucovinei.png"
                    alt="Logo Fructul Bucovinei"
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                </span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 group ${
                    isScrolled 
                      ? 'text-forest/70 hover:text-forest' 
                      : 'text-cream/80 hover:text-cream'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                    isScrolled ? 'bg-burgundy' : 'bg-cream'
                  }`} />
                </Link>
              ))}
            </div>

            {/* User & Cart Icons */}
            <div className="flex items-center gap-1">
              <button
                className={`hidden lg:flex p-2.5 rounded-full transition-all duration-300 ${
                  isScrolled 
                    ? 'text-forest/60 hover:text-burgundy hover:bg-forest/5' 
                    : 'text-cream/70 hover:text-cream hover:bg-cream/10'
                }`}
                aria-label="Contul meu"
              >
                <User size={18} strokeWidth={1.5} />
              </button>
              <button
                className={`hidden lg:flex p-2.5 rounded-full transition-all duration-300 ${
                  isScrolled 
                    ? 'text-forest/60 hover:text-burgundy hover:bg-forest/5' 
                    : 'text-cream/70 hover:text-cream hover:bg-cream/10'
                }`}
                aria-label="Coș de cumpărături"
              >
                <ShoppingCart size={18} strokeWidth={1.5} />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 transition-colors duration-300 ${
                  isScrolled ? 'text-forest' : 'text-cream'
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-cream/98 backdrop-blur-xl" />
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative flex flex-col items-center justify-center h-full gap-8"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-3xl text-forest hover:text-burgundy transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 mt-8"
              >
                <button
                  className="p-3 text-forest/60 hover:text-burgundy transition-colors duration-300"
                  aria-label="Contul meu"
                >
                  <User size={24} strokeWidth={1.5} />
                </button>
                <button
                  className="p-3 text-forest/60 hover:text-burgundy transition-colors duration-300"
                  aria-label="Coș de cumpărături"
                >
                  <ShoppingCart size={24} strokeWidth={1.5} />
                </button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

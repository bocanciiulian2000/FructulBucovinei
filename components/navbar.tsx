'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Menu, X, User, ShoppingCart } from 'lucide-react'
import { AuthPanel } from '@/components/auth-panel'
import {
  CART_UPDATED_EVENT,
  formatCartPrice,
  getCartSubtotal,
  getCartQuantity,
  readCart,
  type CartItem,
} from '@/lib/cart'

const navLinks = [
  { href: '/', label: 'Acasă' },
  { href: '/adopta-un-pom', label: 'Adoptă un pom' },
  { href: '/produse', label: 'Produse' },
  { href: '/evenimente', label: 'Evenimente' },
  { href: '/despre-noi', label: 'Despre noi' },
  { href: '/galerie', label: 'Galerie' },
]

const promoCodes: Record<string, number> = {
  BUCOVINA10: 10,
  FRUCTUL10: 10,
  LIVADA15: 15,
}

type NavbarProps = {
  solid?: boolean
}

export function Navbar({ solid: _solid = false }: NavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isPromoOpen, setIsPromoOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [activeSection, setActiveSection] = useState('/')
  const isSolid = true
  const cartQuantity = getCartQuantity(cartItems)
  const subtotal = getCartSubtotal(cartItems)
  const discountPercent = appliedPromoCode ? promoCodes[appliedPromoCode] : 0
  const discountedSubtotal = subtotal * (1 - discountPercent / 100)

  const applyPromoCode = () => {
    const normalizedCode = promoCode.trim().toUpperCase()

    if (!normalizedCode) {
      setPromoError('Introdu un cod promoțional.')
      setAppliedPromoCode('')
      return
    }

    if (!promoCodes[normalizedCode]) {
      setPromoError('Codul introdus nu este valid.')
      setAppliedPromoCode('')
      return
    }

    setAppliedPromoCode(normalizedCode)
    setPromoCode(normalizedCode)
    setPromoError('')
  }

  useEffect(() => {
    const handleScroll = () => {
      if (pathname !== '/') {
        setActiveSection(pathname)
        return
      }

      if (window.scrollY < 240) {
        setActiveSection('/')
        return
      }

      const currentLink = navLinks.findLast((link) => {
        const sectionId = link.href.split('#')[1]

        if (!sectionId) {
          return false
        }

        const section = document.querySelector(`#${sectionId}`)

        if (!section) {
          return false
        }

        return section.getBoundingClientRect().top <= 180
      })

      if (currentLink) {
        setActiveSection(currentLink.href)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  useEffect(() => {
    const syncCart = () => setCartItems(readCart())

    syncCart()
    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncCart)
    }
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
            isSolid
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
              {navLinks.map((link) => {
                const isActive = activeSection === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(event) => {
                      if (link.href === '/') {
                        event.preventDefault()
                        window.location.href = '/'
                      }
                    }}
                    className={`relative text-sm transition-colors duration-300 group ${
                      link.href === '/produse' ? 'font-bold' : 'font-medium'
                    } ${
                      isActive
                        ? isSolid
                          ? 'text-burgundy'
                          : 'text-cream'
                        : isSolid
                          ? 'text-forest/70 hover:text-forest'
                          : 'text-cream/80 hover:text-cream'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 group-hover:w-full ${
                      isActive ? 'w-full' : 'w-0'
                    } ${isSolid ? 'bg-burgundy' : 'bg-cream'}`} />
                  </Link>
                )
              })}
            </div>

            {/* User & Cart Icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsCartPreviewOpen(false)
                  setIsAuthModalOpen(true)
                }}
                className={`flex p-2.5 rounded-full transition-all duration-300 ${
                  isSolid
                    ? 'text-forest/60 hover:text-burgundy hover:bg-forest/5' 
                    : 'text-cream/70 hover:text-cream hover:bg-cream/10'
                }`}
                aria-label="Contul meu"
              >
                <User size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsCartPreviewOpen(true)
                }}
                className={`relative flex p-2.5 rounded-full transition-all duration-300 ${
                  isSolid
                    ? 'text-forest/60 hover:text-burgundy hover:bg-forest/5' 
                    : 'text-cream/70 hover:text-cream hover:bg-cream/10'
                }`}
                aria-label="Coș de cumpărături"
              >
                <ShoppingCart size={18} strokeWidth={1.5} />
                {cartQuantity > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1.5 text-[0.65rem] font-bold leading-none text-cream">
                    {cartQuantity}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 transition-colors duration-300 ${
                  isSolid ? 'text-forest' : 'text-cream'
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
              className="relative flex h-full flex-col items-center justify-center gap-8 px-6 pt-20"
            >
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(event) => {
                        setIsMobileMenuOpen(false)

                        if (link.href === '/') {
                          event.preventDefault()
                          window.location.href = '/'
                        }
                      }}
                      className={`relative font-serif text-4xl transition-colors duration-300 hover:text-burgundy ${
                        link.href === '/produse' ? 'font-bold' : 'font-normal'
                      } ${
                        isActive ? 'text-burgundy' : 'text-forest'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute -bottom-2 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-burgundy" />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-forest/35 backdrop-blur-[2px]"
              aria-label="Închide fereastra de autentificare"
              onClick={() => setIsAuthModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[calc(100vh-2rem)] w-full max-w-[39rem] overflow-y-auto rounded-3xl border border-forest/10 bg-[#fbf7ee] p-5 shadow-2xl sm:p-7"
            >
              <div className="mb-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full border border-forest/15 text-forest transition-colors hover:border-burgundy hover:text-burgundy"
                  aria-label="Închide autentificarea"
                >
                  <X size={20} />
                </button>
              </div>

              <AuthPanel defaultMode="login" compact />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartPreviewOpen && (
          <motion.div
            className="fixed inset-0 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-forest/35 backdrop-blur-[2px]"
              aria-label="Închide preview coș"
              onClick={() => setIsCartPreviewOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream px-5 py-6 shadow-2xl sm:px-7"
            >
              <div className="flex items-start justify-between gap-5 border-b border-forest/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brown">
                    Coșul tău
                  </p>
                  <h2 className="mt-1 font-serif text-4xl font-bold leading-none text-forest">
                    {cartQuantity} {cartQuantity === 1 ? 'articol' : 'articole'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCartPreviewOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full border border-forest/15 text-forest transition-colors hover:border-burgundy hover:text-burgundy"
                  aria-label="Închide coșul"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-5">
                {cartItems.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingCart size={34} className="text-brown/60" />
                    <p className="mt-4 font-serif text-3xl font-bold text-forest">
                      Coșul este gol
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-forest/65">
                      Adaugă un produs din pagina de produse și îl vei vedea aici.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.slug}
                        className="grid grid-cols-[5rem_1fr] gap-4 rounded-2xl bg-[#fbf7ee] p-3 shadow-sm ring-1 ring-forest/5"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-serif text-2xl font-bold leading-none text-forest">
                            {item.name}
                          </h3>
                          <p className="mt-2 text-sm text-forest/65">
                            Cantitate: {item.quantity}
                          </p>
                          <p className="mt-2 font-semibold text-burgundy">
                            {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-forest/10 pt-5">
                <div className="mb-5 space-y-4">
                  <div className="rounded-2xl bg-[#fbf7ee] p-4 ring-1 ring-forest/5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold uppercase tracking-wide text-brown">
                        Sub-total:
                      </span>
                      <span className="font-serif text-3xl font-bold leading-none text-burgundy">
                        {formatCartPrice(discountedSubtotal)} lei
                      </span>
                    </div>

                    {discountPercent > 0 && (
                      <p className="mt-2 text-right text-xs font-semibold text-forest/60">
                        Reducere aplicată: {discountPercent}% prin {appliedPromoCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setIsPromoOpen((current) => !current)}
                      className="text-sm font-semibold text-burgundy transition-colors hover:text-forest"
                    >
                      Ai un cod promoțional?
                    </button>

                    <AnimatePresence initial={false}>
                      {isPromoOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 grid grid-cols-[1fr_auto] overflow-hidden rounded-sm border border-forest/20 bg-[#fbf7ee]">
                            <input
                              value={promoCode}
                              onChange={(event) => {
                                setPromoCode(event.target.value)
                                setPromoError('')
                              }}
                              placeholder="Cod promoțional"
                              className="min-w-0 bg-transparent px-4 py-3 text-sm font-semibold uppercase text-forest outline-none placeholder:normal-case placeholder:text-forest/45"
                            />
                            <button
                              type="button"
                              onClick={applyPromoCode}
                              className="bg-forest px-5 py-3 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:bg-burgundy"
                            >
                              Aplică
                            </button>
                          </div>

                          {promoError && (
                            <p className="mt-2 text-xs font-semibold text-burgundy">
                              {promoError}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartPreviewOpen(false)}
                  className="group flex w-full items-center justify-center gap-3 rounded-sm bg-burgundy px-6 py-4 text-xs font-bold uppercase tracking-wide text-cream transition-all duration-300 hover:gap-4 hover:bg-forest"
                >
                  <span>Finalizează comanda</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/cos"
                  onClick={() => setIsCartPreviewOpen(false)}
                  className="group mt-3 flex w-full items-center justify-center gap-3 rounded-sm border border-forest/25 px-6 py-4 text-xs font-bold uppercase tracking-wide text-forest transition-all duration-300 hover:gap-4 hover:border-burgundy hover:bg-burgundy hover:text-cream"
                >
                  <span>Vezi coșul</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

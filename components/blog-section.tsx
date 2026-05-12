'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'Secretele unei livezi sănătoase',
    excerpt: 'Descoperă tehnicile tradiționale de îngrijire a pomilor fructiferi, transmise din generație în generație în Bucovina.',
    image: '/images/blog-1.jpg',
    category: 'Grădinărit',
    date: '15 Octombrie 2024',
  },
  {
    id: 2,
    title: 'Rețete de toamnă cu mere proaspete',
    excerpt: 'De la plăcinte fragede la cidru de casă - cele mai bune rețete cu merele noastre Jonathan.',
    image: '/images/blog-2.jpg',
    category: 'Rețete',
    date: '8 Octombrie 2024',
  },
  {
    id: 3,
    title: 'Arta conservării fructelor',
    excerpt: 'Cum să păstrezi gustul verii pentru zilele reci - gemuri, dulcețuri și compoturi după rețete de familie.',
    image: '/images/blog-3.jpg',
    category: 'Tradiții',
    date: '1 Octombrie 2024',
  },
]

export function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="relative py-24 lg:py-40 bg-cream overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 lg:mb-24"
        >
          <div>
            <span className="text-burgundy text-sm tracking-[0.3em] uppercase font-medium">
              Povești din livadă
            </span>
            <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl text-forest font-bold leading-[0.98] mt-6 text-balance">
              Blog
            </h2>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-brown hover:text-burgundy transition-colors text-sm font-medium"
          >
            Toate articolele
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-6">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4 text-xs text-brown/60">
                <span className="px-3 py-1 bg-burgundy/10 text-burgundy rounded-full">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>

              {/* Title & Excerpt */}
              <h3 className="font-serif text-2xl text-forest mb-3 group-hover:text-burgundy transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-brown/70 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              {/* Read More */}
              <span className="inline-flex items-center gap-2 mt-4 text-burgundy text-sm font-medium group-hover:gap-3 transition-all duration-300">
                Citește mai mult
                <ArrowRight size={14} />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getFAQs, getFAQCategories, getCategoryDisplayName, groupFAQsByCategory } from "@/lib/faqs";
import type { SanityFAQ } from "@/types/faq";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const bounce = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    y: -8,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  }
};

export default function FAQsPage() {
  const [faqs, setFAQs] = useState<SanityFAQ[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: faqsData, error: faqsError } = await getFAQs({});
        const { data: categoriesData, error: categoriesError } = await getFAQCategories();

        if (faqsError) throw faqsError;
        if (categoriesError) throw categoriesError;

        setFAQs(faqsData || []);
        setCategories((categoriesData as string[]) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedFAQs = groupFAQsByCategory(filteredFAQs);

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading FAQs...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="text-center">
            <p className="text-red-400">Error: {error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-amber-400/10 to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-amber-300">
              Research & Insights
            </span>
            
            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Frequently Asked Questions
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Find answers to common questions about Mic'd Up Initiative, our programs, and how you can get involved.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-12">
        {/* Premium Ambient Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-200px] left-[-120px] h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute bottom-[-220px] right-[-180px] h-[520px] w-[520px] rounded-full bg-white/5 blur-[140px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Search and Filters */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder-white/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-amber-400 text-black"
                    : "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-amber-400 text-black"
                      : "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {getCategoryDisplayName(category)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Featured FAQs */}
          {selectedCategory === "all" && !searchQuery && (
            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold text-amber-400 mb-6">Featured Questions</h2>
              <div className="space-y-4">
                {faqs.filter(faq => faq.featured).map((faq, index) => (
                  <motion.div
                    key={faq._id}
                    variants={bounce}
                    whileHover="hover"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
                      <button
                        onClick={() => toggleFAQ(faq._id)}
                        className="w-full text-left flex items-center justify-between"
                      >
                        <h3 className="text-lg font-semibold text-amber-200 group-hover:text-amber-300 transition-colors">
                          {faq.question}
                        </h3>
                        <div className={`transform transition-transform duration-300 ${
                          expandedFAQ === faq._id ? "rotate-45" : ""
                        }`}>
                          <span className="text-amber-400 text-2xl">+</span>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedFAQ === faq._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            <div className="text-white/70 prose prose-invert max-w-none">
                              <PortableText value={faq.answer} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* All FAQs by Category */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {Object.entries(groupedFAQs).map(([category, categoryFAQs], categoryIndex) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-semibold text-amber-400 mb-6">
                  {getCategoryDisplayName(category)}
                </h2>
                <div className="space-y-4">
                  {categoryFAQs.map((faq, index) => (
                    <motion.div
                      key={faq._id}
                      variants={bounce}
                      whileHover="hover"
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group"
                    >
                      <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
                        <button
                          onClick={() => toggleFAQ(faq._id)}
                          className="w-full text-left flex items-center justify-between"
                        >
                          <h3 className="text-lg font-semibold text-amber-200 group-hover:text-amber-300 transition-colors">
                            {faq.question}
                          </h3>
                          <div className={`transform transition-transform duration-300 ${
                            expandedFAQ === faq._id ? "rotate-45" : ""
                          }`}>
                            <span className="text-amber-400 text-2xl">+</span>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {expandedFAQ === faq._id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-white/10"
                            >
                              <div className="text-white/70 prose prose-invert max-w-none">
                                <PortableText value={faq.answer} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <p className="text-white/50">No FAQs found matching your criteria.</p>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">
                Still have questions?
              </h2>
              <p className="text-white/70 mb-6">
                Can't find what you're looking for? Reach out to our team and we'll be happy to help.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-300 transition-all duration-300"
                >
                  Contact Us
                </Link>
                <Link
                  href="/Get-Involved"
                  className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300"
                >
                  Get Involved
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

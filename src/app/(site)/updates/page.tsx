"use client";

import { useState, useEffect } from "react";
import { UpdateCard } from "@/components/updates/UpdateCard";
import { FadeInSection } from "@/components/FadeInSection";
import { getUpdates, getUpdateTypes, groupUpdatesByType, getTypeDisplayName } from "@/lib/updates";
import type { SanityUpdate } from "@/types/update";

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<SanityUpdate[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: updatesData, error: updatesError } = await getUpdates({});
        const { data: typesData, error: typesError } = await getUpdateTypes();

        if (updatesError) throw updatesError;
        if (typesError) throw typesError;

        setUpdates(updatesData || []);
        setTypes((typesData as string[]) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load updates");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredUpdates = updates.filter(update => {
    return selectedType === "all" || update.type === selectedType;
  });

  const groupedUpdates = groupUpdatesByType(filteredUpdates);

  const featuredUpdates = updates.filter(update => update.featured);

  return (
    <main className="min-h-screen text-white" style={{backgroundColor: '#0D1F35'}}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-amber-400/10 to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <FadeInSection className="text-center">
            <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-amber-300">
              This Semester
            </span>

            <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Updates
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
              Announcements, campus tours, events, and everything else MUI is putting out this semester — the running record, outside the conversations themselves.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Type Filter */}
          <FadeInSection delay={200} className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === "all"
                    ? "bg-amber-400 text-black"
                    : "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                All Updates
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedType === type
                      ? "bg-amber-400 text-black"
                      : "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {getTypeDisplayName(type)}
                </button>
              ))}
            </div>
          </FadeInSection>

          {/* Featured Updates */}
          {selectedType === "all" && featuredUpdates.length > 0 && (
            <FadeInSection delay={300} as="section" className="mb-16">
              <h2 className="text-2xl font-semibold text-amber-400 mb-8 text-center">
                Featured Updates
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredUpdates.map((update, index) => (
                  <UpdateCard key={update._id} update={update} index={index} />
                ))}
              </div>
            </FadeInSection>
          )}

          {/* Updates by Type */}
          {selectedType === "all" ? (
            <FadeInSection delay={400} className="space-y-16">
              {Object.entries(groupedUpdates).map(([type, typeUpdates]) => (
                <div key={type}>
                  <h2 className="text-2xl font-semibold text-amber-400 mb-6">
                    {getTypeDisplayName(type)}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {typeUpdates.map((update, index) => (
                      <UpdateCard key={update._id} update={update} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </FadeInSection>
          ) : (
            <FadeInSection delay={400}>
              <h2 className="text-2xl font-semibold text-amber-400 mb-6">
                {getTypeDisplayName(selectedType)}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredUpdates.map((update, index) => (
                  <UpdateCard key={update._id} update={update} index={index} />
                ))}
              </div>
            </FadeInSection>
          )}

          {/* No Results */}
          {filteredUpdates.length === 0 && !loading && (
            <FadeInSection className="text-center py-12">
              <p className="text-white/50">No updates found for this category yet.</p>
            </FadeInSection>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
              <p className="mt-4 text-white/70">Loading updates...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

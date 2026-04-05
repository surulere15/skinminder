"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import GlassCard from "./GlassCard";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    [
      "Does Skinminder diagnose skin conditions?",
      "No. Skinminder helps users understand visible skin patterns and follow clearer guidance. It does not replace professional medical care.",
    ],
    [
      "What can it help with?",
      "It helps you check visible concerns like breakouts, dark spots, redness, irritation, and routine consistency.",
    ],
    [
      "Why keep using it?",
      "Because the value increases over time. Repeated scans and progress tracking help you see whether your routine is working.",
    ],
    [
      "Is it for all skin tones?",
      "Skinminder is designed to support a broad range of skin tones and user contexts.",
    ],
    [
      "Is the routine complicated?",
      "No. The goal is to simplify what you do, not overload you.",
    ],
  ];

  return (
    <section id="faq" className="px-6 py-20 md:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="FAQ"
          title="What people ask before they trust a product like this."
        />

        <div className="mt-10 space-y-3 md:mt-12">
          {faqs.map(([q, a], i) => (
            <GlassCard key={q} className="overflow-hidden transition-all duration-300 ease-out hover:border-white/18">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left md:px-7"
              >
                <h3 className="text-base font-semibold tracking-[-0.01em] pr-4">{q}</h3>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ChevronDown className="h-5 w-5 shrink-0 text-white/40" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-6 pb-5 md:px-7">
                      <p className="text-sm leading-7 text-white/64">{a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

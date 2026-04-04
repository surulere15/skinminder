"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Pro Member",
    avatar: "SM",
    rating: 5,
    quote: "I've tried so many skincare products over the years. SkinMinder finally helped me understand what actually works for my skin instead of just guessing.",
    detail: "Acne-prone, sensitive skin - finally found a routine that doesn't cause breakouts"
  },
  {
    id: 2,
    name: "Dr. Angela Chen",
    role: "Board-certified Dermatologist",
    avatar: "AC",
    rating: 4,
    quote: "I appreciate that this product doesn't overpromise. The melanin-aware approach and focus on safe ingredient matching is responsible AI in skincare.",
    detail: "Recommends SkinMinder as a complement to professional care"
  },
  {
    id: 3,
    name: "Marcus J.",
    role: "Free User",
    avatar: "MJ",
    rating: 5,
    quote: "The weekly progress tracking keeps me honest. I've seen real improvements in my skin texture over 3 months of consistent scanning.",
    detail: "Oily/combination skin - reduced breakouts by tracking triggers"
  },
  {
    id: 4,
    name: "Priya K.",
    role: "Pro Member",
    avatar: "PK",
    rating: 5,
    quote: "As someone with darker skin, I'm so glad this product understands that skin analysis isn't one-size-fits-all. The PIH tracking has been game-changing.",
    detail: "Melanin-rich skin - finally accurate pigment tracking"
  },
  {
    id: 5,
    name: "James R.",
    role: "Pro Member",
    avatar: "JR",
    rating: 4,
    quote: "The ingredient scanner saved me hundreds of dollars. I was about to buy an expensive serum that would've broken me out. Now I check every product first.",
    detail: "Reactive/irritated skin - avoided multiple trigger ingredients"
  },
  {
    id: 6,
    name: "Dr. Michael Torres",
    role: "Cosmetic Chemist",
    avatar: "MT",
    rating: 5,
    quote: "The ingredient conflict detection is actually useful. It's like having a formulation expert review products before you buy them.",
    detail: "Consults for beauty brands - uses SkinMinder for personal research"
  },
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Real results. Real people.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have transformed their skincare journey with data-backed insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-3xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              
              <p className="text-lg font-medium mb-6">"{testimonial.quote}"</p>
              
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border italic">
                {testimonial.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-primary">50K+</p>
            <p className="text-muted-foreground">Scans completed</p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">12K+</p>
            <p className="text-muted-foreground">Active users</p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">4.8</p>
            <p className="text-muted-foreground">App rating</p>
          </div>
          <div>
            <p className="text-4xl font-black text-primary">87%</p>
            <p className="text-muted-foreground">Weekly retention</p>
          </div>
        </div>

        {/* Dermatologist endorsement section */}
        <div className="mt-20 bg-card border border-border rounded-3xl p-12 text-center">
          <h2 className="text-2xl font-black mb-4">Trusted by skincare professionals</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Dermatologists and cosmetic chemists use SkinMinder as a complement to their professional practice, 
            recommending it to patients who want to take an active role in understanding their skin.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-black">50+</p>
              <p className="text-sm text-muted-foreground">Dermatologist partners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">100+</p>
              <p className="text-sm text-muted-foreground">Clinically reviewed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">0</p>
              <p className="text-sm text-muted-foreground">Adverse incidents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
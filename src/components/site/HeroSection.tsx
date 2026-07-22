import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { usePortfolioContent } from "@/content/PortfolioContentContext";

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const { site } = usePortfolioContent();
  const quietMotion = site.theme.motion === "quiet";
  const expressiveMotion = site.theme.motion === "expressive";
  const skipMotion = reduceMotion || quietMotion;

  return (
    <section className="pg-hero" aria-labelledby="home-title">
      <div className="pg-hero__rings" aria-hidden="true"><i /><i /><i /><i /></div>
      <motion.p
        className="pg-eyebrow pg-hero__eyebrow"
        initial={skipMotion ? false : { opacity: 0, y: expressiveMotion ? 22 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {site.hero.eyebrow}
      </motion.p>
      <motion.h1
        id="home-title"
        initial={skipMotion ? false : { opacity: 0, y: expressiveMotion ? 58 : 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: expressiveMotion ? 1 : 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        {site.hero.title}<br /><span>{site.hero.accentTitle}</span>
      </motion.h1>
      <motion.p
        className="pg-hero__introduction"
        initial={skipMotion ? false : { opacity: 0, y: expressiveMotion ? 34 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.22 }}
      >
        {site.hero.introduction}
      </motion.p>
      <a className="pg-scroll-cue" href="#selected-work">
        <span>Scroll through the work</span><ArrowDown aria-hidden="true" />
      </a>
    </section>
  );
}

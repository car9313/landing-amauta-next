import { motion } from "motion/react";

interface StepIllustrationProps {
  image: string;
  alt: string;
}

export function StepIllustration({
  image,
  alt,
}: StepIllustrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
      }}
      className="relative flex justify-center"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amauta-orange-light/20 to-amauta-blue-light/20 rounded-full blur-3xl scale-110" />

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <img
          src={image}
          alt={alt}
          className="w-[260px] sm:w-[320px] lg:w-[360px] drop-shadow-2xl select-none"
        />
      </motion.div>
    </motion.div>
  );
}
"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Fade up animation for sections
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Scale up animation
export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

// Motion wrapper components
interface MotionDivProps extends HTMLMotionProps<"div"> {
  className?: string;
  children: React.ReactNode;
}

export function FadeIn({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, className, delay = 0, ...props }: MotionDivProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0, ...props }: MotionDivProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  className,
  direction = "left",
  delay = 0,
  ...props
}: MotionDivProps & { direction?: "left" | "right" | "up" | "down"; delay?: number }) {
  const directionOffset = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Hover effects
export function HoverScale({ children, className, scale = 1.02, ...props }: MotionDivProps & { scale?: number }) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverGlow({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      whileHover={{
        boxShadow: "0 0 30px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2)",
      }}
      transition={{ duration: 0.3 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated background gradient
export function AnimatedGradient({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "absolute inset-0 opacity-30",
        className
      )}
      animate={{
        background: [
          "radial-gradient(circle at 0% 0%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 100% 100%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 100% 0%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 0% 100%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
          "radial-gradient(circle at 0% 0%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
        ],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Floating particles effect
export function FloatingParticles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-500/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated counter
export function AnimatedCounter({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.span>
    </motion.span>
  );
}

// Magnetic button effect
export function MagneticWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn("relative", className)}
      whileHover="hover"
    >
      <motion.div
        variants={{
          hover: {
            scale: 1.05,
          },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Text reveal animation
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <motion.div
      className={cn("flex flex-wrap gap-x-2", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Parallax wrapper
export function Parallax({
  children,
  className,
  offset = 50
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: offset }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, margin: "-200px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

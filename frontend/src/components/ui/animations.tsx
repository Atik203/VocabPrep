"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

// Fade in animation
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Scale animation
export function ScaleIn({
  children,
  delay = 0,
  ...props
}: {
  children: ReactNode;
  delay?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Slide in from direction
export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  ...props
}: {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
} & HTMLMotionProps<"div">) {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  ...props
}: {
  children: ReactNode;
  staggerDelay?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Child item for stagger
export function StaggerItem({
  children,
  ...props
}: {
  children: ReactNode;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Hover scale effect
export function HoverScale({
  children,
  scale = 1.02,
  ...props
}: {
  children: ReactNode;
  scale?: number;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      whileHover={{ scale, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Press animation
export function PressEffect({
  children,
  ...props
}: {
  children: ReactNode;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

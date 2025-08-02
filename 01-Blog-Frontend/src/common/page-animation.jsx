import { motion, AnimatePresence } from "motion/react";

const AnimationWrapper = ({
  children,
  keyValue,
  className,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1 },
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={initial}
        animate={animate}
        transition={transition}
        key={keyValue}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;

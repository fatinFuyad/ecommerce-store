import { motion } from "framer-motion";

export function AnimateTextFromTop({ children, ...props }) {
  return (
    <motion.h1
      className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      {...props}
    >
      {children}
    </motion.h1>
  );
}

export function AnimateFromTop({ children, ...props }) {
  return (
    <motion.div
      className="sm:mx-auto sm:w-full sm:max-w-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimateFromBottom({ children, ...props }) {
  return (
    <motion.div
      className="sm:mx-auto sm:w-full sm:max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimateFromLeft({ children, ...props }) {
  return (
    <motion.div
      className="sm:mx-auto sm:w-full sm:max-w-md"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
export function AnimateFromRight({ children, ...props }) {
  return (
    <motion.div
      className="sm:mx-auto sm:w-full sm:max-w-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimateAppear({ children }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
    >
      {children}
    </motion.div>
  );
}

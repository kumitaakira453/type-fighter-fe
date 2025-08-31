import { motion } from "framer-motion";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function PrimaryButton(props: PrimaryButtonProps) {
  const { children, onClick, disabled, className } = props;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      disabled={disabled}
      onClick={onClick}
      className={`
        px-8 py-3
        rounded-lg
        font-bold text-lg
        bg-yellow-400 text-black
        shadow-md
        hover:bg-yellow-300
        transition-colors duration-200
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className || ""}
      `}
    >
      {children}
    </motion.button>
  );
}

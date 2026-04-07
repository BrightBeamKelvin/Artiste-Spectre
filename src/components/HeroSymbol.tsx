import { motion, Variants } from 'framer-motion';

export const HeroSymbol = () => {
  const dotVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1 + i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex flex-col items-center gap-3 mb-8 pointer-events-none">
      {/* Row 1 */}
      <div className="flex gap-[10vw]">
        <motion.div custom={0} variants={dotVariants} initial="hidden" animate="visible" className="w-[1vw] h-[1vw] rounded-full bg-white/20" />
        <motion.div custom={1} variants={dotVariants} initial="hidden" animate="visible" className="w-[1vw] h-[1vw] rounded-full bg-white/20" />
      </div>
      
      {/* Row 2 */}
      <div className="flex gap-[5vw] items-center">
        <motion.div custom={2} variants={dotVariants} initial="hidden" animate="visible" className="w-[1vw] h-[1vw] rounded-full bg-white/20" />
        <motion.div 
          custom={3} 
          variants={{
            hidden: { opacity: 0, scale: 0, boxShadow: "0 0 0px #fff" },
            visible: { 
              opacity: 1, 
              scale: 1, 
              boxShadow: "0 0 10px #fff",
              transition: { delay: 1.5, duration: 0.8 }
            }
          }} 
          initial="hidden" 
          animate="visible" 
          className="w-[1.5vw] h-[1.5vw] rounded-full bg-white" 
        />
        <motion.div custom={4} variants={dotVariants} initial="hidden" animate="visible" className="w-[1vw] h-[1vw] rounded-full bg-white/20" />
      </div>

      {/* Row 3 */}
      <div className="flex gap-[4vw]">
        <motion.div custom={5} variants={dotVariants} initial="hidden" animate="visible" className="w-[1vw] h-[1vw] rounded-full bg-white/20" />
        <motion.div custom={6} variants={dotVariants} initial="hidden" animate="visible" className="w-[1vw] h-[1vw] rounded-full bg-white/20" />
      </div>

      {/* Row 4 */}
      <motion.div custom={7} variants={dotVariants} initial="hidden" animate="visible" className="w-[1vw] h-[1vw] rounded-full bg-white/20" />
    </div>
  );
};

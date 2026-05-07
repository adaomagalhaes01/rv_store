import { motion } from 'framer-motion';

const SkeletonProduct = () => {
  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] bg-neutral-light rounded-2xl overflow-hidden relative">
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-neutral-light rounded-full" />
          <div className="h-3 w-8 bg-neutral-light rounded-full" />
        </div>
        <div className="h-5 w-3/4 bg-neutral-light rounded-lg" />
        <div className="h-6 w-1/3 bg-neutral-light rounded-lg" />
      </div>
    </div>
  );
};

export default SkeletonProduct;

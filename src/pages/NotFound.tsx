import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { GradientBlobs } from '@/components/ui/decorative/GradientBlobs';

const NotFound = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <Layout>
      {/* Background elements */}
      <GradientBlobs />
      
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          className="text-center max-w-lg px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="mb-8 inline-block"
            variants={iconVariants}
          >
            <div className="w-24 h-24 mx-auto bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            variants={itemVariants}
          >
            404 - Page Not Found
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground text-lg mb-8"
            variants={itemVariants}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button 
              variant="accent" 
              size="lg"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Go Back
            </Button>
            
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Return Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;


import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedCardProps {
  number: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
  imageSrc: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  number,
  title,
  description,
  link,
  linkText,
  imageSrc,
}) => {
  // Handle fallback image in case the image fails to load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1560&auto=format&fit=crop';
  };

  return (
    <motion.div
      className="bg-navy-light rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="order-2 md:order-1 p-8 flex flex-col justify-center">
          <p className="text-accent-teal mb-2">{number}</p>
          <h3 className="text-2xl sm:text-3xl font-medium mb-4">{title}</h3>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">{description}</p>
          <Link
            to={link}
            className="inline-flex items-center text-white hover:text-accent-teal transition-colors group mt-auto"
          >
            {linkText}{" "}
            <ArrowRight
              size={18}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
        <div className="order-1 md:order-2 h-64 md:h-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-navy-dark/40 transition-opacity duration-300 hover:opacity-0 z-10"></div>
          <img
            src={imageSrc}
            alt={title}
            onError={handleImageError}
            className="w-full h-full object-cover transition-all duration-700 filter brightness-75 hover:brightness-100 hover:scale-105"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCard;

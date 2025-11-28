
import React from "react";
import { motion } from "framer-motion";

interface BookCardProps {
  title: string;
  author: string;
  image: string;
  link?: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, author, image, link }) => {
  const content = (
    <div className="flex flex-col">
      <div className="h-56 mb-4 overflow-hidden rounded-md shadow-md">
        <img
          src={image}
          alt={`${title} book cover`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <h3 className="text-base font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{author}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
};

export default BookCard;

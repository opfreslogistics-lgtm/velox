
import React from 'react';
import PageHero from '../PageHero';

interface TextPageProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

const TextPage: React.FC<TextPageProps> = ({ title, subtitle, content }) => {
  return (
    <div className="animate-fade-in-up min-h-screen bg-white dark:bg-brand-black transition-colors duration-300">
      <PageHero title={title} subtitle={subtitle} />
      <div className="max-w-4xl mx-auto px-6 py-16 prose dark:prose-invert prose-lg">
        {content}
      </div>
    </div>
  );
};

export default TextPage;

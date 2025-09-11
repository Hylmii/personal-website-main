import { forwardRef } from 'react';

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, className = '', children }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';

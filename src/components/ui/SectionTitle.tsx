interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`text-center mb-20 ${className}`}>
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-primary mb-6 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-xl md:text-2xl text-gray-300/80 max-w-4xl mx-auto leading-relaxed tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  );
};

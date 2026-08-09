import React from 'react';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ClassicBoxedTemplate from '../templates/ClassicBoxedTemplate';
import PremiumTemplate from '../templates/PremiumTemplate';

const CVPreview = ({ data }) => {
  const renderTemplate = () => {
    switch (data.selectedTemplate) {
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'classic-boxed':
        return <ClassicBoxedTemplate data={data} />;
      case 'premium':
        return <PremiumTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      default:
        return <ProfessionalTemplate data={data} />;
    }
  };

  return (
    <div className="a4-preview-container">
      <div id="pdf-content" style={{ width: '176mm' }}>
        {renderTemplate()}
      </div>
    </div>
  );
};

export default CVPreview;

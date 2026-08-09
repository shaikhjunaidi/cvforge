import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { Check } from 'lucide-react';
import CVPreview from '../components/CVPreview';

const Templates = () => {
  const { cvData, updateTemplate } = useCV();
  const navigate = useNavigate();

  const templates = [
    {
      id: 'premium',
      name: 'Premium Elegant',
      description: 'A breathtaking two-column modern design with a sleek colored sidebar. Guaranteed WOW factor.',
      color: '#4F46E5'
    },
    {
      id: 'professional',
      name: 'Professional Classic',
      description: 'A traditional, clean format perfect for corporate and formal applications.',
      color: '#1e3a8a'
    },
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'A sleek, contemporary design with subtle accents for modern industries.',
      color: '#0f172a'
    },
    {
      id: 'classic-boxed',
      name: 'Classic Boxed',
      description: 'A traditional structured format where sections are enclosed in neat borders and boxes.',
      color: '#000000'
    },
    {
      id: 'minimal',
      name: 'Simple Minimal',
      description: 'A stripped-down, highly readable layout focusing strictly on content.',
      color: '#475569'
    }
  ];

  const handleSelect = (id) => {
    updateTemplate(id);
    navigate('/create');
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Choose Your Template</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-muted)' }}>
        Select a template to start building your CV. You can change this later without losing data.
      </p>

      <div className="grid-3">
        {templates.map(tpl => (
          <div 
            key={tpl.id} 
            className="card" 
            style={{ 
              cursor: 'pointer', 
              border: cvData.selectedTemplate === tpl.id ? `2px solid var(--primary)` : '1px solid var(--border-color)',
              position: 'relative'
            }}
            onClick={() => handleSelect(tpl.id)}
          >
            {cvData.selectedTemplate === tpl.id && (
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '0.25rem' }}>
                <Check size={20} />
              </div>
            )}
            <div style={{ height: '250px', backgroundColor: '#f1f5f9', marginBottom: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden', paddingTop: '10px' }}>
               <div style={{ transform: 'scale(0.22)', transformOrigin: 'top center', pointerEvents: 'none' }}>
                  <CVPreview data={{ 
                    ...cvData, 
                    selectedTemplate: tpl.id, 
                    themeColor: tpl.color,
                    personalInfo: {
                      ...cvData.personalInfo,
                      fullName: cvData.personalInfo.fullName || 'YOUR NAME',
                      professionalTitle: cvData.personalInfo.professionalTitle || 'Professional Title',
                      email: cvData.personalInfo.email || 'email@example.com',
                      phone: cvData.personalInfo.phone || '+1 234 567 8900'
                    },
                    objective: cvData.objective || 'A highly motivated professional seeking to apply my skills and experience in a dynamic environment.',
                    experience: cvData.experience.length > 0 ? cvData.experience : [{ id: 1, designation: 'Job Title', company: 'Company Name', startDate: '2020', endDate: 'Present', responsibilities: ['Key responsibility or achievement goes here.'] }],
                    education: cvData.education.length > 0 ? cvData.education : [{ id: 1, qualification: 'Degree/Qualification', board: 'University', institute: 'Institute Name', year: '2023', score: 'GPA' }],
                    skills: cvData.skills.length > 0 ? cvData.skills : ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4']
                  }} />
               </div>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{tpl.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{tpl.description}</p>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              {cvData.selectedTemplate === tpl.id ? 'Selected' : 'Use Template'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;

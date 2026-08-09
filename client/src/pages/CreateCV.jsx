import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import ObjectiveForm from '../components/forms/ObjectiveForm';
import EducationForm from '../components/forms/EducationForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import SkillsForm from '../components/forms/SkillsForm';
import AdditionalForm from '../components/forms/AdditionalForm';
import CVPreview from '../components/CVPreview';
import { Download, Trash2, LayoutTemplate, Palette, Upload, Save, Type } from 'lucide-react';

const presetColors = ['#0f172a', '#4A55A2', '#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#000000'];

const presetFonts = [
  { name: 'Classic Sans', value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { name: 'Classic Serif', value: '"Times New Roman", Times, serif' },
  { name: 'Modern Sans', value: '"Outfit", "Inter", sans-serif' },
  { name: 'Elegant Serif', value: 'Georgia, serif' },
  { name: 'Monospace', value: '"Courier New", Courier, monospace' },
];

const ReorderModal = ({ currentOrder, onClose, onSave }) => {
  const [order, setOrder] = useState([...currentOrder]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  
  const handleDragStart = (e, index) => {
     setDraggedIdx(index);
     e.dataTransfer.effectAllowed = 'move';
     e.dataTransfer.setData('text/plain', index);
  };
  
  const handleDragOver = (e, index) => {
     e.preventDefault();
     if (draggedIdx === null || draggedIdx === index) return;
     const newOrder = [...order];
     const draggedItem = newOrder[draggedIdx];
     newOrder.splice(draggedIdx, 1);
     newOrder.splice(index, 0, draggedItem);
     setDraggedIdx(index);
     setOrder(newOrder);
  };
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
       <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Reorder Sections</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Drag and drop to rearrange your CV sections.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
             {order.map((key, index) => (
               <div 
                 key={key}
                 draggable
                 onDragStart={(e) => handleDragStart(e, index)}
                 onDragOver={(e) => handleDragOver(e, index)}
                 onDragEnd={() => setDraggedIdx(null)}
                 style={{ 
                   padding: '1rem', 
                   backgroundColor: draggedIdx === index ? '#f8fafc' : 'white',
                   border: '1px solid #cbd5e1',
                   borderRadius: '4px',
                   cursor: 'grab',
                   opacity: draggedIdx === index ? 0.5 : 1,
                   display: 'flex',
                   alignItems: 'center',
                   gap: '1rem',
                   fontWeight: '500',
                   userSelect: 'none'
                 }}
               >
                 <div style={{ color: '#94a3b8' }}>&#x2630;</div>
                 <span style={{ textTransform: 'capitalize' }}>{key}</span>
               </div>
             ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
             <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
             <button className="btn btn-primary" onClick={() => { onSave(order); onClose(); }}>Save Order</button>
          </div>
       </div>
    </div>
  );
}

const CreateCV = () => {
  const { cvData, clearData, loadSampleData, updateSectionOrder, updateThemeColor, updateFontFamily, loadData } = useCV();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(1122);
  const previewContainerRef = React.useRef(null);
  const cvContentRef = React.useRef(null);

  React.useEffect(() => {
    if (cvContentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContentHeight(entry.target.offsetHeight);
        }
      });
      resizeObserver.observe(cvContentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        // padding adjustment
        const availableWidth = previewContainerRef.current.offsetWidth - 32; 
        const a4Width = 794; // approx 210mm in pixels
        if (availableWidth < a4Width) {
          setScale(availableWidth / a4Width);
        } else {
          setScale(1);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Timeout to ensure DOM is rendered before measuring
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep]); // Re-run when switching steps just in case

  const stepsMap = {
     'objective': { name: 'Objective', component: ObjectiveForm },
     'education': { name: 'Education', component: EducationForm },
     'experience': { name: 'Experience', component: ExperienceForm },
     'skills': { name: 'Skills', component: SkillsForm },
     'additional': { name: 'Additional', component: AdditionalForm }
  };

  const currentOrder = cvData.sectionOrder || ['objective', 'education', 'experience', 'skills', 'additional'];

  const steps = [
    { id: 1, name: 'Personal', key: 'personal' },
    ...currentOrder.map((key, index) => ({
      id: index + 2,
      name: stepsMap[key].name,
      key: key
    }))
  ];

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvData)
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const fileName = cvData.personalInfo.fullName 
        ? `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf` 
        : 'My_CV.pdf';
        
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating your PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(cvData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = cvData.personalInfo.fullName 
        ? `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV_Backup.json` 
        : 'CV_Backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData && typeof importedData === 'object') {
           loadData(importedData);
           alert('CV Data imported successfully!');
        }
      } catch (err) {
        alert('Failed to parse file. Please make sure it is a valid CV JSON backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  const renderFormStep = () => {
    const currentStepConfig = steps.find(s => s.id === currentStep);
    if (!currentStepConfig || currentStepConfig.key === 'personal') return <PersonalInfoForm />;
    const Component = stepsMap[currentStepConfig.key].component;
    return <Component />;
  };

  return (
    <div className="cv-builder">
      {/* Left Column: Form */}
      <div className="builder-left">
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex-between">
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>CV Builder</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setShowReorderModal(true)} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>
                Reorder Sections
              </button>
              <button className="btn btn-danger" onClick={clearData} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }} title="Clear All Data">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-secondary" onClick={() => { setShowColorPicker(!showColorPicker); setShowFontPicker(false); }} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Palette size={14} /> Theme
              </button>
              {showColorPicker && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', zIndex: 50, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '200px' }}>
                  <p style={{ width: '100%', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Choose Accent Color</p>
                  {presetColors.map(color => (
                    <div 
                      key={color} 
                      onClick={() => { updateThemeColor(color); setShowColorPicker(false); }}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer', border: cvData.themeColor === color ? '2px solid black' : '1px solid #ccc' }}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={cvData.themeColor || '#000000'}
                    onChange={(e) => updateThemeColor(e.target.value)}
                    style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer' }}
                  />
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button className="btn btn-secondary" onClick={() => { setShowFontPicker(!showFontPicker); setShowColorPicker(false); }} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Type size={14} /> Font
              </button>
              {showFontPicker && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '220px' }}>
                  <p style={{ width: '100%', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Choose Font</p>
                  {presetFonts.map(font => (
                    <div 
                      key={font.name} 
                      onClick={() => { updateFontFamily(font.value); setShowFontPicker(false); }}
                      style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: cvData.fontFamily === font.value ? 'var(--bg-color)' : 'transparent', border: cvData.fontFamily === font.value ? '1px solid var(--border-color)' : '1px solid transparent', fontFamily: font.value, fontSize: '0.875rem' }}
                    >
                      {font.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-secondary" onClick={loadSampleData} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}>
              Load Sample Data
            </button>
            <button className="btn btn-secondary" onClick={handleExport} style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }} title="Save Data to File">
              <Save size={14} /> Export
            </button>
            <label className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', margin: 0 }} title="Load Data from File">
              <Upload size={14} /> Import
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hide-scrollbar" style={{ display: 'flex', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', gap: '0.5rem', flexShrink: 0 }}>
          {steps.map(step => (
            <div 
              key={step.id} 
              style={{ 
                flex: '1 0 auto', 
                minWidth: '100px',
                textAlign: 'center', 
                borderBottom: currentStep >= step.id ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                paddingBottom: '0.5rem',
                color: currentStep >= step.id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: currentStep === step.id ? '600' : '400',
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.name}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div style={{ flex: '1', marginBottom: '2rem' }}>
          {renderFormStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleBack} 
            disabled={currentStep === 1}
          >
            Back
          </button>
          {currentStep < steps.length ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Next Step
            </button>
          ) : (
            <div style={{ color: 'var(--success)', fontWeight: '500' }}>
              All sections completed!
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="builder-right">
        <div className="flex-between" style={{ width: '100%', maxWidth: '210mm', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Live Preview</h3>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
               <label htmlFor="themeColor" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Accent Color:</label>
               <input 
                 type="color" 
                 id="themeColor"
                 value={cvData.themeColor || '#0f172a'} 
                 onChange={(e) => updateThemeColor(e.target.value)}
                 style={{ width: '30px', height: '24px', padding: '0', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
                 title="Change Template Accent Color"
               />
             </div>
           </div>
           <button 
             className="btn btn-primary" 
             onClick={handleGeneratePDF}
             disabled={isGenerating}
             style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
           >
             <Download size={18} />
             {isGenerating ? 'Generating...' : 'Generate PDF'}
           </button>
        </div>
        
        {/* CV Preview Container */}
        <div 
          ref={previewContainerRef}
          style={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 0',
            height: scale < 1 ? `${contentHeight * scale + 32}px` : 'auto',
            overflow: 'visible'
        }}>
          <div 
            ref={cvContentRef}
            style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            width: '210mm'
          }}>
            <CVPreview data={cvData} />
          </div>
        </div>
      </div>
      
      {showReorderModal && (
        <ReorderModal 
          currentOrder={currentOrder} 
          onClose={() => setShowReorderModal(false)} 
          onSave={updateSectionOrder} 
        />
      )}
    </div>
  );
};

export default CreateCV;

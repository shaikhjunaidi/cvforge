import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import { Plus, X } from 'lucide-react';

const SkillsForm = () => {
  const { cvData, updateSkills } = useCV();
  const { skills } = cvData;
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      updateSkills([...skills, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (skillToRemove) => {
    updateSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Skills</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Add relevant skills like technologies, tools, or soft skills.
      </p>
      
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="form-control" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. Electrical Wiring, JavaScript, Project Management" 
        />
        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {skills.map((skill, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: 'var(--bg-color)', 
              border: '1px solid var(--border-color)', 
              padding: '0.25rem 0.5rem 0.25rem 0.75rem', 
              borderRadius: '2rem',
              fontSize: '0.875rem'
            }}
          >
            {skill}
            <button 
              type="button"
              onClick={() => handleRemove(skill)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-muted)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {skills.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0', fontSize: '0.875rem' }}>
          No skills added yet.
        </p>
      )}
    </div>
  );
};

export default SkillsForm;

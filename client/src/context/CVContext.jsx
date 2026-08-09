import React, { createContext, useState, useEffect, useContext } from 'react';

const CVContext = createContext();

export const CVProvider = ({ children }) => {
  const initialData = {
    personalInfo: {
      fullName: '',
      professionalTitle: '',
      fatherName: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      nationality: '',
      languages: '',
      maritalStatus: '',
      address: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
      photo: '', // Base64 image string
      includeDob: true,
      includeGender: true,
      includeMaritalStatus: true,
    },
    objective: '',
    education: [],
    experience: [],
    skills: [],
    additional: {
      passport: {
        include: false,
        number: '',
        dateOfIssue: '',
        dateOfExpiry: '',
        placeOfIssue: ''
      },
      certifications: { include: false, text: '' },
      achievements: { include: false, text: '' },
      hobbies: { include: false, text: '' },
      languages: { include: false, text: '' },
      references: { include: false, text: '' }
    },
    selectedTemplate: 'professional', // professional, modern, minimal, classic-boxed, premium
    themeColor: '#4A55A2', // Default accent color matches UI primary
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', // Default safe font
    sectionOrder: ['objective', 'experience', 'education', 'skills', 'additional']
  };

  const [cvData, setCvData] = useState(() => {
    const savedData = localStorage.getItem('cvforge_data');
    if (savedData) {
       const parsed = JSON.parse(savedData);
       // Handle backwards compatibility for users who don't have sectionOrder yet
       if (!parsed.sectionOrder) {
          parsed.sectionOrder = ['objective', 'experience', 'education', 'skills', 'additional'];
       }
       return parsed;
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('cvforge_data', JSON.stringify(cvData));
  }, [cvData]);

  const updatePersonalInfo = (data) => setCvData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data } }));
  const updateObjective = (data) => setCvData(prev => ({ ...prev, objective: data }));
  const updateEducation = (data) => setCvData(prev => ({ ...prev, education: data }));
  const updateExperience = (data) => setCvData(prev => ({ ...prev, experience: data }));
  const updateSkills = (data) => setCvData(prev => ({ ...prev, skills: data }));
  const updateAdditional = (section, data) => setCvData(prev => ({ ...prev, additional: { ...prev.additional, [section]: data } }));
  const updateTemplate = (template) => setCvData(prev => ({ ...prev, selectedTemplate: template }));
  const updateThemeColor = (color) => setCvData(prev => ({ ...prev, themeColor: color }));
  const updateFontFamily = (font) => setCvData(prev => ({ ...prev, fontFamily: font }));
  const updateSectionOrder = (order) => setCvData(prev => ({ ...prev, sectionOrder: order }));

  const clearData = () => {
    if (window.confirm("Are you sure you want to delete all CV information?")) {
      setCvData(initialData);
      localStorage.removeItem('cvforge_data');
    }
  };

  const loadSampleData = () => {
    const sample = {
      ...initialData,
      personalInfo: {
        ...initialData.personalInfo,
        fullName: 'SHAIKH JUNAID',
        professionalTitle: 'Electrical Technician | Electrician | Electrical Maintenance',
        email: '[Professional Email]',
        phone: '[Phone Number]',
        city: 'Kalaburagi',
        state: 'Karnataka',
        includeDob: false,
        includeGender: false,
        includeMaritalStatus: false,
      },
      objective: 'Electrical Technician with practical training and hands-on experience in electrical maintenance, wiring, troubleshooting, control panel wiring, and reading electrical diagrams. Seeking an opportunity to apply technical skills and contribute to safe and efficient electrical operations.',
      education: [
        {
          id: 1,
          qualification: 'ITI Electrician',
          board: 'NCVT',
          institute: 'Government ITI College',
          year: '2024',
          score: '85%'
        },
        {
          id: 2,
          qualification: 'SSLC',
          board: 'KSEEB',
          institute: 'Patashala High School',
          year: '2022',
          score: '82%'
        }
      ],
      experience: [
        {
          id: 1,
          company: 'United Spirits Ltd',
          designation: 'Training Electrician',
          location: 'Kalaburagi',
          startDate: '2024-10-01',
          endDate: '2025-09-30',
          current: false,
          responsibilities: [
            'Installation and maintenance of electrical systems',
            'Troubleshooting electrical equipment',
            'Reading electrical diagrams',
            'Repairing electrical fixtures',
            'Control panel wiring'
          ]
        }
      ],
      skills: ['Electrical Wiring', 'Electrical Troubleshooting', 'Control Panel Wiring', 'Electrical Maintenance', 'Blueprint / Electrical Diagram Reading'],
      additional: {
        ...initialData.additional,
        achievements: { include: true, text: 'Mind Marathon' },
        languages: { include: true, text: 'English | Kannada | Urdu | Hindi' }
      },
      selectedTemplate: 'professional'
    };
    setCvData(sample);
  };

  const loadData = (data) => {
    // Merge with initialData to ensure backwards compatibility with older exports
    setCvData({ ...initialData, ...data });
  };

  return (
    <CVContext.Provider value={{
      cvData,
      updatePersonalInfo,
      updateObjective,
      updateEducation,
      updateExperience,
      updateSkills,
      updateAdditional,
      updateTemplate,
      updateThemeColor,
      updateFontFamily,
      updateSectionOrder,
      clearData,
      loadSampleData,
      loadData
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => useContext(CVContext);

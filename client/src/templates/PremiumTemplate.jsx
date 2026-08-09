import React from 'react';

const PremiumTemplate = ({ data }) => {
  const { personalInfo, objective, education, experience, skills, additional } = data;
  const themeColor = data.themeColor || '#4F46E5';

  const styles = {
    container: {
      fontFamily: data.fontFamily || '"Outfit", "Inter", sans-serif',
      fontSize: '10pt',
      lineHeight: '1.6',
      color: '#1e293b',
      display: 'flex',
      minHeight: '100%',
      backgroundColor: '#f8fafc'
    },
    sidebar: {
      width: '32%',
      backgroundColor: themeColor,
      color: 'white',
      padding: '30px 20px',
      boxSizing: 'border-box'
    },
    main: {
      width: '68%',
      padding: '30px',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    name: {
      fontSize: '22pt',
      fontWeight: '800',
      letterSpacing: '1px',
      marginBottom: '5px',
      lineHeight: '1.1'
    },
    title: {
      fontSize: '11pt',
      fontWeight: '500',
      opacity: '0.9',
      marginBottom: '20px',
      borderBottom: '2px solid rgba(255,255,255,0.3)',
      paddingBottom: '15px'
    },
    sidebarSectionTitle: {
      fontSize: '12pt',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '10px',
      marginTop: '25px'
    },
    mainSectionTitle: {
      fontSize: '14pt',
      fontWeight: '700',
      color: themeColor,
      borderBottom: `2px solid ${themeColor}`,
      paddingBottom: '5px',
      marginBottom: '15px',
      marginTop: '20px'
    },
    contactItem: {
      fontSize: '9.5pt',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    skillPill: {
      display: 'inline-block',
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '9pt',
      marginBottom: '8px',
      marginRight: '8px'
    },
    contentBlock: {
      marginBottom: '15px'
    }
  };

  return (
    <div className="cv-template" style={{ padding: 0, height: '100%' }}>
      <div style={styles.container}>
        
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {personalInfo.photo && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={personalInfo.photo} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)' }} />
            </div>
          )}
          
          <div style={styles.name}>{personalInfo.fullName?.toUpperCase()}</div>
          {personalInfo.professionalTitle && <div style={styles.title}>{personalInfo.professionalTitle}</div>}

          <div style={styles.sidebarSectionTitle}>Contact</div>
          {personalInfo.phone && <div style={styles.contactItem}>{personalInfo.phone}</div>}
          {personalInfo.email && <div style={styles.contactItem}>{personalInfo.email}</div>}
          {personalInfo.city && <div style={styles.contactItem}>{personalInfo.city}{personalInfo.state ? `, ${personalInfo.state}` : ''}</div>}
          
          {skills && skills.length > 0 && (
            <>
              <div style={styles.sidebarSectionTitle}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {skills.map((skill, index) => (
                  <span key={index} style={styles.skillPill}>{skill}</span>
                ))}
              </div>
            </>
          )}

          {additional && additional.languages && additional.languages.include && additional.languages.text && (
            <>
              <div style={styles.sidebarSectionTitle}>Languages</div>
              <div style={{ fontSize: '9.5pt', lineHeight: '1.5' }}>
                {additional.languages.text.split('|').map((lang, i) => (
                  <div key={i}>{lang.trim()}</div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          {(data.sectionOrder || ['objective', 'experience', 'education', 'skills', 'additional']).map(section => {
            switch (section) {
              case 'objective':
                return objective ? (
                  <div key="objective" className="avoid-break">
                    <div style={styles.mainSectionTitle}>Professional Summary</div>
                    <p style={{ textAlign: 'justify' }}>{objective}</p>
                  </div>
                ) : null;
              case 'experience':
                return experience && experience.length > 0 ? (
                  <div key="experience">
                    <div style={styles.mainSectionTitle} className="avoid-break">Experience</div>
                    {experience.map(exp => (
                      <div key={exp.id} style={styles.contentBlock} className="section-block">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '11pt', color: '#1e293b' }}>
                          <div>{exp.designation}</div>
                          <div style={{ color: themeColor, fontSize: '9.5pt' }}>{exp.startDate} to {exp.current ? 'Present' : exp.endDate}</div>
                        </div>
                        <div style={{ fontStyle: 'italic', color: '#64748b', marginBottom: '8px' }}>
                          {exp.company}{exp.location ? `, ${exp.location}` : ''}
                        </div>
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul style={{ margin: '0 0 0 15px', padding: 0 }}>
                            {exp.responsibilities.map((resp, i) => resp && <li key={i} style={{ marginBottom: '4px' }}>{resp}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null;
              case 'education':
                return education && education.length > 0 ? (
                  <div key="education">
                    <div style={styles.mainSectionTitle} className="avoid-break">Education</div>
                    {education.map(edu => (
                      <div key={edu.id} style={styles.contentBlock} className="section-block">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                          <div>{edu.qualification}</div>
                          <div style={{ color: themeColor, fontSize: '9.5pt' }}>{edu.year}</div>
                        </div>
                        <div style={{ color: '#475569' }}>{edu.institute} - {edu.board}</div>
                        <div style={{ fontSize: '9.5pt', color: '#64748b', marginTop: '2px' }}>Score: {edu.score}</div>
                      </div>
                    ))}
                  </div>
                ) : null;
              case 'additional':
                return (
                  <div key="additional">
                    {additional && additional.achievements && additional.achievements.include && additional.achievements.text && (
                      <div style={styles.contentBlock} className="section-block avoid-break">
                        <div style={styles.mainSectionTitle}>Achievements</div>
                        <p>{additional.achievements.text}</p>
                      </div>
                    )}
                    {additional && additional.certifications && additional.certifications.include && additional.certifications.text && (
                      <div style={styles.contentBlock} className="section-block avoid-break">
                        <div style={styles.mainSectionTitle}>Certifications</div>
                        <p>{additional.certifications.text}</p>
                      </div>
                    )}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumTemplate;

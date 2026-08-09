import React from 'react';

const ProfessionalTemplate = ({ data }) => {
  const { personalInfo, objective, education, experience, skills, additional } = data;

  const styles = {
    container: {
      fontFamily: data.fontFamily || '"Times New Roman", Times, serif',
      fontSize: '11pt',
      lineHeight: '1.4',
      color: '#000',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '18pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: '10px'
    },
    contactInfo: {
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    sectionTitle: {
      fontSize: '13pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      borderBottom: '1px solid #000',
      paddingBottom: '3px',
      marginBottom: '10px',
      marginTop: '15px'
    },
    contentBlock: {
      marginBottom: '10px'
    },
    flexRow: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    bold: {
      fontWeight: 'bold'
    },
    list: {
      marginTop: '5px',
      marginBottom: '5px',
      paddingLeft: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px',
      marginBottom: '10px'
    },
    th: {
      border: '1px solid #000',
      padding: '5px',
      textAlign: 'left',
      fontWeight: 'bold'
    },
    td: {
      border: '1px solid #000',
      padding: '5px'
    }
  };

  return (
    <div className="cv-template" style={styles.container}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1, textAlign: personalInfo.photo ? 'left' : 'center' }}>
          {personalInfo.fullName && <div style={{ fontSize: '20pt', fontWeight: 'bold', marginBottom: '5px' }}>{personalInfo.fullName.toUpperCase()}</div>}
          {personalInfo.professionalTitle && <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>{personalInfo.professionalTitle}</div>}
          <div style={styles.contactInfo}>
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.city && <span>, {personalInfo.city}</span>}
            {personalInfo.state && <span>, {personalInfo.state}</span>}
            {personalInfo.pinCode && <span> - {personalInfo.pinCode}</span>}
            <br />
            {personalInfo.phone && <span>Mobile: {personalInfo.phone}</span>}
            {personalInfo.email && <span> | Email: {personalInfo.email}</span>}
          </div>
        </div>
        {personalInfo.photo && (
          <div style={{ marginLeft: '20px' }}>
            <img src={personalInfo.photo} alt="Profile" style={{ width: '100px', height: '120px', objectFit: 'cover', border: '1px solid #000', padding: '2px' }} />
          </div>
        )}
      </div>

      {/* Reorderable Sections */}
      {(data.sectionOrder || ['objective', 'experience', 'education', 'skills', 'additional']).map(section => {
        switch (section) {
          case 'objective':
            return objective ? (
              <div key="objective" className="avoid-break">
                <div style={styles.sectionTitle}>Career Objective</div>
                <p>{objective}</p>
              </div>
            ) : null;
          case 'experience':
            return experience.length > 0 ? (
              <div key="experience">
                <div style={styles.sectionTitle} className="avoid-break">Work Experience</div>
                {experience.map((exp) => (
                  <div key={exp.id} style={styles.contentBlock} className="section-block">
                    <div style={styles.flexRow}>
                      <div style={styles.bold}>{exp.designation}</div>
                      <div>{exp.startDate} to {exp.current ? 'Present' : exp.endDate}</div>
                    </div>
                    <div style={{ fontStyle: 'italic' }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </div>
                    {exp.responsibilities.length > 0 && (
                      <ul style={styles.list}>
                        {exp.responsibilities.map((resp, i) => (
                          resp && <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : null;
          case 'education':
            return education.length > 0 ? (
              <div key="education">
                <div style={styles.sectionTitle} className="avoid-break">Educational Qualification</div>
                <table style={styles.table}>
                  <thead className="avoid-break">
                    <tr>
                      <th style={{...styles.th, textAlign: 'left', width: '20%'}}>Qualification</th>
                      <th style={{...styles.th, textAlign: 'left', width: '20%'}}>Board / University</th>
                      <th style={{...styles.th, textAlign: 'left', width: '30%'}}>Institute</th>
                      <th style={{...styles.th, textAlign: 'center', width: '15%'}}>Year</th>
                      <th style={{...styles.th, textAlign: 'right', width: '15%'}}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {education.map((edu) => (
                      <tr key={edu.id} className="avoid-break">
                        <td style={{...styles.td, textAlign: 'left'}}>{edu.qualification}</td>
                        <td style={{...styles.td, textAlign: 'left'}}>{edu.board}</td>
                        <td style={{...styles.td, textAlign: 'left'}}>{edu.institute}</td>
                        <td style={{...styles.td, textAlign: 'center'}}>{edu.year}</td>
                        <td style={{...styles.td, textAlign: 'right'}}>{edu.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null;
          case 'skills':
            return skills.length > 0 ? (
              <div key="skills" className="avoid-break">
                <div style={styles.sectionTitle}>Technical Skills</div>
                <ul style={{ ...styles.list, display: 'flex', flexWrap: 'wrap', gap: '20px', listStyleType: 'square' }}>
                  {skills.map((skill, i) => (
                    <li key={i} style={{ width: '40%' }}>{skill}</li>
                  ))}
                </ul>
              </div>
            ) : null;
          case 'additional':
            return (
              <React.Fragment key="additional">
                {additional.certifications.include && additional.certifications.text && (
                  <div className="section-block">
                    <div style={styles.sectionTitle} className="avoid-break">Certifications</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{additional.certifications.text}</div>
                  </div>
                )}
                {additional.achievements.include && additional.achievements.text && (
                  <div className="section-block">
                    <div style={styles.sectionTitle} className="avoid-break">Achievements</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{additional.achievements.text}</div>
                  </div>
                )}
                {additional.hobbies.include && additional.hobbies.text && (
                  <div className="section-block">
                    <div style={styles.sectionTitle} className="avoid-break">Hobbies & Interests</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{additional.hobbies.text}</div>
                  </div>
                )}
                {additional.passport.include && additional.passport.number && (
                  <div className="section-block">
                    <div style={styles.sectionTitle} className="avoid-break">Passport Details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '5px' }}>
                      <div style={styles.bold}>Passport Number:</div><div>{additional.passport.number}</div>
                      {additional.passport.placeOfIssue && <><div style={styles.bold}>Place of Issue:</div><div>{additional.passport.placeOfIssue}</div></>}
                      {additional.passport.dateOfIssue && <><div style={styles.bold}>Date of Issue:</div><div>{additional.passport.dateOfIssue}</div></>}
                      {additional.passport.dateOfExpiry && <><div style={styles.bold}>Date of Expiry:</div><div>{additional.passport.dateOfExpiry}</div></>}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          default:
            return null;
        }
      })}

      {/* Personal Details */}
      <div className="avoid-break">
        <div style={styles.sectionTitle}>Personal Profile</div>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '5px' }}>
          {personalInfo.fullName && <><div style={styles.bold}>Name:</div><div>{personalInfo.fullName}</div></>}
          {personalInfo.fatherName && <><div style={styles.bold}>Father's Name:</div><div>{personalInfo.fatherName}</div></>}
          {personalInfo.includeDob && personalInfo.dob && <><div style={styles.bold}>Date of Birth:</div><div>{personalInfo.dob}</div></>}
          {personalInfo.includeGender && personalInfo.gender && <><div style={styles.bold}>Gender:</div><div>{personalInfo.gender}</div></>}
          {personalInfo.includeMaritalStatus && personalInfo.maritalStatus && <><div style={styles.bold}>Marital Status:</div><div>{personalInfo.maritalStatus}</div></>}
          {personalInfo.nationality && <><div style={styles.bold}>Nationality:</div><div>{personalInfo.nationality}</div></>}
          {additional.languages.include && additional.languages.text && <><div style={styles.bold}>Languages Known:</div><div style={{ whiteSpace: 'pre-line' }}>{additional.languages.text}</div></>}
        </div>
      </div>

      {/* Declaration */}
      <div style={{ marginTop: '30px' }} className="avoid-break">
        <div style={styles.sectionTitle}>Declaration</div>
        <p>I hereby declare that all the above-mentioned information is true and correct to the best of my knowledge and belief.</p>
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
           <div>
             <div>Place: {personalInfo.city || '________________'}</div>
             <div>Date: ________________</div>
           </div>
           <div style={{ textAlign: 'right' }}>
              <div>_________________________</div>
              <div style={styles.bold}>({personalInfo.fullName || 'Signature'})</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;

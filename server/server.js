const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const cvData = req.body;
    
    // Generate HTML based on the template
    const htmlContent = generateHTML(cvData);

    const isProduction = process.env.NODE_ENV === 'production';
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: "new",
      executablePath: isProduction ? '/usr/bin/google-chrome' : undefined
    });
    
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '25mm',
        right: '0px',
        bottom: '25mm',
        left: '0px'
      }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

function generateHTML(data) {
  const { selectedTemplate } = data;
  
  const baseCSS = `
    @page { size: A4; margin: 0; } /* Handled by Puppeteer */
    body { margin: 0; padding: 0; box-sizing: border-box; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .cv-template { padding: 0 25mm; box-sizing: border-box; }
    .contentBlock, .sectionTitle, .header, table, tr, ul, .section { page-break-inside: avoid; }
    div { page-break-inside: auto; }
  `;

  if (selectedTemplate === 'professional') {
    return generateProfessionalHTML(data, baseCSS);
  } else if (selectedTemplate === 'modern') {
    return generateModernHTML(data, baseCSS);
  } else if (selectedTemplate === 'classic-boxed') {
    return generateClassicBoxedHTML(data, baseCSS);
  } else if (selectedTemplate === 'premium') {
    return generatePremiumHTML(data, baseCSS);
  } else if (selectedTemplate === 'minimal') {
    return generateMinimalHTML(data, baseCSS);
  }
  
  return generateProfessionalHTML(data, baseCSS);
}

function generateProfessionalHTML(data, baseCSS) {
  const { personalInfo, objective, education, experience, skills, additional } = data;
  const fontFamily = data.fontFamily || '"Times New Roman", Times, serif';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
      <style>
        ${baseCSS}
        .container { font-family: ${fontFamily}; font-size: 11pt; line-height: 1.4; color: #000; padding: 0 !important; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 18pt; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
        .sectionTitle { font-size: 13pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px; margin-top: 15px; }
        .bold { font-weight: bold; }
        .flexRow { display: flex; justify-content: space-between; }
        .list { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: left; }
        th { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="cv-template container">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
          <div style="flex: 1; text-align: ${personalInfo.photo ? 'left' : 'center'};">
            ${personalInfo.fullName ? `<div style="font-size: 20pt; font-weight: bold; margin-bottom: 5px;">${personalInfo.fullName.toUpperCase()}</div>` : ''}
            ${personalInfo.professionalTitle ? `<div style="font-size: 12pt; font-weight: bold; color: #333; margin-bottom: 10px;">${personalInfo.professionalTitle}</div>` : ''}
            <div>
              ${personalInfo.address ? `<span>${personalInfo.address}</span>` : ''}
              ${personalInfo.city ? `<span>, ${personalInfo.city}</span>` : ''}
              ${personalInfo.state ? `<span>, ${personalInfo.state}</span>` : ''}
              ${personalInfo.pinCode ? `<span> - ${personalInfo.pinCode}</span>` : ''}<br>
              ${personalInfo.phone ? `<span>Mobile: ${personalInfo.phone}</span>` : ''}
              ${personalInfo.email ? `<span> | Email: ${personalInfo.email}</span>` : ''}
            </div>
          </div>
          ${personalInfo.photo ? `
            <div style="margin-left: 20px;">
              <img src="${personalInfo.photo}" alt="Profile" style="width: 100px; height: 120px; object-fit: cover; border: 1px solid #000; padding: 2px;" />
            </div>
          ` : ''}
        </div>

        ${(data.sectionOrder || ['objective', 'experience', 'education', 'skills', 'additional']).map(section => {
          if (section === 'objective') {
            return objective ? `
              <div class="sectionTitle">Career Objective</div>
              <p>${objective}</p>
            ` : '';
          }
          if (section === 'experience') {
            return experience.length > 0 ? `
              <div class="sectionTitle">Work Experience</div>
              ${experience.map(exp => `
                <div style="margin-bottom: 10px;">
                  <div class="flexRow">
                    <div class="bold">${exp.designation}</div>
                    <div>${exp.startDate} to ${exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div style="font-style: italic;">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                  ${exp.responsibilities.length > 0 ? `
                    <ul class="list">
                      ${exp.responsibilities.map(resp => resp ? `<li>${resp}</li>` : '').join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            ` : '';
          }
          if (section === 'education') {
            return education.length > 0 ? `
              <div class="sectionTitle">Educational Qualification</div>
              <table>
                <tr>
                  <th style="text-align: left; width: 20%;">Qualification</th>
                  <th style="text-align: left; width: 20%;">Board / University</th>
                  <th style="text-align: left; width: 30%;">Institute</th>
                  <th style="text-align: center; width: 15%;">Year</th>
                  <th style="text-align: right; width: 15%;">Score</th>
                </tr>
                ${education.map(edu => `
                  <tr>
                    <td style="text-align: left;">${edu.qualification}</td>
                    <td style="text-align: left;">${edu.board}</td>
                    <td style="text-align: left;">${edu.institute}</td>
                    <td style="text-align: center;">${edu.year}</td>
                    <td style="text-align: right;">${edu.score}</td>
                  </tr>
                `).join('')}
              </table>
            ` : '';
          }
          if (section === 'skills') {
            return skills.length > 0 ? `
              <div class="sectionTitle">Technical Skills</div>
              <ul class="list" style="display: flex; flex-wrap: wrap; gap: 20px; list-style-type: square;">
                ${skills.map(skill => `<li style="width: 40%;">${skill}</li>`).join('')}
              </ul>
            ` : '';
          }
          if (section === 'additional') {
            return `
              ${additional.certifications.include && additional.certifications.text ? `
                <div class="sectionTitle">Certifications</div>
                <div style="white-space: pre-line;">${additional.certifications.text}</div>
              ` : ''}
              ${additional.achievements.include && additional.achievements.text ? `
                <div class="sectionTitle">Achievements</div>
                <div style="white-space: pre-line;">${additional.achievements.text}</div>
              ` : ''}
              ${additional.hobbies.include && additional.hobbies.text ? `
                <div class="sectionTitle">Hobbies & Interests</div>
                <div style="white-space: pre-line;">${additional.hobbies.text}</div>
              ` : ''}
              ${additional.passport.include && additional.passport.number ? `
                <div class="sectionTitle">Passport Details</div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 5px;">
                  <div class="bold">Passport Number:</div><div>${additional.passport.number}</div>
                  ${additional.passport.placeOfIssue ? `<div class="bold">Place of Issue:</div><div>${additional.passport.placeOfIssue}</div>` : ''}
                  ${additional.passport.dateOfIssue ? `<div class="bold">Date of Issue:</div><div>${additional.passport.dateOfIssue}</div>` : ''}
                  ${additional.passport.dateOfExpiry ? `<div class="bold">Date of Expiry:</div><div>${additional.passport.dateOfExpiry}</div>` : ''}
                </div>
              ` : ''}
            `;
          }
          return '';
        }).join('')}

        <div class="sectionTitle">Personal Profile</div>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 5px;">
          ${personalInfo.fullName ? `<div class="bold">Name:</div><div>${personalInfo.fullName}</div>` : ''}
          ${personalInfo.fatherName ? `<div class="bold">Father's Name:</div><div>${personalInfo.fatherName}</div>` : ''}
          ${personalInfo.includeDob && personalInfo.dob ? `<div class="bold">Date of Birth:</div><div>${personalInfo.dob}</div>` : ''}
          ${personalInfo.includeGender && personalInfo.gender ? `<div class="bold">Gender:</div><div>${personalInfo.gender}</div>` : ''}
          ${personalInfo.includeMaritalStatus && personalInfo.maritalStatus ? `<div class="bold">Marital Status:</div><div>${personalInfo.maritalStatus}</div>` : ''}
          ${personalInfo.nationality ? `<div class="bold">Nationality:</div><div>${personalInfo.nationality}</div>` : ''}
          ${additional.languages.include && additional.languages.text ? `<div class="bold">Languages Known:</div><div style="white-space: pre-line;">${additional.languages.text}</div>` : ''}
        </div>

        <div style="margin-top: 30px;">
          <div class="sectionTitle">Declaration</div>
          <p>I hereby declare that all the above-mentioned information is true and correct to the best of my knowledge and belief.</p>
          <div style="margin-top: 30px; display: flex; justify-content: space-between;">
             <div>
               <div>Place: ${personalInfo.city || '________________'}</div>
               <div>Date: ________________</div>
             </div>
             <div style="text-align: right;">
                <div>_________________________</div>
                <div class="bold">(${personalInfo.fullName || 'Signature'})</div>
             </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateModernHTML(data, baseCSS) {
  const { personalInfo, objective, education, experience, skills, additional } = data;
  const themeColor = data.themeColor || '#4A55A2';
  const fontFamily = data.fontFamily || '"Outfit", "Inter", sans-serif';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
      <style>
        ${baseCSS}
        .container { font-family: ${fontFamily}; font-size: 10pt; line-height: 1.5; color: #334155; padding: 0 !important; }
        .header { background-color: ${themeColor}; color: white; padding: 30px; margin-bottom: 20px; }
        .name { font-size: 24pt; font-weight: bold; letter-spacing: 1px; margin-bottom: 10px; }
        .sectionTitle { font-size: 14pt; font-weight: bold; color: ${themeColor}; border-bottom: 2px solid ${themeColor}; padding-bottom: 5px; margin-bottom: 15px; margin-top: 20px; }
        .bold { font-weight: bold; }
        .flexRow { display: flex; justify-content: space-between; }
        .list { margin: 5px 0 10px 20px; padding: 0; }
        .skillPill { display: inline-block; background-color: #e2e8f0; color: ${themeColor}; padding: 4px 10px; border-radius: 15px; font-size: 10pt; margin-right: 8px; margin-bottom: 8px; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="cv-template" style="background: white;">
        <div style="background-color: ${themeColor || '#2563eb'}; color: white; padding: 40px 40px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            ${personalInfo.fullName ? `<div class="name">${personalInfo.fullName.toUpperCase()}</div>` : ''}
            ${personalInfo.professionalTitle ? `<div style="font-size: 12pt; font-weight: 500; margin-bottom: 15px; opacity: 0.95;">${personalInfo.professionalTitle}</div>` : ''}
            <div style="display: flex; gap: 15px; font-size: 10pt; opacity: 0.9;">
              ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
              ${personalInfo.phone ? `<span>• ${personalInfo.phone}</span>` : ''}
              ${personalInfo.city ? `<span>• ${personalInfo.city}</span>` : ''}
            </div>
          </div>
          ${personalInfo.photo ? `
            <div style="margin-left: 20px;">
              <img src="${personalInfo.photo}" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid white;" />
            </div>
          ` : ''}
        </div>
        <div style="padding: 20px 40px 40px;">
          ${(data.sectionOrder || ['objective', 'experience', 'education', 'skills', 'additional']).map(section => {
            if (section === 'objective') {
              return objective ? `<div class="sectionTitle">PROFESSIONAL SUMMARY</div><p>${objective}</p>` : '';
            }
            if (section === 'experience') {
              return experience.length > 0 ? `
                <div class="sectionTitle">EXPERIENCE</div>
                ${experience.map(exp => `
                  <div style="margin-bottom: 15px;">
                    <div class="flexRow">
                      <div class="bold" style="font-size: 12pt;">${exp.designation}</div>
                      <div style="font-size: 10pt; color: #64748b; font-weight: 500;">${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}</div>
                    </div>
                    <div style="font-size: 11pt; color: #0f172a; margin-bottom: 8px;">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</div>
                    ${exp.responsibilities.length > 0 ? `
                      <ul class="list">
                        ${exp.responsibilities.map(resp => resp ? `<li>${resp}</li>` : '').join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              ` : '';
            }
            if (section === 'education') {
              return education.length > 0 ? `
                <div class="sectionTitle">EDUCATION</div>
                ${education.map(edu => `
                  <div style="margin-bottom: 15px;">
                    <div class="flexRow">
                      <div class="bold">${edu.qualification}</div>
                      <div style="font-size: 10pt; color: #64748b;">${edu.year}</div>
                    </div>
                    <div>${edu.institute}, ${edu.board}</div>
                  </div>
                `).join('')}
              ` : '';
            }
            if (section === 'skills') {
              return skills.length > 0 ? `
                <div class="sectionTitle">SKILLS</div>
                <div style="display: flex; flex-wrap: wrap;">
                  ${skills.map(skill => `<div class="skillPill">${skill}</div>`).join('')}
                </div>
              ` : '';
            }
            if (section === 'additional') {
              return `
                ${additional.certifications.include && additional.certifications.text ? `
                  <div class="sectionTitle">CERTIFICATIONS</div>
                  <div style="white-space: pre-line;">${additional.certifications.text}</div>
                ` : ''}
                ${additional.achievements.include && additional.achievements.text ? `
                  <div class="sectionTitle">ACHIEVEMENTS</div>
                  <div style="white-space: pre-line;">${additional.achievements.text}</div>
                ` : ''}
                ${additional.hobbies.include && additional.hobbies.text ? `
                  <div class="sectionTitle">HOBBIES & INTERESTS</div>
                  <div style="white-space: pre-line;">${additional.hobbies.text}</div>
                ` : ''}
              `;
            }
            return '';
          }).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateClassicBoxedHTML(data, baseCSS) {
  const { personalInfo, objective, education, experience, skills, additional } = data;
  const fontFamily = data.fontFamily || '"Times New Roman", Times, serif';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
      <style>
        ${baseCSS}
        .page-border { position: fixed; top: 0; bottom: 0; left: 15mm; right: 15mm; border: 2px solid #000; z-index: -1; }
        .cv-table { width: calc(100% - 30mm); margin: 0 15mm; border-collapse: collapse; border: none; }
        .cv-table td { border: none; padding: 0; }
        .inner-content { font-family: ${fontFamily}; font-size: 11pt; line-height: 1.4; color: #000; padding: 0 35px; }
        .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .title { font-size: 16pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; margin-bottom: 10px; }
        .sectionBox { border: 1px solid #000; margin-bottom: 15px; padding: 10px; }
        .sectionTitle { font-size: 12pt; font-weight: bold; text-transform: uppercase; background-color: #e5e5e5; border: 1px solid #000; padding: 4px 8px; margin-bottom: 10px; margin-top: 15px; }
        .bold { font-weight: bold; }
        .flexRow { display: flex; justify-content: space-between; }
        .list { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
        table.inner-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
        table.inner-table th, table.inner-table td { border: 1px solid #000; padding: 5px; text-align: left; }
        table.inner-table th { font-weight: bold; background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="page-border"></div>
      <table class="cv-table">
        <thead><tr><td style="height: 35px;"></td></tr></thead>
        <tfoot><tr><td style="height: 35px;"></td></tr></tfoot>
        <tbody>
          <tr>
            <td>
              <div class="inner-content">
          <div class="header" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1; text-align: ${personalInfo.photo ? 'left' : 'center'};">
              ${personalInfo.fullName ? `<div style="font-size: 20pt; font-weight: bold;">${personalInfo.fullName.toUpperCase()}</div>` : ''}
              ${personalInfo.professionalTitle ? `<div style="font-size: 12pt; font-weight: bold; margin: 5px 0 10px 0;">${personalInfo.professionalTitle}</div>` : ''}
              <div>
                ${personalInfo.address ? `<span>${personalInfo.address}</span>` : ''}
                ${personalInfo.city ? `<span>, ${personalInfo.city}</span>` : ''}
                ${personalInfo.state ? `<span>, ${personalInfo.state}</span>` : ''}
                ${personalInfo.pinCode ? `<span> - ${personalInfo.pinCode}</span>` : ''}<br>
                ${personalInfo.phone ? `<span>Mobile: ${personalInfo.phone}</span>` : ''}
                ${personalInfo.email ? `<span> | Email: ${personalInfo.email}</span>` : ''}
              </div>
            </div>
            ${personalInfo.photo ? `
              <div style="margin-left: 20px;">
                <img src="${personalInfo.photo}" alt="Profile" style="width: 100px; height: 120px; object-fit: cover; border: 1px solid #000; padding: 2px;" />
              </div>
            ` : ''}
          </div>

          ${(data.sectionOrder || ['objective', 'experience', 'education', 'skills', 'additional']).map(section => {
            if (section === 'objective') {
              return objective ? `
                <div style="page-break-inside: avoid; margin-bottom: 5px;">
                  <div class="sectionTitle">Career Objective</div>
                  <div class="sectionBox"><p style="margin: 0;">${objective}</p></div>
                </div>
              ` : '';
            }
            if (section === 'experience') {
              return experience.length > 0 ? `
                <div style="page-break-inside: avoid; margin-bottom: 5px;">
                  <div class="sectionTitle">Work Experience</div>
                  <div class="sectionBox">
                    ${experience.map((exp, index) => `
                      <div style="margin-bottom: 10px; border-bottom: ${index < experience.length - 1 ? '1px dashed #000' : 'none'}; padding-bottom: ${index < experience.length - 1 ? '10px' : '0'};">
                        <div class="flexRow">
                          <div class="bold">${exp.designation}</div>
                          <div>${exp.startDate} to ${exp.current ? 'Present' : exp.endDate}</div>
                        </div>
                        <div style="font-style: italic;">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                        ${exp.responsibilities.length > 0 ? `
                          <ul class="list">
                            ${exp.responsibilities.map(resp => resp ? `<li>${resp}</li>` : '').join('')}
                          </ul>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : '';
            }
            if (section === 'education') {
              return education.length > 0 ? `
                <div style="page-break-inside: avoid; margin-bottom: 5px;">
                  <div class="sectionTitle">Educational Qualification</div>
                  <table class="inner-table" style="margin-bottom: 0;">
                    <tr>
                      <th style="text-align: left; width: 20%;">Qualification</th>
                      <th style="text-align: left; width: 20%;">Board / University</th>
                      <th style="text-align: left; width: 30%;">Institute</th>
                      <th style="text-align: center; width: 15%;">Year</th>
                      <th style="text-align: right; width: 15%;">Score</th>
                    </tr>
                    ${education.map(edu => `
                      <tr>
                        <td style="text-align: left;">${edu.qualification}</td>
                        <td style="text-align: left;">${edu.board}</td>
                        <td style="text-align: left;">${edu.institute}</td>
                        <td style="text-align: center;">${edu.year}</td>
                        <td style="text-align: right;">${edu.score}</td>
                      </tr>
                    `).join('')}
                  </table>
                </div>
              ` : '';
            }
            if (section === 'skills') {
              return skills.length > 0 ? `
                <div style="page-break-inside: avoid; margin-bottom: 5px;">
                  <div class="sectionTitle">Technical Skills</div>
                  <div class="sectionBox">
                    <ul style="margin: 0; padding-left: 20px; display: flex; flex-wrap: wrap; gap: 20px; list-style-type: square;">
                      ${skills.map(skill => `<li style="width: 40%;">${skill}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              ` : '';
            }
            if (section === 'additional') {
              return `
                ${additional.certifications.include && additional.certifications.text ? `
                  <div style="page-break-inside: avoid; margin-bottom: 5px;">
                    <div class="sectionTitle">Certifications</div>
                    <div class="sectionBox"><div style="white-space: pre-line;">${additional.certifications.text}</div></div>
                  </div>
                ` : ''}
                ${additional.achievements.include && additional.achievements.text ? `
                  <div style="page-break-inside: avoid; margin-bottom: 5px;">
                    <div class="sectionTitle">Achievements</div>
                    <div class="sectionBox"><div style="white-space: pre-line;">${additional.achievements.text}</div></div>
                  </div>
                ` : ''}
                ${additional.hobbies.include && additional.hobbies.text ? `
                  <div style="page-break-inside: avoid; margin-bottom: 5px;">
                    <div class="sectionTitle">Hobbies & Interests</div>
                    <div class="sectionBox"><div style="white-space: pre-line;">${additional.hobbies.text}</div></div>
                  </div>
                ` : ''}
                ${additional.passport.include && additional.passport.number ? `
                  <div style="page-break-inside: avoid; margin-bottom: 5px;">
                    <div class="sectionTitle">Passport Details</div>
                    <div class="sectionBox">
                      <div style="display: grid; grid-template-columns: 150px 1fr; gap: 5px;">
                        <div class="bold">Passport Number:</div><div>${additional.passport.number}</div>
                        ${additional.passport.placeOfIssue ? `<div class="bold">Place of Issue:</div><div>${additional.passport.placeOfIssue}</div>` : ''}
                        ${additional.passport.dateOfIssue ? `<div class="bold">Date of Issue:</div><div>${additional.passport.dateOfIssue}</div>` : ''}
                        ${additional.passport.dateOfExpiry ? `<div class="bold">Date of Expiry:</div><div>${additional.passport.dateOfExpiry}</div>` : ''}
                      </div>
                    </div>
                  </div>
                ` : ''}
              `;
            }
            return '';
          }).join('')}

          <div style="page-break-inside: avoid; margin-bottom: 5px;">
            <div class="sectionTitle">Personal Profile</div>
            <div class="sectionBox">
              <div style="display: grid; grid-template-columns: 150px 1fr; gap: 5px;">
                ${personalInfo.fullName ? `<div class="bold">Name:</div><div>${personalInfo.fullName}</div>` : ''}
                ${personalInfo.fatherName ? `<div class="bold">Father's Name:</div><div>${personalInfo.fatherName}</div>` : ''}
                ${personalInfo.includeDob && personalInfo.dob ? `<div class="bold">Date of Birth:</div><div>${personalInfo.dob}</div>` : ''}
                ${personalInfo.includeGender && personalInfo.gender ? `<div class="bold">Gender:</div><div>${personalInfo.gender}</div>` : ''}
                ${personalInfo.includeMaritalStatus && personalInfo.maritalStatus ? `<div class="bold">Marital Status:</div><div>${personalInfo.maritalStatus}</div>` : ''}
                ${personalInfo.nationality ? `<div class="bold">Nationality:</div><div>${personalInfo.nationality}</div>` : ''}
                ${additional.languages.include && additional.languages.text ? `<div class="bold">Languages Known:</div><div style="white-space: pre-line;">${additional.languages.text}</div>` : ''}
              </div>
            </div>
          </div>

          <div style="page-break-inside: avoid; margin-top: 20px;">
            <div class="sectionTitle">Declaration</div>
            <div class="sectionBox">
              <p style="margin: 0 0 30px 0;">I hereby declare that all the above-mentioned information is true and correct to the best of my knowledge and belief.</p>
              <div style="display: flex; justify-content: space-between;">
                 <div>
                   <div>Place: ${personalInfo.city || '________________'}</div>
                   <div>Date: ________________</div>
                 </div>
                 <div style="text-align: right;">
                    <div>_________________________</div>
                    <div class="bold">(${personalInfo.fullName || 'Signature'})</div>
                 </div>
              </div>
            </div>
          </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </html>
  `;
}

function generateMinimalHTML(data, baseCSS) {
  const { personalInfo, objective, education, experience, skills, additional } = data;
  const themeColor = data.themeColor || '#4A55A2';
  const fontFamily = data.fontFamily || '"Outfit", "Inter", sans-serif';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
      <style>
        ${baseCSS}
        .container { font-family: ${fontFamily}; font-size: 10pt; line-height: 1.6; color: #334155; padding: 0 !important; margin: 0 auto; }
        .header { margin-bottom: 30px; border-bottom: 2px solid ${themeColor}; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .name { font-size: 22pt; font-weight: 300; letter-spacing: 0.5px; color: ${themeColor}; margin-bottom: 10px; }
        .contactInfo { font-size: 9.5pt; color: #718096; display: flex; gap: 15px; }
        .section { display: grid; grid-template-columns: 150px 1fr; gap: 20px; margin-bottom: 25px; page-break-inside: avoid; }
        .sectionTitle { font-size: 10pt; font-weight: 600; text-transform: uppercase; color: ${themeColor}; letter-spacing: 1px; }
        .contentBlock { margin-bottom: 15px; }
        .bold { font-weight: 600; color: #2d3748; }
        .subText { font-size: 9.5pt; color: #718096; }
        .list { margin: 5px 0 0 15px; padding: 0; }
      </style>
    </head>
    <body>
      <div class="cv-template container">
        <div class="header">
          <div>
            ${personalInfo.fullName ? `<div class="name">${personalInfo.fullName}</div>` : ''}
            <div class="contactInfo">
              ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
              ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
              ${personalInfo.city ? `<span>${personalInfo.city}${personalInfo.country ? `, ${personalInfo.country}` : ''}</span>` : ''}
            </div>
          </div>
          ${personalInfo.photo ? `
            <div style="margin-left: 20px;">
              <img src="${personalInfo.photo}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
            </div>
          ` : ''}
        </div>

        ${objective ? `
          <div class="section">
            <div class="sectionTitle">Profile</div>
            <div>${objective}</div>
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div class="section">
            <div class="sectionTitle">Experience</div>
            <div>
              ${experience.map(exp => `
                <div class="contentBlock">
                  <div style="display: flex; justify-content: space-between;">
                    <div class="bold">${exp.designation}</div>
                    <div class="subText">${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div class="subText">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                  ${exp.responsibilities.length > 0 ? `
                    <ul class="list">
                      ${exp.responsibilities.map(resp => resp ? `<li>${resp}</li>` : '').join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div class="section">
            <div class="sectionTitle">Education</div>
            <div>
              ${education.map(edu => `
                <div class="contentBlock">
                  <div style="display: flex; justify-content: space-between;">
                    <div class="bold">${edu.qualification}</div>
                    <div class="subText">${edu.year}</div>
                  </div>
                  <div>${edu.institute}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="section">
            <div class="sectionTitle">Skills</div>
            <div>${skills.join(' • ')}</div>
          </div>
        ` : ''}

        ${additional.certifications.include && additional.certifications.text ? `
          <div class="section">
            <div class="sectionTitle">Certifications</div>
            <div style="white-space: pre-line;">${additional.certifications.text}</div>
          </div>
        ` : ''}

        ${additional.achievements.include && additional.achievements.text ? `
          <div class="section">
            <div class="sectionTitle">Achievements</div>
            <div style="white-space: pre-line;">${additional.achievements.text}</div>
          </div>
        ` : ''}

        ${additional.hobbies.include && additional.hobbies.text ? `
          <div class="section">
            <div class="sectionTitle">Hobbies</div>
            <div style="white-space: pre-line;">${additional.hobbies.text}</div>
          </div>
        ` : ''}

        ${additional.languages.include && additional.languages.text ? `
          <div class="section">
            <div class="sectionTitle">Languages</div>
            <div style="white-space: pre-line;">${additional.languages.text}</div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function generatePremiumHTML(data, baseCSS) {
  const { personalInfo, objective, education, experience, skills, additional } = data;
  const themeColor = data.themeColor || '#4A55A2';
  const fontFamily = data.fontFamily || '"Outfit", "Inter", sans-serif';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;800&display=swap" rel="stylesheet">
      <style>
        ${baseCSS}
        body { font-family: ${fontFamily}; font-size: 10pt; line-height: 1.5; color: #1e293b; background: #f8fafc; margin: 0; padding: 0; }
        .wrapper { display: flex; min-height: 100vh; }
        .sidebar { width: 35%; background-color: ${themeColor}; color: white; padding: 40px 30px; box-sizing: border-box; }
        .main { width: 65%; padding: 40px 30px; background-color: white; box-sizing: border-box; }
        
        .name { font-size: 24pt; font-weight: 800; letter-spacing: 1px; margin-bottom: 5px; line-height: 1.1; }
        .title { font-size: 12pt; font-weight: 500; opacity: 0.9; margin-bottom: 30px; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 20px; }
        
        .sidebarSectionTitle { font-size: 12pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; margin-top: 35px; }
        .mainSectionTitle { font-size: 15pt; font-weight: 700; color: ${themeColor}; border-bottom: 2px solid ${themeColor}; padding-bottom: 5px; margin-bottom: 20px; margin-top: 25px; }
        
        .contactItem { font-size: 10pt; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        
        .skillPill { display: inline-block; background-color: rgba(255,255,255,0.15); padding: 5px 12px; border-radius: 20px; font-size: 9.5pt; margin-bottom: 10px; margin-right: 10px; }
        
        .contentBlock { margin-bottom: 20px; page-break-inside: avoid; }
        .jobTitle { display: flex; justify-content: space-between; font-weight: 700; font-size: 11pt; color: #1e293b; }
        .jobDate { color: ${themeColor}; font-size: 9.5pt; }
        .jobCompany { font-style: italic; color: #64748b; margin-bottom: 8px; font-size: 10pt; }
        
        ul { margin: 0 0 0 20px; padding: 0; }
        li { margin-bottom: 5px; text-align: justify; }
        p { text-align: justify; margin-top: 0; }
        
        /* Reset Puppeteer Margins for full bleed */
        .cv-template { padding: 0 !important; }
      </style>
    </head>
    <body>
      <div class="cv-template">
        <div class="wrapper">
          <div class="sidebar">
            ${personalInfo.photo ? `<div style="text-align: center; margin-bottom: 30px;"><img src="${personalInfo.photo}" alt="Profile" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.4);" /></div>` : ''}
            <div class="name">${personalInfo.fullName?.toUpperCase()}</div>
            ${personalInfo.professionalTitle ? `<div class="title">${personalInfo.professionalTitle}</div>` : ''}
            
            <div class="sidebarSectionTitle">Contact</div>
            ${personalInfo.phone ? `<div class="contactItem">${personalInfo.phone}</div>` : ''}
            ${personalInfo.email ? `<div class="contactItem">${personalInfo.email}</div>` : ''}
            ${personalInfo.city ? `<div class="contactItem">${personalInfo.city}${personalInfo.state ? `, ${personalInfo.state}` : ''}</div>` : ''}
            
            ${skills && skills.length > 0 ? `
              <div class="sidebarSectionTitle">Skills</div>
              <div style="display: flex; flex-wrap: wrap;">
                ${skills.map(skill => `<span class="skillPill">${skill}</span>`).join('')}
              </div>
            ` : ''}
            
            ${additional?.languages?.include && additional.languages.text ? `
              <div class="sidebarSectionTitle">Languages</div>
              <div style="font-size: 10pt; line-height: 1.6;">
                ${additional.languages.text.split('|').map(lang => `<div>${lang.trim()}</div>`).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="main">
            ${(data.sectionOrder || ['objective', 'experience', 'education', 'skills', 'additional']).map(section => {
              if (section === 'objective' && objective) {
                return `
                  <div>
                    <div class="mainSectionTitle">Professional Summary</div>
                    <p>${objective}</p>
                  </div>
                `;
              }
              if (section === 'experience' && experience && experience.length > 0) {
                return `
                  <div>
                    <div class="mainSectionTitle">Experience</div>
                    ${experience.map(exp => `
                      <div class="contentBlock">
                        <div class="jobTitle">
                          <div>${exp.designation}</div>
                          <div class="jobDate">${exp.startDate} to ${exp.current ? 'Present' : exp.endDate}</div>
                        </div>
                        <div class="jobCompany">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                        ${exp.responsibilities && exp.responsibilities.length > 0 ? `
                          <ul>
                            ${exp.responsibilities.map(resp => resp ? `<li>${resp}</li>` : '').join('')}
                          </ul>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                `;
              }
              if (section === 'education' && education && education.length > 0) {
                return `
                  <div>
                    <div class="mainSectionTitle">Education</div>
                    ${education.map(edu => `
                      <div class="contentBlock">
                        <div class="jobTitle">
                          <div>${edu.qualification}</div>
                          <div class="jobDate">${edu.year}</div>
                        </div>
                        <div style="color: #475569;">${edu.institute} - ${edu.board}</div>
                        <div style="font-size: 9.5pt; color: #64748b; margin-top: 4px;">Score: ${edu.score}</div>
                      </div>
                    `).join('')}
                  </div>
                `;
              }
              if (section === 'additional') {
                let html = '';
                if (additional?.achievements?.include && additional.achievements.text) {
                  html += `
                    <div class="contentBlock">
                      <div class="mainSectionTitle">Achievements</div>
                      <p>${additional.achievements.text}</p>
                    </div>
                  `;
                }
                if (additional?.certifications?.include && additional.certifications.text) {
                  html += `
                    <div class="contentBlock">
                      <div class="mainSectionTitle">Certifications</div>
                      <p>${additional.certifications.text}</p>
                    </div>
                  `;
                }
                return html;
              }
              return '';
            }).join('')}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

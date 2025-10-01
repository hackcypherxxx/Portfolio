import puppeteer from 'puppeteer';

export const generateCVPdf = async (cv) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: puppeteer.executablePath(), // ✅ Use Puppeteer’s bundled Chromium
  });

  const page = await browser.newPage();

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>CV - ${cv.personal?.name || ''}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      body { font-family: 'Inter', sans-serif; margin:0; padding:0; background:#f5f5f5; color:#333; }
      .container { max-width: 800px; margin: 20px auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .header { display:flex; align-items:center; gap:20px; margin-bottom:30px; }
      .profile-pic { width:120px; height:120px; border-radius:50%; object-fit:cover; border:2px solid #f9861a; }
      .personal-info h1 { margin:0; font-size:32px; color:#f9861a; }
      .personal-info p { margin:2px 0; font-size:14px; color:#555; }
      .section { margin-bottom:25px; }
      .section h2 { font-size:20px; color:#07070e; border-bottom:2px solid #f9861a; padding-bottom:4px; margin-bottom:10px; }
      .item { margin-bottom:10px; }
      .item h3 { margin:0; font-size:16px; font-weight:600; }
      .item p { margin:2px 0; font-size:14px; color:#555; }
      .social-links a { margin-right:10px; text-decoration:none; color:#f9861a; font-weight:600; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        ${cv.personal?.profilePic?.url ? `<img class="profile-pic" src="${cv.personal.profilePic.url}" />` : ''}
        <div class="personal-info">
          <h1>${cv.personal?.name || ''}</h1>
          <p>${cv.personal?.title || ''}</p>
          <p>Email: ${cv.personal?.email || ''}</p>
          <p>Phone: ${cv.personal?.phone || ''}</p>
          <p>Website: ${cv.personal?.website || ''}</p>
          ${cv.personal?.socialLinks?.length ? `<div class="social-links">${cv.personal.socialLinks.map(s => `<a href="${s.url}" target="_blank">${s.platform}</a>`).join('')}</div>` : ''}
        </div>
      </div>

      ${cv.personal?.summary ? `<div class="section"><h2>Summary</h2><p>${cv.personal.summary}</p></div>` : ''}

      ${cv.experiences?.length ? `<div class="section"><h2>Experience</h2>${cv.experiences.map(exp => `
        <div class="item">
          <h3>${exp.position} - ${exp.company}</h3>
          <p>${exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}</p>
          <p>${exp.description || ''}</p>
        </div>
      `).join('')}</div>` : ''}

      ${cv.education?.length ? `<div class="section"><h2>Education</h2>${cv.education.map(edu => `
        <div class="item">
          <h3>${edu.degree} - ${edu.institution}</h3>
          <p>${edu.startDate ? new Date(edu.startDate).toLocaleDateString() : ''} - ${edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}</p>
          <p>${edu.field || ''}</p>
          <p>${edu.notes || ''}</p>
        </div>
      `).join('')}</div>` : ''}

      ${cv.projects?.length ? `<div class="section"><h2>Projects</h2>${cv.projects.map(proj => `
        <div class="item">
          <h3>${proj.title}</h3>
          <p>${proj.description || ''}</p>
          ${proj.link ? `<p>Link: <a href="${proj.link}" target="_blank">${proj.link}</a></p>` : ''}
        </div>
      `).join('')}</div>` : ''}

      ${cv.certifications?.length ? `<div class="section"><h2>Certifications</h2>${cv.certifications.map(cert => `
        <div class="item">
          <h3>${cert.name} - ${cert.issuer}</h3>
          <p>${cert.date ? new Date(cert.date).toLocaleDateString() : ''}</p>
          <p>${cert.credential || ''}</p>
          ${cert.url ? `<p>URL: <a href="${cert.url}" target="_blank">${cert.url}</a></p>` : ''}
        </div>
      `).join('')}</div>` : ''}

      ${cv.skills?.length ? `<div class="section"><h2>Skills</h2><p>${cv.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}</p></div>` : ''}

      ${cv.languages?.length ? `<div class="section"><h2>Languages</h2><p>${cv.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}</p></div>` : ''}

      ${cv.interests?.length ? `<div class="section"><h2>Interests</h2><p>${cv.interests.join(', ')}</p></div>` : ''}

      ${cv.customSections?.length ? `<div class="section"><h2>Custom Sections</h2>${cv.customSections.map(cs => `
        <div class="item">
          <h3>${cs.title}</h3>
          <p>${cs.content}</p>
        </div>
      `).join('')}</div>` : ''}

    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });

  await browser.close();
  return pdfBuffer;
};

/**
 * CoDecision Google Sheets Integration & Lead Capture System
 * 
 * Instructions to connect with Google Sheets:
 * 1. Open a new Google Sheet.
 * 2. Click on "Extensions" -> "Apps Script" (Extensões -> Apps Script).
 * 3. Replace any code with the script provided in GOOGLE_APPS_SCRIPT_TEMPLATE below.
 * 4. Click "Deploy" -> "New deployment" -> Select type "Web app".
 * 5. Execute as: "Me" | Who has access: "Anyone".
 * 6. Copy the Web App URL and paste it into GOOGLE_SHEETS_ENDPOINT below!
 */

const GOOGLE_APPS_SCRIPT_TEMPLATE = `
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Data/Hora", "Nome", "Email", "WhatsApp", "Empresa", "Tipo de Projeto", "Mensagem", "Origem"]);
    }
    
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    
    sheet.appendRow([
      timestamp,
      data.nome || "",
      data.email || "",
      data.whatsapp || "",
      data.empresa || "",
      data.tipoProjeto || "",
      data.mensagem || "",
      data.origem || "Site CoDecision"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Lead registrado com sucesso" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

// Loaded dynamically from config.js (local) or GitHub Actions Secret (production)
const GOOGLE_SHEETS_ENDPOINT = window.CODECISION_SHEETS_ENDPOINT || (typeof window.ENV !== "undefined" && window.ENV.GOOGLE_SHEETS_ENDPOINT) || "https://script.google.com/macros/s/AKfycbySgDYDfTJ0yDrcJfheQEdnCYX6Pj5qiMp5YzHlRMSc1cxVyqQpZBU3TctMh0JjSL2Zpw/exec";

class LeadCaptureManager {
  static init() {
    const inlineForm = document.getElementById('contactLeadForm');
    const modalForm = document.getElementById('collaborateForm');

    if (inlineForm) {
      inlineForm.addEventListener('submit', (e) => this.handleSubmit(e, inlineForm));
    }
    if (modalForm) {
      modalForm.addEventListener('submit', (e) => this.handleSubmit(e, modalForm));
    }
  }

  static async handleSubmit(e, form) {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;

    // Collect data
    const formData = {
      nome: form.querySelector('[name="nome"]')?.value || form.querySelector('#clientName')?.value || '',
      email: form.querySelector('[name="email"]')?.value || form.querySelector('#clientEmail')?.value || '',
      whatsapp: form.querySelector('[name="whatsapp"]')?.value || '',
      empresa: form.querySelector('[name="empresa"]')?.value || '',
      tipoProjeto: form.querySelector('[name="tipoProjeto"]')?.value || 'Não especificado',
      mensagem: form.querySelector('[name="mensagem"]')?.value || form.querySelector('#projectDesc')?.value || '',
      origem: form.id === 'contactLeadForm' ? 'Formulário Principal (Página)' : 'Modal de Contato'
    };

    // Validation
    if (!formData.nome || !formData.email) {
      alert('Por favor, preencha seu nome e e-mail.');
      return;
    }

    // Set Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> <span>Enviando informações...</span>`;

    try {
      // 1. Save locally to localStorage as instant offline backup
      this.saveLocalBackup(formData);

      // 2. Send to Google Sheets (using no-cors mode to prevent CORS issues with Google Apps Script)
      if (GOOGLE_SHEETS_ENDPOINT && !GOOGLE_SHEETS_ENDPOINT.includes('placeholder')) {
        await fetch(GOOGLE_SHEETS_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Simulated network delay if placeholder is active
        await new Promise(res => setTimeout(res, 800));
      }

      // Success UI State
      submitBtn.innerHTML = `<span>✓ Informações Enviadas com Sucesso!</span>`;
      submitBtn.style.background = '#10B981';
      submitBtn.style.color = '#FFFFFF';

      const statusBox = form.querySelector('.form-status-alert');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `<strong>Obrigado, ${formData.nome}!</strong> Seus dados foram registrados com sucesso. Nossa equipe entrará em contato em breve.`;
      }

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.style.background = '';
        submitBtn.style.color = '';

        // If in modal, close it
        const modal = document.getElementById('collaborateModal');
        if (modal && modal.classList.contains('open')) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      }, 3500);

    } catch (error) {
      console.warn('Google Sheets capture fallback triggered:', error);
      submitBtn.innerHTML = `<span>✓ Registrado Localmente!</span>`;
      submitBtn.style.background = '#10B981';
      
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.style.background = '';
      }, 3000);
    }
  }

  static saveLocalBackup(data) {
    const existing = JSON.parse(localStorage.getItem('codecision_leads') || '[]');
    data.capturedAt = new Date().toISOString();
    existing.push(data);
    localStorage.setItem('codecision_leads', JSON.stringify(existing));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  LeadCaptureManager.init();
});

import React, { useRef, useState } from 'react';
import { useLoan } from '../context/LoanContext';

export default function SanctionLetterModal({ onClose }) {
  const { sanctionData, loanData, underwritingResult } = useLoan();
  const letterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!sanctionData) return null;

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

      const element = letterRef.current;
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8f6f0',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;

      let yOffset = 0;
      let remaining = imgH;
      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, -yOffset, pdfW, imgH);
        remaining -= pdfH;
        yOffset += pdfH;
        if (remaining > 0) pdf.addPage();
      }

      pdf.save(`SanctionLetter_${sanctionData.reference_number}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF download failed. Please use Print instead.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>Loan Sanction Letter</h2>
            <p style={styles.modalSub}>Ref: {sanctionData.reference_number}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button style={styles.printBtn} onClick={handlePrint}>🖨️ Print</button>
            <button
              style={{
                ...styles.printBtn,
                background: downloading ? '#0a1f3c' : '#0d3020',
                borderColor: '#1a6a40',
                color: downloading ? '#4a5f80' : '#2ECC71',
                cursor: downloading ? 'not-allowed' : 'pointer',
              }}
              onClick={handleDownloadPDF}
              disabled={downloading}
            >
              {downloading ? '⏳ Generating...' : '⬇️ Download PDF'}
            </button>
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Scrollable container */}
        <div style={styles.letterContainer}>
          {/* This div is captured by html2canvas for PDF */}
          <div ref={letterRef} style={styles.letterCapture}>
            {/* NBFC Letterhead */}
            <div style={styles.letterhead}>
              <div style={styles.logoArea}>
                <div style={styles.logoDot}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9.5L12 4L21 9.5V10.5H3V9.5Z" fill="#fff"/>
                    <rect x="5" y="11" width="2.5" height="7" fill="#fff" opacity="0.85"/>
                    <rect x="10.75" y="11" width="2.5" height="7" fill="#fff" opacity="0.85"/>
                    <rect x="16.5" y="11" width="2.5" height="7" fill="#fff" opacity="0.85"/>
                    <rect x="3" y="18.5" width="18" height="1.5" fill="#fff"/>
                  </svg>
                </div>
                <div>
                  <p style={styles.nbfcName}>FinFlow NBFC</p>
                  <p style={styles.nbfcTag}>Reserve Bank of India Registered | NBFC-MFI</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={styles.letterDate}>{sanctionData.date}</p>
                <p style={styles.refNum}>Ref: {sanctionData.reference_number}</p>
              </div>
            </div>

            <div style={styles.divider} />

            {/* Letter Content */}
            <div style={styles.letterBody}>
              {sanctionData.letter_body.split('\n').map((line, i) => (
                <p key={i} style={line === '' ? styles.emptyLine : styles.bodyLine}>{line}</p>
              ))}
            </div>

            {/* Loan Summary Table */}
            <div style={styles.summaryTable}>
              <p style={styles.tableTitle}>Loan Sanction Summary</p>
              <table style={styles.table}>
                <tbody>
                  {[
                    ['Applicant Name', loanData.customerName],
                    ['PAN Number', loanData.pan],
                    ['Sanctioned Amount', `₹${Number(loanData.loanAmount).toLocaleString('en-IN')}`],
                    ['Interest Rate', `${underwritingResult?.interest_rate}% per annum`],
                    ['Loan Tenure', `${loanData.tenure || 36} months`],
                    ['Credit Score', `${underwritingResult?.credit_score} / 900`],
                    ['Processing Fee', `₹${Math.round(loanData.loanAmount * 0.01).toLocaleString('en-IN')} (1%)`],
                    ['Offer Valid Until', sanctionData.valid_until],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td style={styles.tdLabel}>{label}</td>
                      <td style={styles.tdValue}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Terms */}
            <div style={styles.termsBox}>
              <p style={styles.termsTitle}>Terms & Conditions</p>
              <ul style={styles.termsList}>
                {sanctionData.terms.map((t, i) => (
                  <li key={i} style={styles.termItem}>{t}</li>
                ))}
              </ul>
            </div>

            {/* Signature */}
            <div style={styles.signature}>
              <div style={styles.sigLine} />
              <p style={styles.sigName}>Credit Department</p>
              <p style={styles.sigOrg}>FinFlow NBFC — Authorised Signatory</p>
              <p style={styles.sigNote}>This is a system-generated letter. Valid only with official seal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  },
  modal: {
    background: '#080f1c',
    border: '1px solid #1e2f4a',
    borderRadius: 16,
    width: '100%', maxWidth: 700,
    maxHeight: '90vh', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #1a2540',
    background: '#060d18',
    flexWrap: 'wrap', gap: 8,
  },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#F5D07A' },
  modalSub: { margin: '2px 0 0', fontSize: 12, color: '#4a5f80' },
  printBtn: {
    padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
    background: '#0d1f3c', border: '1px solid #2a4a8a', color: '#6a9fd8',
  },
  closeBtn: {
    padding: '6px 12px', borderRadius: 8, fontSize: 14, cursor: 'pointer',
    background: '#1a0a0a', border: '1px solid #4a1a1a', color: '#e74c3c',
  },
  letterContainer: {
    overflowY: 'auto',
    flex: 1,
    background: '#f8f6f0',
  },
  letterCapture: {
    padding: '32px 36px',
    background: '#f8f6f0',
  },
  letterhead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: 12 },
  logoDot: {
    width: 42, height: 42, borderRadius: 10,
    background: 'linear-gradient(135deg, #0a2347, #1a5fa8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  nbfcName: { margin: 0, fontSize: 20, fontWeight: 800, color: '#0a2347' },
  nbfcTag: { margin: '2px 0 0', fontSize: 10, color: '#666' },
  letterDate: { margin: 0, fontSize: 13, color: '#333' },
  refNum: { margin: '2px 0 0', fontSize: 11, color: '#888', fontWeight: 600 },
  divider: { height: 2, background: 'linear-gradient(90deg, #0a2347, #C9A84C)', margin: '16px 0', borderRadius: 1 },
  letterBody: { marginBottom: 24 },
  bodyLine: { margin: '0 0 8px', fontSize: 13, color: '#2a2a2a', lineHeight: 1.7 },
  emptyLine: { margin: '8px 0', height: 4 },
  summaryTable: {
    background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8,
    overflow: 'hidden', marginBottom: 20,
  },
  tableTitle: {
    margin: 0, padding: '10px 16px', fontSize: 12, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff',
    background: '#0a2347',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tdLabel: {
    padding: '9px 16px', fontSize: 12, color: '#555', fontWeight: 500,
    borderBottom: '1px solid #f0f0f0', width: '40%', background: '#fafafa',
  },
  tdValue: {
    padding: '9px 16px', fontSize: 13, color: '#111', fontWeight: 600,
    borderBottom: '1px solid #f0f0f0',
  },
  termsBox: {
    background: '#fffbf0', border: '1px solid #e8d88a', borderRadius: 8,
    padding: '14px 18px', marginBottom: 24,
  },
  termsTitle: { margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#7a5f00', textTransform: 'uppercase' },
  termsList: { margin: 0, paddingLeft: 18 },
  termItem: { fontSize: 12, color: '#5a4a00', lineHeight: 1.7, marginBottom: 4 },
  signature: { textAlign: 'center', marginTop: 10 },
  sigLine: { height: 2, width: 160, background: '#0a2347', margin: '0 auto 8px' },
  sigName: { margin: 0, fontSize: 14, fontWeight: 700, color: '#0a2347' },
  sigOrg: { margin: '2px 0', fontSize: 12, color: '#444' },
  sigNote: { margin: '8px 0 0', fontSize: 10, color: '#999', fontStyle: 'italic' },
};

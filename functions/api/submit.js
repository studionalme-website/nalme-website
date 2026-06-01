/**
 * Form Submissions — Cloudflare Pages Function
 *
 * Replaces Netlify Forms after migration. Accepts any of the 5 site forms
 * (ventures, contact, field-notes, venture-quick, workshop-host) and emails
 * them to hello@studionalme.com via Resend.
 *
 * Environment variables required (Cloudflare Pages → Settings → Environment variables):
 *   RESEND_API_KEY  — from resend.com after sign-up + domain verification
 *   NOTIFY_TO       — recipient email, e.g., hello@studionalme.com (or comma-separated for multiple)
 *   NOTIFY_FROM     — verified sender, e.g., no-reply@studionalme.com (must be on verified domain)
 *
 * DNS records required for Resend domain verification:
 *   See DEPLOYMENT.md → "Resend setup" section.
 *
 * Activation:
 *   After deploy, change each form's submit handler to POST to '/api/submit'
 *   instead of '/' (Netlify pattern). See store.html / index.html / journal.html /
 *   ventures.html / workshops.html → handleNalmeForm and handleVenturesSubmit.
 */

const FORM_SUBJECTS = {
  'ventures':       'Ventures enquiry',
  'venture-quick':  'Quick venture enquiry',
  'contact':        'Studio contact',
  'field-notes':    'New Field Notes subscriber',
  'workshop-host':  'Workshop hosting enquiry',
};

export async function onRequestPost({ request, env }) {
  // Parse incoming form data (works with x-www-form-urlencoded from current fetch handlers)
  let formData;
  const contentType = request.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      const json = await request.json();
      formData = new URLSearchParams(Object.entries(json));
    } else {
      const text = await request.text();
      formData = new URLSearchParams(text);
    }
  } catch {
    return jsonError('Could not parse form body', 400);
  }

  // Honeypot — bot-field should be empty for humans
  if (formData.get('bot-field')) {
    return new Response(JSON.stringify({ ok: true, spam: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formName = formData.get('form-name') || 'unknown';
  const subject = `${FORM_SUBJECTS[formName] || 'Website form'} — ${formData.get('name') || formData.get('email') || formData.get('organisation') || 'Studio Nalmé'}`;

  // Build a readable HTML email
  const rows = [];
  for (const [key, value] of formData.entries()) {
    if (key === 'bot-field' || key === 'form-name') continue;
    if (!value) continue;
    rows.push(`<tr><td style="padding:8px 14px 8px 0;color:#665146;font-family:sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:.1em;vertical-align:top;white-space:nowrap"><b>${escapeHtml(key)}</b></td><td style="padding:8px 0;color:#3d3a36;font-family:sans-serif;font-size:14px;line-height:1.55">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`);
  }

  const html = `
    <div style="background:#fffaf0;padding:32px;font-family:'Helvetica Neue',sans-serif;color:#3d3a36">
      <div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border:1px solid #d9d2c5">
        <div style="font-family:'Kumbh Sans',sans-serif;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#8e3432;margin-bottom:16px">Studio Nalmé · ${escapeHtml(formName)}</div>
        <h2 style="font-family:'Kumbh Sans',sans-serif;font-weight:300;font-size:22px;color:#3d3a36;margin:0 0 24px">${escapeHtml(subject)}</h2>
        <table style="width:100%;border-collapse:collapse">${rows.join('')}</table>
        <p style="margin-top:32px;font-size:12px;color:#957465;font-style:italic">Sent from studionalme.com</p>
      </div>
    </div>
  `;

  const toRecipients = (env.NOTIFY_TO || 'hello@studionalme.com').split(',').map(s => s.trim()).filter(Boolean);

  // Resend API call
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.NOTIFY_FROM || 'Studio Nalmé <no-reply@studionalme.com>',
      to: toRecipients,
      reply_to: formData.get('email') || undefined,
      subject,
      html,
    }),
  });

  if (!resendRes.ok) {
    const errText = await resendRes.text().catch(() => '');
    return jsonError(`Email delivery failed: ${errText.slice(0, 200)}`, 502);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

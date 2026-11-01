// FATIR_V5: Contact and project-aware chatbot

(() => {
  'use strict';

  const cases = [
    {
      id:'spcms',
      name:'SPCMS',
      rx:/\bspcms\b|commission|affiliate tracking|sales.{0,12}payroll/i,
      details:'A Shopify-linked sales and payroll commission platform for teams and employees. Features include referral tracking links, team management, paid-order attribution, commission calculations, payroll reports and training resources.',
      stack:'Python, Flask, SQL and Shopify webhooks.',
      status:'Deployed; sales attribution is being verified.'
    },
    {
      id:'frameflow',
      name:'FrameFlow',
      rx:/\bframe\s?flow\b|custom frames?|artwork render|personalized artwork/i,
      details:'Automates customized artwork after Shopify orders. Customers fill out product forms; the service processes order data and creates high-resolution personalized artwork using existing templates.',
      stack:'Python, Flask, Pillow, Shopify and AI APIs.',
      status:'Active development; Google Drive delivery is still being verified.'
    },
    {
      id:'sims',
      name:'SIMS',
      rx:/\bsims\b|inventory|stock management/i,
      details:'A stock and inventory management system with products, stock movements, sales, purchasing and reporting workflows.',
      stack:'Python, Flask, SQL, HTML, CSS and JavaScript.',
      status:'Developed; public GitHub repository available.',
      repo:'https://github.com/fatirshykh/SIMS'
    },
    {
      id:'lms',
      name:'FDS LMS',
      rx:/\bfds\s*lms\b|\blms\b|learning management|education software/i,
      details:'Education management software covering students, courses, attendance, fees, staff roles and institutional processes.',
      stack:'Python, Flask and PostgreSQL.',
      status:'Successfully developed and delivered.'
    },
    {
      id:'fds-manager',
      name:'FDS Manager',
      rx:/\bfds\s*manager\b|student fee|school manager/i,
      details:'A browser-based administration app for students, attendance, fees, income, expenses and filtering.',
      stack:'HTML, CSS and JavaScript.',
      status:'Functional application. Cloud data sharing has not been verified.'
    },
    {
      id:'ai-seo-manager',
      name:'AI SEO Manager',
      rx:/\bseo\b|search engine optimi[sz]ation/i,
      details:'Multi-site SEO system for audits, metadata, canonical links, structured data, performance and link health.',
      stack:'Python, PostgreSQL and external APIs.',
      status:'Early development; initial deployment completed.'
    }
  ];

  const onProjectPage = location.pathname.includes('/projects/');

  const caseUrl = p =>
    (onProjectPage ? '' : 'projects/') + p.id + '.html';

  const link = p => ({
    label:'Read ' + p.name + ' case study ↗',
    href:caseUrl(p)
  });

  // Web3Forms submission
  const form = document.getElementById('fatirContactForm');

  if (form) {
    const send = form.querySelector('button[type="submit"]');
    const status = document.getElementById('fatirFormStatus');

    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (!form.reportValidity()) return;

      send.disabled = true;
      status.textContent = 'Sending your enquiry...';

      try {
        const response = await fetch(
          'https://api.web3forms.com/submit',
          {
            method:'POST',
            headers:{Accept:'application/json'},
            body:new FormData(form)
          }
        );

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          throw Error(result.message || 'Submission failed');
        }

        status.textContent =
          'Enquiry sent successfully. Please check for a confirmation email.';

        form.reset();

      } catch (err) {
        status.textContent =
          'Submission failed. Please try again or contact Fatir via WhatsApp.';
      } finally {
        send.disabled = false;
      }
    });

    // Alternative contact through WhatsApp
    const wa = document.getElementById('fatirWhatsApp');

    wa?.addEventListener('click', () => {
      if (!form.reportValidity()) return;

      const name = document.getElementById('fatirName').value.trim();
      const email = document.getElementById('fatirEmail').value.trim();
      const type = document.getElementById('fatirType').value;
      const message = document.getElementById('fatirMessage').value.trim();

      const text =
        `Hello Fatir,\nName: ${name}\nEmail: ${email}` +
        `\nProject: ${type}\n\n${message}`;

      window.open(
        'https://wa.me/923348122659?text=' + encodeURIComponent(text),
        '_blank',
        'noopener,noreferrer'
      );
    });
  }

  // Portfolio chatbot
  const toggle = document.getElementById('fatirChatToggle');
  const panel = document.getElementById('fatirChatPanel');
  const close = document.getElementById('fatirChatClose');
  const log = document.getElementById('fatirChatLog');
  const chatForm = document.getElementById('fatirChatForm');
  const input = document.getElementById('fatirChatInput');

  if (!toggle || !panel || !log || !chatForm || !input) return;

  function line(message, from, links = []) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + from;
    div.textContent = message;

    if (links.length) {
      const actions = document.createElement('div');
      actions.className = 'chat-case-links';

      links.forEach(item => {
        const anchor = document.createElement('a');
        anchor.href = item.href;
        anchor.textContent = item.label;

        if (item.external) {
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }

        actions.append(anchor);
      });

      div.append(actions);
    }

    log.append(div);
    log.scrollTop = log.scrollHeight;
  }

  function answer(question) {
    const selected = cases.find(p => p.rx.test(question));

    // Answer the specific software first
    if (selected) {
      const links = [link(selected)];

      if (selected.repo) {
        links.push({
          label:'View GitHub source ↗',
          href:selected.repo,
          external:true
        });
      }

      line(
        `${selected.name}\n\n${selected.details}` +
        `\n\nTechnology: ${selected.stack}` +
        `\nStatus: ${selected.status}`,
        'bot',
        links
      );

    } else if (
      /software|projects?|portfolio|case stud|your work/i.test(question)
    ) {
      line(
        'Here are the six featured software case studies. Choose one or ask about it by name.',
        'bot',
        cases.map(link)
      );

    } else if (/github|source code|repositor/i.test(question)) {
      line(
        'You can view public development work on GitHub. Private client source code is restricted.',
        'bot',
        [{
          label:'View GitHub profile ↗',
          href:'https://github.com/fatirshykh',
          external:true
        }]
      );

    } else if (/contact|whatsapp|email|hire|reach/i.test(question)) {
      line(
        'Use the contact form on this page, or contact Fatir on WhatsApp or email.',
        'bot',
        [
          {label:'Contact form ↗',href:'#contact'},
          {
            label:'WhatsApp ↗',
            href:'https://wa.me/923348122659',
            external:true
          },
          {
            label:'Email ↗',
            href:'mailto:fatirahmed946@gmail.com'
          }
        ]
      );

    } else if (/python|flask|n8n|php|skill|tech/i.test(question)) {
      line(
        'Fatir works extensively with Python, Flask, APIs, databases and n8n automation, and also has working knowledge of PHP.',
        'bot'
      );

    } else {
      line(
        'Ask about SPCMS, FrameFlow, SIMS, FDS LMS, FDS Manager or AI SEO Manager. You can also ask for the full software portfolio.',
        'bot',
        cases.map(link)
      );
    }
  }

  function ask(question) {
    line(question, 'visitor');
    answer(question);
  }

  line(
    'Hi! Ask about a specific project or type "software portfolio" for all case-study links.',
    'bot'
  );

  function show(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));

    if (open) input.focus();
  }

  toggle.addEventListener('click', () => show(panel.hidden));
  close.addEventListener('click', () => show(false));

  chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const q = input.value.trim();
    if (!q) return;

    input.value = '';
    ask(q);
  });

  document.querySelectorAll('[data-question]').forEach(b => {
    b.addEventListener('click', () => {
      const q = b.dataset.question === 'software'
        ? 'software portfolio'
        : b.dataset.question;

      ask(q);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) show(false);
  });
})();
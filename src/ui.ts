/**
 * Popup UI for the "Copy Pincite" and "Copy Text with Pincite" actions.
 */

let currentPopup: HTMLElement | null = null;
let flashTimeout: ReturnType<typeof setTimeout> | null = null;

const FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
const BORDER_COLOR = '#d5dbe5';
const TEXT_COLOR = '#172033';
const MUTED_TEXT_COLOR = '#5f6b7a';
const PRIMARY_COLOR = '#2357c6';
const PRIMARY_HOVER_COLOR = '#1d48a5';
const SURFACE_COLOR = 'rgb(255, 255, 255)';

function setStyles(el: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
  Object.assign(el.style, styles);
}

function addButtonStates(button: HTMLButtonElement, hoverColor: string, baseColor: string): void {
  button.addEventListener('mouseenter', () => {
    button.style.background = hoverColor;
    button.style.transform = 'translateY(-1px)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.background = baseColor;
    button.style.transform = 'translateY(0)';
  });
  button.addEventListener('focus', () => {
    button.style.boxShadow = '0 0 0 3px rgba(35, 87, 198, 0.22)';
  });
  button.addEventListener('blur', () => {
    button.style.boxShadow = 'none';
  });
}

/**
 * Show a popup with reporter dropdown and two buttons centered horizontally
 * below the selection.
 */
export function showPopup(
  rect: DOMRect,
  hasPincite: boolean,
  reporters: string[],
  defaultReporterIndex: number,
  onCopyPincite: (reporterIndex: number) => void,
  onCopyText: (reporterIndex: number) => void
): void {
  hidePopup();

  const container = document.createElement('div');
  container.className = 'cl-cite-popup';
  setStyles(container, {
    position: 'absolute',
    left: `${rect.left + rect.width / 2}px`,
    top: `${rect.bottom + 5}px`,
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '8px',
    transform: 'translateX(-50%)',
    background: SURFACE_COLOR,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 14px 36px rgba(23, 32, 51, 0.18), 0 2px 8px rgba(23, 32, 51, 0.10)',
    color: TEXT_COLOR,
    fontFamily: FONT_STACK,
    fontSize: '13px',
    minWidth: '260px',
    maxWidth: 'min(420px, calc(100vw - 24px))',
    boxSizing: 'border-box',
  });

  const arrow = document.createElement('div');
  setStyles(arrow, {
    position: 'absolute',
    top: '-6px',
    left: '50%',
    width: '10px',
    height: '10px',
    background: SURFACE_COLOR,
    borderLeft: `1px solid ${BORDER_COLOR}`,
    borderTop: `1px solid ${BORDER_COLOR}`,
    transform: 'translateX(-50%) rotate(45deg)',
    boxSizing: 'border-box',
  });
  container.appendChild(arrow);

  let select: HTMLSelectElement | null = null;

  // Reporter dropdown (only when multiple reporters available)
  if (reporters.length > 1) {
    const selectWrapper = document.createElement('div');
    setStyles(selectWrapper, {
      display: 'grid',
      gridTemplateColumns: 'auto minmax(0, 1fr)',
      alignItems: 'center',
      gap: '8px',
      fontFamily: FONT_STACK,
      fontSize: '12px',
      minWidth: '0',
    });

    const label = document.createElement('label');
    label.textContent = 'Cite to:';
    setStyles(label, {
      color: MUTED_TEXT_COLOR,
      cursor: 'default',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    });

    select = document.createElement('select');
    setStyles(select, {
      width: '100%',
      minWidth: '0',
      fontFamily: FONT_STACK,
      fontSize: '12px',
      color: TEXT_COLOR,
      background: '#f8fafc',
      border: `1px solid ${BORDER_COLOR}`,
      borderRadius: '6px',
      padding: '5px 24px 5px 8px',
      outline: 'none',
      boxSizing: 'border-box',
    });
    select.addEventListener('focus', () => {
      select!.style.borderColor = PRIMARY_COLOR;
      select!.style.boxShadow = '0 0 0 3px rgba(35, 87, 198, 0.15)';
    });
    select.addEventListener('blur', () => {
      select!.style.borderColor = BORDER_COLOR;
      select!.style.boxShadow = 'none';
    });
    reporters.forEach((r, i) => {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = r;
      if (i === defaultReporterIndex) opt.selected = true;
      select!.appendChild(opt);
    });

    selectWrapper.appendChild(label);
    selectWrapper.appendChild(select);
    container.appendChild(selectWrapper);
  }

  const buttonsRow = document.createElement('div');
  setStyles(buttonsRow, {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.35fr)',
    gap: '8px',
    alignItems: 'stretch',
  });

  const pinciteLabel = hasPincite ? 'Copy Pincite' : 'Copy Pincite (no pincite)';
  const textLabel = hasPincite ? 'Copy Text with Pincite' : 'Copy Text with Pincite (no pincite)';

  /** Read the currently selected reporter from the dropdown (or default). */
  function currentReporter(): number {
    if (select) {
      const val = parseInt(select.value, 10);
      if (!isNaN(val)) return val;
    }
    return defaultReporterIndex;
  }

  const btnPincite = document.createElement('button');
  btnPincite.textContent = pinciteLabel;
  btnPincite.setAttribute('data-action', 'copy-pincite');
  setStyles(btnPincite, {
    appearance: 'none',
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: '7px',
    background: '#f8fafc',
    color: TEXT_COLOR,
    cursor: 'pointer',
    fontFamily: FONT_STACK,
    fontSize: '12px',
    fontWeight: '650',
    lineHeight: '1.2',
    minHeight: '34px',
    padding: '7px 10px',
    transition: 'background 120ms ease, border-color 120ms ease, transform 120ms ease, box-shadow 120ms ease',
    whiteSpace: 'normal',
  });
  btnPincite.addEventListener('mouseenter', () => {
    btnPincite.style.borderColor = '#b6c0cf';
    btnPincite.style.background = '#eef3fb';
    btnPincite.style.transform = 'translateY(-1px)';
  });
  btnPincite.addEventListener('mouseleave', () => {
    btnPincite.style.borderColor = BORDER_COLOR;
    btnPincite.style.background = '#f8fafc';
    btnPincite.style.transform = 'translateY(0)';
  });
  btnPincite.addEventListener('focus', () => {
    btnPincite.style.boxShadow = '0 0 0 3px rgba(35, 87, 198, 0.16)';
  });
  btnPincite.addEventListener('blur', () => {
    btnPincite.style.boxShadow = 'none';
  });
  btnPincite.addEventListener('click', () => {
    onCopyPincite(currentReporter());
  });

  const btnText = document.createElement('button');
  btnText.textContent = textLabel;
  btnText.setAttribute('data-action', 'copy-text');
  setStyles(btnText, {
    appearance: 'none',
    border: '1px solid transparent',
    borderRadius: '7px',
    background: PRIMARY_COLOR,
    color: '#ffffff',
    cursor: 'pointer',
    fontFamily: FONT_STACK,
    fontSize: '12px',
    fontWeight: '700',
    lineHeight: '1.2',
    minHeight: '34px',
    padding: '7px 11px',
    transition: 'background 120ms ease, transform 120ms ease, box-shadow 120ms ease',
    whiteSpace: 'normal',
  });
  addButtonStates(btnText, PRIMARY_HOVER_COLOR, PRIMARY_COLOR);
  btnText.addEventListener('click', () => {
    onCopyText(currentReporter());
  });

  buttonsRow.appendChild(btnPincite);
  buttonsRow.appendChild(btnText);
  container.appendChild(buttonsRow);

  document.body.appendChild(container);
  currentPopup = container;
}

export function hidePopup(): void {
  if (currentPopup && currentPopup.parentNode) {
    currentPopup.parentNode.removeChild(currentPopup);
  }
  currentPopup = null;
}

/**
 * Flash a temporary message on screen, then auto-remove it.
 */
export function flashMessage(text: string): void {
  // Remove any existing flash
  const existing = document.querySelector('.cl-cite-flash');
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }
  if (flashTimeout) {
    clearTimeout(flashTimeout);
  }

  const el = document.createElement('div');
  el.className = 'cl-cite-flash';
  el.textContent = text;
  setStyles(el, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '10000',
    padding: '11px 16px',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#1a1a1a',
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: '8px',
    fontFamily: FONT_STACK,
    fontSize: '14px',
    lineHeight: '1.4',
    maxWidth: '600px',
    boxShadow: '0 12px 32px rgba(23, 32, 51, 0.18), 0 2px 8px rgba(23, 32, 51, 0.10)',
    boxSizing: 'border-box',
  });

  document.body.appendChild(el);

  flashTimeout = setTimeout(() => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    flashTimeout = null;
  }, 2000);
}

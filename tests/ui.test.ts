import { describe, it, expect, beforeEach } from 'vitest';
import { showPopup, hidePopup, flashMessage } from '../src/ui';

function fakeRect(x: number, y: number, w: number, h: number): DOMRect {
  return { left: x, top: y, width: w, height: h, right: x + w, bottom: y + h, x, y, toJSON: () => ({}) } as DOMRect;
}

describe('showPopup', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    hidePopup();
  });

  it('creates a popup container with two buttons', () => {
    showPopup(fakeRect(100, 100, 200, 20), true, ['190 Wash. 2d 249'], 0, () => {}, () => {});
    const container = document.querySelector('.cl-cite-popup');
    expect(container).not.toBeNull();
    const buttons = container!.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('Copy Pincite');
    expect(buttons[1].textContent).toBe('Copy Text with Pincite');
  });

  it('positions the popup centered horizontally below the selection', () => {
    showPopup(fakeRect(100, 100, 200, 20), true, ['190 Wash. 2d 249'], 0, () => {}, () => {});
    const container = document.querySelector('.cl-cite-popup') as HTMLElement;
    expect(container.style.position).toBe('absolute');
    expect(container.style.left).toBe('200px');
    expect(container.style.top).toBe('125px');
  });

  it('uses opaque background styling for popup menu', () => {
    showPopup(fakeRect(100, 100, 200, 20), true, ['190 Wash. 2d 249'], 0, () => {}, () => {});
    const container = document.querySelector('.cl-cite-popup') as HTMLElement;
    expect(container.style.background).toBe('rgb(255, 255, 255)');
    expect(container.style.borderRadius).toBe('8px');
  });

  it('shows "(no pincite)" suffixes when pincite is missing', () => {
    showPopup(fakeRect(100, 100, 200, 20), false, ['190 Wash. 2d 249'], 0, () => {}, () => {});
    const container = document.querySelector('.cl-cite-popup') as HTMLElement;
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].textContent).toBe('Copy Pincite (no pincite)');
    expect(buttons[1].textContent).toBe('Copy Text with Pincite (no pincite)');
  });

  it('shows a reporter dropdown when multiple reporters are available', () => {
    const reporters = ['190 Wash. 2d 249', '413 P.3d 549'];
    showPopup(fakeRect(100, 100, 200, 20), true, reporters, 0, () => {}, () => {});
    const select = document.querySelector('.cl-cite-popup select') as HTMLSelectElement;
    expect(select).not.toBeNull();
    expect(select.options.length).toBe(2);
    expect(select.options[0].text).toBe('190 Wash. 2d 249');
    expect(select.options[1].text).toBe('413 P.3d 549');
  });

  it('does not show a dropdown when only one reporter is available', () => {
    showPopup(fakeRect(100, 100, 200, 20), true, ['572 F.3d 868'], 0, () => {}, () => {});
    const select = document.querySelector('.cl-cite-popup select');
    expect(select).toBeNull();
  });

  it('calls the onCopyPincite handler with selected reporter index when first button clicked', () => {
    const reporters = ['190 Wash. 2d 249', '413 P.3d 549'];
    let selectedIdx = -1;
    showPopup(fakeRect(100, 100, 200, 20), true, reporters, 1, (idx) => { selectedIdx = idx; }, () => {});
    const btn = document.querySelector('button[data-action="copy-pincite"]') as HTMLElement;
    btn.click();
    expect(selectedIdx).toBe(1);
  });

  it('calls the onCopyText handler with selected reporter index when second button clicked', () => {
    const reporters = ['190 Wash. 2d 249', '413 P.3d 549'];
    let selectedIdx = -1;
    showPopup(fakeRect(100, 100, 200, 20), true, reporters, 0, () => {}, (idx) => { selectedIdx = idx; });
    const btn = document.querySelector('button[data-action="copy-text"]') as HTMLElement;
    btn.click();
    expect(selectedIdx).toBe(0);
  });

  it('updates the selected reporter index when dropdown changes', () => {
    const reporters = ['190 Wash. 2d 249', '413 P.3d 549'];
    let selectedIdx = -1;
    showPopup(fakeRect(100, 100, 200, 20), true, reporters, 0, (idx) => { selectedIdx = idx; }, () => {});
    const select = document.querySelector('.cl-cite-popup select') as HTMLSelectElement;
    select.value = '1';
    select.dispatchEvent(new Event('change'));
    const btn = document.querySelector('button[data-action="copy-pincite"]') as HTMLElement;
    btn.click();
    expect(selectedIdx).toBe(1);
  });

  it('removes the old popup when showPopup is called again', () => {
    showPopup(fakeRect(100, 100, 200, 20), true, ['190 Wash. 2d 249'], 0, () => {}, () => {});
    showPopup(fakeRect(300, 300, 200, 20), true, ['190 Wash. 2d 249'], 0, () => {}, () => {});
    const popups = document.querySelectorAll('.cl-cite-popup');
    expect(popups.length).toBe(1);
  });
});

describe('hidePopup', () => {
  it('removes the popup from the DOM', () => {
    showPopup(fakeRect(100, 100, 200, 20), true, ['190 Wash. 2d 249'], 0, () => {}, () => {});
    hidePopup();
    expect(document.querySelector('.cl-cite-popup')).toBeNull();
  });
});

describe('flashMessage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates a flash message element', () => {
    flashMessage('Copied to clipboard!');
    const flash = document.querySelector('.cl-cite-flash');
    expect(flash).not.toBeNull();
    expect(flash!.textContent).toBe('Copied to clipboard!');
  });

  it('has white background with ~95% opacity and dark text', () => {
    flashMessage('Copied!');
    const flash = document.querySelector('.cl-cite-flash') as HTMLElement;
    expect(flash.style.background).toMatch(/rgba\(255,\s*255,\s*255,\s*0\.95\)/);
    expect(flash.style.color).toMatch(/#1a1a1a|#222|rgb\(26/);
  });

  it('has a max-width of 600px', () => {
    flashMessage('Copied!');
    const flash = document.querySelector('.cl-cite-flash') as HTMLElement;
    expect(flash.style.maxWidth).toBe('600px');
  });

  it('removes the flash element after a short delay', (done) => {
    flashMessage('Copied!');
    expect(document.querySelector('.cl-cite-flash')).not.toBeNull();
    setTimeout(() => {
      expect(document.querySelector('.cl-cite-flash')).toBeNull();
      done();
    }, 1200);
  });
});

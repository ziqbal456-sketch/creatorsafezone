export const CANVAS = Object.freeze({width: 1080, height: 1920});
export const WARNING_PX = 24;
const platforms = ['TikTok', 'Instagram Reels', 'YouTube Shorts'];

export function buildSurfaces(registry) {
  return platforms.map(name => {
    const record = registry.records.find(r => r.platform === name && r.canvas === '1080x1920');
    if (!record) throw new Error('Missing working-area record for ' + name);
    const upper = side => {
      const range = record.rangesPx?.[side]?.match(/^(\d+)-(\d+)$/);
      if (!range || +range[1] > +range[2]) throw new Error('Invalid margin for ' + name);
      return +range[2];
    };
    const bounds = {left: 0, top: upper('top'), right: CANVAS.width - upper('right'), bottom: CANVAS.height - upper('bottom')};
    if (bounds.right <= 0 || bounds.bottom <= bounds.top || bounds.top < 0) throw new Error('Invalid working area');
    return {name, id: record.id, bounds, evidence: record.evidenceStatus, reviewed: record.reviewed};
  });
}

export function validRect(rect) {
  return ['x','y','width','height'].every(k => Number.isFinite(rect[k])) && rect.width > 0 && rect.height > 0 &&
    rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= CANVAS.width && rect.y + rect.height <= CANVAS.height;
}

export function assess(rect, surface) {
  if (!validRect(rect)) throw new Error('Element must fit within the 1080 × 1920 canvas.');
  const b = surface.bounds;
  const distances = {left: rect.x - b.left, top: rect.y - b.top, right: b.right - rect.x - rect.width, bottom: b.bottom - rect.y - rect.height};
  const covered = Object.entries(distances).filter(([,n]) => n < 0).map(([side]) => side);
  const near = Object.entries(distances).filter(([,n]) => n >= 0 && n < WARNING_PX).map(([side]) => side);
  const status = covered.length ? 'Covered' : near.length ? 'Warning' : 'Safe';
  const fits = rect.width <= b.right - b.left - 2 * WARNING_PX && rect.height <= b.bottom - b.top - 2 * WARNING_PX;
  const x = fits ? Math.max(b.left + WARNING_PX, Math.min(rect.x, b.right - WARNING_PX - rect.width)) : null;
  const y = fits ? Math.max(b.top + WARNING_PX, Math.min(rect.y, b.bottom - WARNING_PX - rect.height)) : null;
  const moves = fits ? [x !== rect.x ? `${Math.abs(x - rect.x)} px ${x < rect.x ? 'left' : 'right'}` : '', y !== rect.y ? `${Math.abs(y - rect.y)} px ${y < rect.y ? 'up' : 'down'}` : ''].filter(Boolean) : [];
  return {status, sides: covered.length ? covered : near, suggestion: status === 'Safe' ? 'Inside the working area with at least 24 px clearance.' : !fits ? 'Resize this element to fit inside the working area with 24 px clearance.' : 'Move approximately ' + moves.join(' and ') + '.', target: fits ? {x,y} : null};
}

export function summarize(elements, surface) {
  if (!elements.length) return 'Not checked';
  const states = elements.map(e => assess(e, surface).status);
  return states.includes('Covered') ? 'Covered' : states.includes('Warning') ? 'Warning' : 'Safe';
}

export function makeReport(elements, surfaces) {
  return ['CreatorSafeZone — placement planning report', 'Canvas: 1080 × 1920; media fitted without cropping.',
    'Only manually marked regions are checked. This is not automatic text detection or a review of every video frame.',
    'Safe = inside the working area; Warning = less than 24 px clearance; Covered = overlaps an estimated margin.',
    'These are recommendations, not verified platform measurements. Confirm in the destination app before publishing.', '',
    ...surfaces.flatMap(s => [s.name + ': ' + summarize(elements, s), 'Evidence: ' + s.evidence + '; registry review label: ' + s.reviewed,
      ...elements.map(e => { const r = assess(e,s); return `${e.label}: ${r.status}. ${r.suggestion}`; }), '']),
    'Methodology: https://creatorsafezone.com/methodology'].join('\n');
}

import { read, pages } from './validate-site.mjs';
const findings = [];
for (const file of pages()) {
  const html = read(file);
  for (const phrase of ['guarantees', 'guarantee complete', 'requires leaving', 'Reels are cropped', 'three distinct aspect ratios', 'empirically', 'iPhone 16 Pro', 'v340+']) {
    if (html.toLowerCase().includes(phrase.toLowerCase())) findings.push(file + ': review evidence/context for "' + phrase + '" (including schema)');
  }
}
const registry = JSON.parse(read('measurement-registry.json'));
for (const r of registry.records) {
  if (!r.source && !r.screenshotReference) findings.push(r.id + ': no supporting source/capture reference in registry');
  const date = Date.parse((r.reviewed?.length === 7 ? r.reviewed + '-01' : r.reviewed) || '');
  if (!Number.isFinite(date) || Date.now() - date > 90 * 86400000) findings.push(r.id + ': review date missing or older than 90 days');
}
console.log('Editorial review findings (advisory, not proof of a false claim):');
findings.forEach(f => console.log('- ' + f));
console.log(findings.length + ' findings. Review before content expansion; do not auto-rewrite or update evidence dates.');

import { useState } from 'react';
import { Clipboard, Save, PlusCircle, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { usePartListStore } from '@/stores/partListStore';
import { CATEGORY_LABELS } from '@/types';
import { formatPrice } from '@/lib/utils';

interface BuilderToolbarProps {
  listId: string;
}

function BuilderToolbar({ listId }: BuilderToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [markupCopied, setMarkupCopied] = useState<string | null>(null);
  const clearAll = usePartListStore((s) => s.clearAll);
  const items = usePartListStore((s) => s.items);
  const getTotalPrice = usePartListStore((s) => s.getTotalPrice);

  const shareUrl = `pcparcasecici.com/liste/${listId}`;

  function handleCopyUrl() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function getSelectedParts() {
    return items.filter((item) => item.product !== null);
  }

  function handleCopyReddit() {
    const parts = getSelectedParts();
    const lines = [
      `[PCParcaSecici Yapilandirma](https://${shareUrl})`,
      '',
      'Bilesen | Urun | Fiyat',
      ':--|:--|:--',
    ];
    for (const item of parts) {
      const label = CATEGORY_LABELS[item.category];
      const name = item.product!.name;
      const price = formatPrice(item.product!.bestPrice);
      lines.push(`${label} | ${name} | ${price}`);
    }
    lines.push(`| **Toplam** | **${formatPrice(getTotalPrice())}**`);
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setMarkupCopied('reddit');
      setTimeout(() => setMarkupCopied(null), 2000);
    });
  }

  function handleCopyBBCode() {
    const parts = getSelectedParts();
    const lines = [
      `[b]PCParcaSecici Yapilandirma[/b]`,
      `[url=https://${shareUrl}]${shareUrl}[/url]`,
      '',
      '[table]',
      '[tr][th]Bilesen[/th][th]Urun[/th][th]Fiyat[/th][/tr]',
    ];
    for (const item of parts) {
      const label = CATEGORY_LABELS[item.category];
      const name = item.product!.name;
      const price = formatPrice(item.product!.bestPrice);
      lines.push(`[tr][td]${label}[/td][td]${name}[/td][td]${price}[/td][/tr]`);
    }
    lines.push(`[tr][td][/td][td][b]Toplam[/b][/td][td][b]${formatPrice(getTotalPrice())}[/b][/td][/tr]`);
    lines.push('[/table]');
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setMarkupCopied('bbcode');
      setTimeout(() => setMarkupCopied(null), 2000);
    });
  }

  function handleCopyHTML() {
    const parts = getSelectedParts();
    const lines = [
      `<h3>PCParcaSecici Yapilandirma</h3>`,
      `<p><a href="https://${shareUrl}">${shareUrl}</a></p>`,
      '<table>',
      '<thead><tr><th>Bilesen</th><th>Urun</th><th>Fiyat</th></tr></thead>',
      '<tbody>',
    ];
    for (const item of parts) {
      const label = CATEGORY_LABELS[item.category];
      const name = item.product!.name;
      const price = formatPrice(item.product!.bestPrice);
      lines.push(`<tr><td>${label}</td><td>${name}</td><td>${price}</td></tr>`);
    }
    lines.push(`<tr><td></td><td><strong>Toplam</strong></td><td><strong>${formatPrice(getTotalPrice())}</strong></td></tr>`);
    lines.push('</tbody></table>');
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setMarkupCopied('html');
      setTimeout(() => setMarkupCopied(null), 2000);
    });
  }

  function handleNewList() {
    if (window.confirm('Mevcut yapilandirma silinecek. Emin misiniz?')) {
      clearAll();
    }
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-4 py-3 mb-4 flex flex-col md:flex-row items-start md:items-center gap-3">
      {/* Share URL */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex items-center bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg overflow-hidden flex-1 min-w-0">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="bg-transparent text-sm text-[var(--text-secondary)] px-3 py-2 flex-1 min-w-0 outline-none"
          />
          <button
            onClick={handleCopyUrl}
            className="px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-l border-[var(--border-color)] transition-colors"
            title="Kopyala"
          >
            {copied ? <Check size={16} className="text-[#28A745]" /> : <Clipboard size={16} />}
          </button>
        </div>
      </div>

      {/* Markup buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyReddit}
          className={markupCopied === 'reddit' ? 'text-[#28A745]' : ''}
        >
          {markupCopied === 'reddit' ? 'Kopyalandi!' : 'Reddit'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyBBCode}
          className={markupCopied === 'bbcode' ? 'text-[#28A745]' : ''}
        >
          {markupCopied === 'bbcode' ? 'Kopyalandi!' : 'BBCode'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyHTML}
          className={markupCopied === 'html' ? 'text-[#28A745]' : ''}
        >
          {markupCopied === 'html' ? 'Kopyalandi!' : 'HTML'}
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm">
          <Save size={16} className="mr-1.5" />
          Kaydet
        </Button>
        <Button variant="secondary" size="sm" onClick={handleNewList}>
          <PlusCircle size={16} className="mr-1.5" />
          Yeni Baslat
        </Button>
      </div>
    </div>
  );
}

export default BuilderToolbar;

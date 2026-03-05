import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Zap, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { CompatibilityIssue } from '@/types';

interface CompatibilityBarProps {
  issues: CompatibilityIssue[];
  estimatedWattage: number;
}

function CompatibilityBar({ issues, estimatedWattage }: CompatibilityBarProps) {
  const [expanded, setExpanded] = useState(false);

  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');
  const infos = issues.filter((i) => i.type === 'info');

  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const hasIssues = issues.length > 0;

  let barBg: string;
  let barBorder: string;
  let StatusIcon: typeof CheckCircle;
  let statusText: string;
  let statusColor: string;

  if (hasErrors) {
    barBg = 'bg-[#DC3545]/10';
    barBorder = 'border-[#DC3545]/30';
    StatusIcon = XCircle;
    statusText = 'Hata: Bu parcalar uyumsuz!';
    statusColor = 'text-[#DC3545]';
  } else if (hasWarnings) {
    barBg = 'bg-[#FFC107]/10';
    barBorder = 'border-[#FFC107]/30';
    StatusIcon = AlertTriangle;
    statusText = 'Uyari: Bu parcalar potansiyel sorunlar iceriyor.';
    statusColor = 'text-[#FFC107]';
  } else {
    barBg = 'bg-[#28A745]/10';
    barBorder = 'border-[#28A745]/30';
    StatusIcon = CheckCircle;
    statusText = 'Uyumluluk: Sorun bulunamadi.';
    statusColor = 'text-[#28A745]';
  }

  return (
    <div className="mb-4">
      <div
        className={`rounded-lg px-4 py-3 border ${barBg} ${barBorder} flex items-center justify-between ${
          hasIssues ? 'cursor-pointer' : ''
        }`}
        onClick={() => hasIssues && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <StatusIcon size={20} className={statusColor} />
          <span className={`font-medium ${statusColor}`}>{statusText}</span>
        </div>

        <div className="flex items-center gap-4">
          {estimatedWattage > 0 && (
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <Zap size={16} className="text-[#FFC107]" />
              <span className="text-sm">
                Tahmini Guc Tuketimi: <strong className="text-[var(--text-primary)]">{estimatedWattage}W</strong>
              </span>
            </div>
          )}
          {hasIssues && (
            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>

      {expanded && hasIssues && (
        <div className={`mt-1 rounded-lg border ${barBorder} ${barBg} px-4 py-3 space-y-2`}>
          {errors.map((issue, idx) => (
            <div key={`error-${idx}`} className="flex items-start gap-2">
              <XCircle size={16} className="text-[#DC3545] mt-0.5 shrink-0" />
              <span className="text-sm text-[#DC3545]">{issue.message}</span>
            </div>
          ))}
          {warnings.map((issue, idx) => (
            <div key={`warning-${idx}`} className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-[#FFC107] mt-0.5 shrink-0" />
              <span className="text-sm text-[#FFC107]">{issue.message}</span>
            </div>
          ))}
          {infos.map((issue, idx) => (
            <div key={`info-${idx}`} className="flex items-start gap-2">
              <Info size={16} className="text-[#6699FF] mt-0.5 shrink-0" />
              <span className="text-sm text-[#6699FF]">{issue.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompatibilityBar;

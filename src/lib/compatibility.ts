import type { PartListItem, CompatibilityIssue, Product } from '@/types';

function getSpec(product: Product | null, key: string): string | number | boolean | string[] | undefined {
  if (!product) return undefined;
  return product.specs[key];
}

export function checkCompatibility(items: PartListItem[]): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  const cpu = items.find(i => i.category === 'cpu')?.product;
  const motherboard = items.find(i => i.category === 'motherboard')?.product;
  const ram = items.find(i => i.category === 'ram')?.product;
  const gpu = items.find(i => i.category === 'gpu')?.product;
  const psu = items.find(i => i.category === 'psu')?.product;
  const pcCase = items.find(i => i.category === 'case')?.product;
  const cooler = items.find(i => i.category === 'cpu-cooler')?.product;

  // CPU + Motherboard socket check
  if (cpu && motherboard) {
    const cpuSocket = getSpec(cpu, 'socket');
    const mbSocket = getSpec(motherboard, 'socket');
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        type: 'error',
        message: `İşlemci soketi (${cpuSocket}) anakart soketi (${mbSocket}) ile uyumsuz.`,
        parts: ['cpu', 'motherboard'],
      });
    }
  }

  // RAM + Motherboard type check
  if (ram && motherboard) {
    const ramType = getSpec(ram, 'type');
    const mbMemType = getSpec(motherboard, 'memoryType');
    if (ramType && mbMemType && ramType !== mbMemType) {
      issues.push({
        type: 'error',
        message: `RAM tipi (${ramType}) anakart bellek tipi (${mbMemType}) ile uyumsuz.`,
        parts: ['ram', 'motherboard'],
      });
    }
  }

  // RAM capacity check
  if (ram && motherboard) {
    const totalCapacity = getSpec(ram, 'totalCapacity') as number | undefined;
    const maxMemory = getSpec(motherboard, 'maxMemory') as number | undefined;
    if (totalCapacity && maxMemory && totalCapacity > maxMemory) {
      issues.push({
        type: 'error',
        message: `RAM kapasitesi (${totalCapacity}GB) anakartın desteklediği maksimum (${maxMemory}GB) değerini aşıyor.`,
        parts: ['ram', 'motherboard'],
      });
    }
  }

  // PSU wattage check
  if (psu) {
    const totalTDP = calculateTotalTDP(items);
    const psuWattage = getSpec(psu, 'wattage') as number | undefined;
    if (psuWattage && totalTDP > psuWattage * 0.8) {
      issues.push({
        type: 'warning',
        message: `Tahmini güç tüketimi (${totalTDP}W) güç kaynağının kapasitesine (${psuWattage}W) yakın. Daha yüksek watt değerli bir PSU önerilir.`,
        parts: ['psu'],
      });
    }
    if (psuWattage && totalTDP > psuWattage) {
      issues.push({
        type: 'error',
        message: `Tahmini güç tüketimi (${totalTDP}W) güç kaynağı kapasitesini (${psuWattage}W) aşıyor!`,
        parts: ['psu'],
      });
    }
  }

  // GPU length + Case check
  if (gpu && pcCase) {
    const gpuLength = getSpec(gpu, 'length') as number | undefined;
    const maxGPULength = getSpec(pcCase, 'maxGPULength') as number | undefined;
    if (gpuLength && maxGPULength && gpuLength > maxGPULength) {
      issues.push({
        type: 'error',
        message: `Ekran kartı uzunluğu (${gpuLength}mm) kasanın desteklediği maksimum (${maxGPULength}mm) değerini aşıyor.`,
        parts: ['gpu', 'case'],
      });
    }
  }

  // Cooler height + Case check
  if (cooler && pcCase) {
    const coolerHeight = getSpec(cooler, 'height') as number | undefined;
    const maxCoolerHeight = getSpec(pcCase, 'maxCoolerHeight') as number | undefined;
    if (coolerHeight && maxCoolerHeight && coolerHeight > maxCoolerHeight) {
      issues.push({
        type: 'error',
        message: `CPU soğutucu yüksekliği (${coolerHeight}mm) kasanın desteklediği maksimum (${maxCoolerHeight}mm) değerini aşıyor.`,
        parts: ['cpu-cooler', 'case'],
      });
    }
  }

  // Motherboard form factor + Case check
  if (motherboard && pcCase) {
    const mbFormFactor = getSpec(motherboard, 'formFactor') as string | undefined;
    const caseFormFactors = getSpec(pcCase, 'formFactor') as string[] | undefined;
    if (mbFormFactor && caseFormFactors && Array.isArray(caseFormFactors) && !caseFormFactors.includes(mbFormFactor)) {
      issues.push({
        type: 'error',
        message: `Anakart form faktörü (${mbFormFactor}) kasa ile uyumsuz. Kasa desteklenen: ${caseFormFactors.join(', ')}`,
        parts: ['motherboard', 'case'],
      });
    }
  }

  // Cooler + CPU socket check
  if (cooler && cpu) {
    const cpuSocket = getSpec(cpu, 'socket') as string | undefined;
    const coolerSockets = getSpec(cooler, 'sockets') as string[] | undefined;
    if (cpuSocket && coolerSockets && Array.isArray(coolerSockets) && !coolerSockets.includes(cpuSocket)) {
      issues.push({
        type: 'error',
        message: `CPU soğutucu ${cpuSocket} soketini desteklemiyor. Desteklenen: ${coolerSockets.join(', ')}`,
        parts: ['cpu-cooler', 'cpu'],
      });
    }
  }

  // No PSU warning
  if (!psu && items.some(i => i.product)) {
    issues.push({
      type: 'info',
      message: 'Henüz bir güç kaynağı seçilmedi. Uyumluluk kontrolü için bir PSU ekleyin.',
      parts: ['psu'],
    });
  }

  return issues;
}

export function calculateTotalTDP(items: PartListItem[]): number {
  let total = 0;

  for (const item of items) {
    if (!item.product) continue;

    if (item.product.tdp) {
      total += item.product.tdp;
    } else {
      const specTDP = item.product.specs['tdp'];
      if (typeof specTDP === 'number') {
        total += specTDP;
      }
    }
  }

  // Base system power (fans, RAM, storage, etc.)
  if (total > 0) {
    total += 50;
  }

  return total;
}

<script>
  let { row, label, unit = 'providers' } = $props();
  const pct = n => n == null ? '—' : `${n.toFixed(1)}%`;
</script>
<div class="chart-row" data-total={row.total} data-small={row.smallGroup} data-small-pct={row.smallGroupPct} data-remaining-pct={row.remainingGroupPct}>
  <div class="chart-label"><strong>{label}</strong><small>{row.total} {unit}</small></div>
  <div class="bar" role="img" aria-label={`${label}: documented or likely small ${row.smallGroup} of ${row.total} (${pct(row.smallGroupPct)}); documented not small, likely not small, or unknown ${row.remainingGroup} of ${row.total} (${pct(row.remainingGroupPct)}).`}>
    <span class="documented" style:width="{row.smallGroupPct??0}%"></span>
    <span class="other" style:width="{row.remainingGroupPct??0}%"></span>
  </div>
  <div class="chart-value">{row.smallGroup} / {row.total}<small>{pct(row.smallGroupPct)} small</small></div>
</div>

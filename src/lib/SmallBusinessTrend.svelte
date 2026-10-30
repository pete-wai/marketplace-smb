<script>
  let { rows, unit, asOf } = $props();
  const width = 960, height = 360;
  const left = 60, right = 28, top = 24, bottom = 56;
  const ticks = [0, 25, 50, 75, 100];
  const y = value => top + (100 - value) / 100 * (height - top - bottom);
  let firstYear = $derived(Number(rows[0]?.year ?? 0));
  let lastYear = $derived(Number(rows.at(-1)?.year ?? firstYear));
  const x = year => left + (Number(year) - firstYear) / Math.max(1, lastYear - firstYear) * (width - left - right);
  let points = $derived(rows.filter(r => r.total > 0 && r.smallGroupPct != null));
  let path = $derived.by(() => {
    let previousYear = null;
    return points.map(row => {
      const command = previousYear === Number(row.year) - 1 ? 'L' : 'M';
      previousYear = Number(row.year);
      return `${command}${x(row.year)},${y(row.smallGroupPct)}`;
    }).join(' ');
  });
</script>

<figure class="trend-figure" aria-labelledby="percentage-trend-title">
  <h3 id="percentage-trend-title">Percentage documented or likely small over time</h3>
  <p class="unit-note">Share of each certification-year cohort · {unit} · most recent size assessment as of {asOf}</p>
  <div class="trend-scroll" role="region" aria-label="Scrollable percentage trend chart">
    <svg viewBox="0 0 960 360" role="img" aria-labelledby="percentage-svg-title percentage-svg-desc">
      <title id="percentage-svg-title">Documented or likely small: percentage by certification year</title>
      <desc id="percentage-svg-desc">The vertical axis runs from zero to 100 percent. Each point is the small-group count divided by all {unit} in that annual cohort, including unknowns in the denominator. Current size assessments are applied to past certification cohorts. Exact counts are in the annual table below.</desc>
      {#each ticks as tick (tick)}
        <line x1={left} x2={width-right} y1={y(tick)} y2={y(tick)} class="gridline" />
        <text x={left-12} y={y(tick)+5} text-anchor="end" class="axis-label">{tick}%</text>
      {/each}
      <path d={path} class="trend-line" />
      {#each rows as row (row.year)}
        <text x={x(row.year)} y={height-26} text-anchor="middle" class="axis-label">{row.year}{row.partial?'*':''}</text>
      {/each}
      {#each points as row (row.year)}
        <g data-trend-year={row.year} data-trend-pct={row.smallGroupPct}>
          <title>{row.year}{row.partial?' (partial year)':''}: {row.smallGroup} of {row.total} {unit}, {row.smallGroupPct.toFixed(1)}% documented or likely small</title>
          <circle cx={x(row.year)} cy={y(row.smallGroupPct)} r="5" class:partial={row.partial} />
          <text x={x(row.year)} y={y(row.smallGroupPct)-14} text-anchor="middle" class="point-label">{row.smallGroupPct.toFixed(1)}%</text>
        </g>
      {/each}
      <text x={left+(width-left-right)/2} y={height-3} text-anchor="middle" class="axis-label">First recorded certification year</text>
    </svg>
  </div>
  <figcaption>Small-group count ÷ all {unit} in that year. * Partial year through {asOf}. This shows current assessed size within past cohorts, not historical size or cumulative participation. On narrow screens, scroll horizontally to see every year.</figcaption>
</figure>

<style>
  .trend-figure { margin: 32px 0 40px; }
  h3 { margin-bottom: 8px; }
  .unit-note { margin-top: 0; }
  .trend-scroll { overflow-x: auto; max-width: 100%; }
  svg { display: block; width: 100%; min-width: 800px; height: auto; overflow: visible; }
  .gridline { stroke: var(--line); stroke-width: 1; }
  .axis-label { fill: var(--muted); font-size: 16px; }
  .trend-line { fill: none; stroke: var(--teal); stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; }
  circle { fill: var(--teal); stroke: var(--teal); stroke-width: 2; }
  circle.partial { fill: #fafaf6; }
  .point-label { fill: var(--ink); font-size: 15px; font-weight: 600; paint-order: stroke; stroke: #fafaf6; stroke-width: 4px; stroke-linejoin: round; }
  figcaption { margin-top: 12px; font-size: .94rem; color: var(--muted); line-height: 1.5; max-width: 85ch; }
</style>

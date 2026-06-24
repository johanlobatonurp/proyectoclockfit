export function summarizeSeries(series) {
  if (!series || series.length === 0) return '0 series';
  const n = series.length;
  const sameReps = series.every((s) => s.reps === series[0].reps);
  const sameWeight = series.every((s) => s.weight === series[0].weight);
  if (sameReps && sameWeight) {
    return `${n} series · ${series[0].reps} reps · ${series[0].weight}kg`;
  }
  return `${n} series`;
}
export function isInSchedule(): boolean {
  const h = new Date().getHours();
  return h >= 9 && h < 19;
}

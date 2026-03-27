export const lerp = (current: number, target: number, alpha = 0.05) => current + (target - current) * alpha;
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

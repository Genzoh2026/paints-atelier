/** Compose painting passes without changing the per-medium brush algorithms. */
export const MEDIA = [['painterly', '油彩'], ['pencil', '鉛筆'], ['watercolor', '水彩'], ['crayon', 'クレヨン'], ['charcoal', '木炭'], ['pastel', 'ソフトパステル'], ['marker', 'マーカー']];
export const mediumLabel = style => MEDIA.find(([value]) => value === style)?.[1] || '油彩';

export function validateSecondary(primary, secondary, strength, mode = 'overpaint') {
    if (!['overpaint', 'finish'].includes(mode)) throw Error('セカンド画材の描き方が不正です。');
    if (secondary !== 'none' && (!MEDIA.some(([value]) => value === secondary) || secondary === primary)) {
        throw Error('セカンド画材は主画材と異なる画材を選んでください。');
    }
    if (!Number.isFinite(strength) || strength < 0 || strength > 100) throw Error('重ねる強さは0〜100で指定してください。');
}

export function paintingPasses(config) {
    const { style, secondaryStyle = 'none', secondaryStrength = 35, secondaryMode = 'overpaint' } = config;
    validateSecondary(style, secondaryStyle, secondaryStrength, secondaryMode);
    const passes = [0, 1, 2, 3].map(index => ({ style, index, opacity: 1, secondary: false }));
    if (secondaryStyle !== 'none' && secondaryStrength > 0) {
        // Overpaint starts with broad marks; finish adds only detail. Neither resets the ground.
        const indices = secondaryMode === 'overpaint' ? [0, 1, 2, 3] : [2, 3];
        passes.push(...indices.map(index => ({ style: secondaryStyle, index,
            opacity: secondaryStrength / 100, secondary: true })));
    }
    return passes;
}

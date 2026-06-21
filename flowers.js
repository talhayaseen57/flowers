
(function () {
    const NS = 'http://www.w3.org/2000/svg';
    function svgEl(tag, attrs) {
        const el = document.createElementNS(NS, tag);
        Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
    }

    function buildField() {
        const svg = document.getElementById('field-svg');
        if (!svg) return;

        const hillG = svgEl('g', {});
        hillG.appendChild(svgEl('path', {
            d: 'M0,360 L0,210 Q250,175 500,200 Q750,225 1000,185 L1000,360 Z',
            fill: '#2a1638'
        }));
        svg.appendChild(hillG);

        const rows = [
            { baseY: 230, stemH: 38, count: 24, scale: 0.55, color: '#a98bc9', opacity: 0.78 },
            { baseY: 272, stemH: 52, count: 20, scale: 0.8, color: '#8d6bc0', opacity: 0.9 },
            { baseY: 320, stemH: 68, count: 16, scale: 1.05, color: '#7a57ad', opacity: 1 }
        ];

        rows.forEach(row => {
            const rowG = svgEl('g', { opacity: row.opacity });
            for (let i = 0; i < row.count; i++) {
                const slot = 1000 / row.count;
                const x = Math.round((i + 0.5) * slot + (Math.random() * slot * 0.4 - slot * 0.2));
                const stemTop = row.baseY - row.stemH;

                const delay = -((x / 1000) * 3.6).toFixed(2);
                const stalk = svgEl('g', { class: 'stalk', style: `animation-delay:${delay}s` });

                stalk.appendChild(svgEl('line', {
                    x1: x, y1: row.baseY, x2: x, y2: stemTop,
                    stroke: '#5e7457', 'stroke-width': Math.max(1.4, 2 * row.scale), 'stroke-linecap': 'round'
                }));

                const bumps = 6;
                const spikeLen = 28 * row.scale;
                for (let b = 0; b < bumps; b++) {
                    const t = b / (bumps - 1);
                    const by = stemTop - t * spikeLen;
                    const bx = x + (b % 2 === 0 ? -2.2 * row.scale : 2.2 * row.scale);
                    stalk.appendChild(svgEl('ellipse', {
                        cx: bx, cy: by, rx: 3.4 * row.scale, ry: 4.6 * row.scale, fill: row.color
                    }));
                }
                rowG.appendChild(stalk);
            }
            svg.appendChild(rowG);
        });
    }

    function buildSparkles() {
        const field = document.querySelector('.sparkle-field');
        if (!field) return;
        for (let i = 0; i < 28; i++) {
            const s = document.createElement('div');
            s.className = 'sparkle';
            s.style.left = (Math.random() * 100) + '%';
            s.style.top = (Math.random() * 55) + '%';
            s.style.animationDelay = (Math.random() * 4) + 's';
            s.style.animationDuration = (2.2 + Math.random() * 2.6) + 's';
            field.appendChild(s);
        }
    }

    const petalColors = ['#8d6bc0', '#a98bc9', '#b497d6', '#7a57ad'];
    function spawnPetal() {
        const field = document.querySelector('.petal-field');
        if (!field) return;
        const p = document.createElement('div');
        p.className = 'petal';
        const size = 7 + Math.random() * 8;
        p.style.left = (Math.random() * 100) + '%';
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
        p.style.setProperty('--drift', Math.round(Math.random() * 130 - 65) + 'px');
        p.style.animationDuration = (8 + Math.random() * 7) + 's';
        field.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }

    document.addEventListener('DOMContentLoaded', () => {
        buildField();
        buildSparkles();
        for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 350);
        setInterval(spawnPetal, 700);
    });
})();
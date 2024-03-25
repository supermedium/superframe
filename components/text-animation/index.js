AFRAME.registerComponent('text-animation', {
    schema: {
        text: { type: 'string' },
        font: { type: 'selector' },
        fontSize: { type: 'number', default: 0.5 },
        color: { type: 'string', default: '#FFF' },
        charsPerLine: { type: 'number', default: 10 },
        indent: { type: 'number', default: 2 },
        position: { type: 'vec3', default: { x: 0, y: 2, z: -5 } },
        letterSpacing: { type: 'number', default: 0 },
        lineHeight: { type: 'number', default: 1.5 },        
        curveSegments: { type: 'number', default: 4 },
        height: { type: 'number', default: 0.05 },
    },
    init: function () {
        const data = this.data;
        const el = this.el;
        const functionName = data._function;
        delete this._function;
        const characters = data.text.split('');
        let currentLine = 0;
        let charIndex = 0;
        let index = 0; 

        const animateText = () => {
            if (index >= characters.length) return; // if all characters have been animated, exit function
            const char = characters[index];
            if (charIndex >= data.charsPerLine || (currentLine === 0 && charIndex >= data.charsPerLine - data.indent)) {
                currentLine++;
                charIndex = 0;
            }
            const deltaPosition = {
                x: (charIndex + (currentLine === 0 ? data.indent : 0)) * (data.fontSize + data.letterSpacing),
                y: -currentLine * (data.fontSize * data.lineHeight),
                z: 0
            };
            const curPosition = {
                x: data.position.x + deltaPosition.x,
                y: data.position.y + deltaPosition.y,
                z: data.position.z + deltaPosition.z
            };
            const textEl = document.createElement('a-entity');
            textEl.setAttribute('text-geometry', {
                value: char,
                font: data.font.getAttribute('src'),
                size: data.fontSize,
                bevelEnabled: false,
                curveSegments: data.curveSegments,
                height:data.height
            });
            textEl.setAttribute('material', { color: data.color, transparent: true, opacity: 0 });
            textEl.setAttribute('position', curPosition);
            if (functionName && typeof window[functionName] === 'function') {
                window[functionName](textEl, index, curPosition, data);
            }
            else { console.log('no function provided'); }
           el.appendChild(textEl);
            charIndex++;
            index++; 
            requestAnimationFrame(animateText);
        };
        animateText();
    }
});

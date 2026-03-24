
export const renderAnsi = (text) => {
    if (!text) return null;
    const parts = text.split(/(\x1b\[[\d;]*m)/g);
    let style = {};
    return parts.map((part, i) => {
        if (part.match(/^\x1b\[[\d;]*m$/)) {
            const codes = part.slice(2, -1).split(';').map(Number);
            codes.forEach(c => {
                if (c === 0) style = {};
                else if (c === 1) style.fontWeight = 'bold';
                else if (c === 2) style.opacity = 0.7;
                else if (c === 22) delete style.fontWeight;
                else if (c === 39) delete style.color;
                else if (c >= 30 && c <= 37) style.color = ['#000000', '#ef5350', '#66bb6a', '#ffa726', '#42a5f5', '#ab47bc', '#29b6f6', '#eeeeee'][c - 30];
            });
            return null;
        }
        return <span key={i} style={{ ...style }}>{part}</span>;
    });
};
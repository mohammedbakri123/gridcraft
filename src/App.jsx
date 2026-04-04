const { useState, useRef } = React;

const TOTAL_CELLS = 15;
const MAX_HISTORY = 15;
const DEFAULT_COLOR = '#2a2a2a';

const rgbToHex = (r, g, b) =>
  '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

const App = () => {
  const [cells, setCells] = useState(Array(TOTAL_CELLS * TOTAL_CELLS).fill(DEFAULT_COLOR));
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#e63946');
  const [isEraser, setIsEraser] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerImport = () => fileInputRef.current?.click();

  const paintCell = (index) => {
    const newCells = [...cells];
    newCells[index] = isEraser ? DEFAULT_COLOR : selectedColor;

    setHistory(prev => [...prev.slice(-MAX_HISTORY + 1), cells]);
    setFuture([]);
    setCells(newCells);
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history.at(-1);

    setFuture(f => [cells, ...f.slice(0, MAX_HISTORY - 1)]);
    setHistory(h => h.slice(0, -1));
    setCells(prev);
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];

    setHistory(h => [...h.slice(-MAX_HISTORY + 1), cells]);
    setFuture(f => f.slice(1));
    setCells(next);
  };

  const clearAll = () => {
    setHistory(prev => [...prev.slice(-MAX_HISTORY + 1), cells]);
    setFuture([]);
    setCells(Array(TOTAL_CELLS * TOTAL_CELLS).fill(DEFAULT_COLOR));
  };

  const downloadImage = async () => {
    const grid = document.getElementById("pixel-grid");

    grid.classList.add("no-border", "no-gap");

    const canvas = await html2canvas(grid, {
      backgroundColor: null,
      scale: 8
    });

    grid.classList.remove("no-border", "no-gap");

    const link = document.createElement("a");
    link.download = "gridcraft.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const importImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid image file');
      return;
    }

    const reader = new FileReader();

    reader.onload = (ev) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = TOTAL_CELLS;
        canvas.height = TOTAL_CELLS;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, TOTAL_CELLS, TOTAL_CELLS);

        const pixels = ctx.getImageData(0, 0, TOTAL_CELLS, TOTAL_CELLS).data;

        const newCells = [];
        const uniqueColors = new Set();

        for (let i = 0; i < TOTAL_CELLS * TOTAL_CELLS; i++) {
          const r = pixels[i * 4];
          const g = pixels[i * 4 + 1];
          const b = pixels[i * 4 + 2];
          const a = pixels[i * 4 + 3];

          uniqueColors.add(`${r}-${g}-${b}`);

          newCells.push(a < 30 ? DEFAULT_COLOR : rgbToHex(r, g, b));
        }

        if (uniqueColors.size > 80) {
          if (!window.confirm("Image too detailed. Continue?")) return;
        }

        setHistory(prev => [...prev.slice(-MAX_HISTORY + 1), cells]);
        setFuture([]);
        setCells(newCells);

        showToast('Image imported!', 'success');
      };

      img.src = ev.target.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <Header />

      <Menu downloadImage={downloadImage} onImport={triggerImport} />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={importImage}
      />

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <Grid cells={cells} paintCell={paintCell} />

      <Tools
        undo={undo}
        redo={redo}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        clearAll={clearAll}
      />

      <Footer />
    </>
  );
};
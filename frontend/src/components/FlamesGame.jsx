import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FLAMES = [
  { key: 'F', label: 'Friends', tone: '#0ea5e9' },
  { key: 'L', label: 'Love', tone: '#ef4444' },
  { key: 'A', label: 'Affection', tone: '#f59e0b' },
  { key: 'M', label: 'Marriage', tone: '#10b981' },
  { key: 'E', label: 'Enemies', tone: '#64748b' },
  { key: 'S', label: 'Siblings', tone: '#8b5cf6' },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sanitize = (text) => text.toLowerCase().replace(/[^a-z]/g, '');

const buildCutData = (name1, name2) => {
  const a = sanitize(name1).split('').map((char, i) => ({ char, i, cut: false }));
  const b = sanitize(name2).split('').map((char, i) => ({ char, i, cut: false }));
  const available = new Set(b.map((_, i) => i));

  a.forEach((item) => {
    const idx = b.findIndex((candidate, i) => candidate.char === item.char && available.has(i));
    if (idx !== -1) {
      item.cut = true;
      b[idx].cut = true;
      available.delete(idx);
    }
  });

  return { a, b };
};

const computeFlamesDetails = (name1, name2) => {
  const a = sanitize(name1).split('');
  const b = sanitize(name2).split('');
  if (!a.length || !b.length) return null;

  const bWork = [...b];
  let common = 0;
  a.forEach((char) => {
    const idx = bWork.indexOf(char);
    if (idx !== -1) {
      common += 1;
      bWork.splice(idx, 1);
    }
  });

  const count = a.length + b.length - common * 2;
  if (count === 0) {
    return { count, result: FLAMES[2], removed: [] };
  }

  const pool = [...FLAMES];
  const removed = [];
  let idx = 0;
  while (pool.length > 1) {
    idx = (idx + count - 1) % pool.length;
    removed.push(pool[idx].key);
    pool.splice(idx, 1);
  }

  return { count, result: pool[0], removed };
};

const FlamesGame = ({ theme }) => {
  const [nameA, setNameA] = useState('');
  const [nameB, setNameB] = useState('');
  const [cutData, setCutData] = useState(null);
  const [cutPhase, setCutPhase] = useState(false);
  const [status, setStatus] = useState('Enter two names and reveal the flow.');
  const [result, setResult] = useState(null);
  const [eliminated, setEliminated] = useState([]);
  const [activeRemoval, setActiveRemoval] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [shareHint, setShareHint] = useState('');
  const [shareBusy, setShareBusy] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const runRef = useRef(0);
  const shareCardRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const board = useMemo(() => FLAMES.map((x) => x.key), []);

  const resetGameState = () => {
    runRef.current = 0;
    setCutData(null);
    setCutPhase(false);
    setResult(null);
    setEliminated([]);
    setActiveRemoval(null);
    setRunning(false);
    setError('');
    setShareHint('');
    setStatus('Enter two names and reveal the flow.');
  };

  const validateNames = () => {
    const cleanedA = sanitize(nameA);
    const cleanedB = sanitize(nameB);
    if (!cleanedA || !cleanedB) {
      return 'Please enter both names.';
    }
    if (cleanedA.length < 2 || cleanedB.length < 2) {
      return 'Each name should have at least 2 letters.';
    }
    if (cleanedA === cleanedB) {
      return 'Use two different names for a fun result.';
    }
    return '';
  };

  const getScreenshotBlob = async () => {
    const node = shareCardRef.current;
    const html2canvas = window?.html2canvas;
    if (!node || !html2canvas) throw new Error('Screenshot service is not ready.');

    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: '#fff1f2',
      useCORS: true,
      ignoreElements: (element) => element?.dataset?.captureExclude === 'true',
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const handleDownload = async () => {
    if (!result || shareBusy) return;
    setShareHint('');
    setShareBusy(true);
    try {
      const blob = await getScreenshotBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flames-${(nameA || 'name1').trim() || 'name1'}-${(nameB || 'name2').trim() || 'name2'}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setShareHint('Could not generate image. Please try again.');
    } finally {
      setShareBusy(false);
    }
  };

  const handleNativeShare = async () => {
    if (!result || shareBusy) return;
    setShareHint('');
    setShareBusy(true);
    try {
      const blob = await getScreenshotBlob();
      const file = new File([blob], 'flames-result.png', { type: 'image/png' });
      const title = 'My FLAMES Result';
      const text = `${nameA || 'Name 1'} + ${nameB || 'Name 2'} = ${result?.key} - ${result?.label}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title, text, files: [file] });
        return true;
      }

      if (navigator.share) {
        await navigator.share({ title, text });
        setShareHint('Image sharing is limited on this device. You can use Download Image and share manually.');
        return true;
      }

      setShareHint('Native share is not available. Please use Download Image.');
      return false;
    } catch {
      setShareHint('Share failed. Please try Download Image.');
      return false;
    } finally {
      setShareBusy(false);
    }
  };

  const handleWhatsAppShare = async () => {
    if (!result || shareBusy) return;
    const text = encodeURIComponent(
      `${nameA || 'Name 1'} + ${nameB || 'Name 2'} = ${result?.key} - ${result?.label} | Played on KKDesign`
    );
    const shared = await handleNativeShare();
    if (!shared) {
      window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
      setShareHint('If image is not attached in WhatsApp Web, tap Download Image and attach it manually.');
    }
  };

  const handleReveal = async (e) => {
    e.preventDefault();
    if (running) return;
    setError('');
    setShareHint('');
    const validationError = validateNames();
    if (validationError) {
      setError(validationError);
      return;
    }
    const details = computeFlamesDetails(nameA, nameB);
    if (!details) return;

    const runId = Date.now();
    runRef.current = runId;
    const active = () => runRef.current === runId;

    setRunning(true);
    setResult(null);
    setEliminated([]);
    setActiveRemoval(null);
    setCutPhase(false);
    setCutData(buildCutData(nameA, nameB));

    setStatus('Step 1/3: Finding and cutting common letters...');
    await sleep(500);
    if (!active()) return;
    setCutPhase(true);
    await sleep(2400);
    if (!active()) return;

    setStatus(`Step 2/3: Leftover count is ${details.count}`);
    await sleep(1000);
    if (!active()) return;

    setStatus('Step 3/3: Eliminating FLAMES slowly...');
    for (const key of details.removed) {
      setActiveRemoval(key);
      await sleep(800);
      if (!active()) return;
      setEliminated((prev) => [...prev, key]);
      setActiveRemoval(null);
      await sleep(550);
      if (!active()) return;
    }

    setResult(details.result);
    setStatus('Final reveal');
    setRunning(false);
  };

  return (
    <section style={{ padding: '5rem 5%', background: 'linear-gradient(180deg, #fff, #fff6f6)' }}>
      <div
        ref={shareCardRef}
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          borderRadius: isMobile ? '1.4rem' : '2rem',
          border: `1px solid ${theme?.glassBorder || '#f3d6d6'}`,
          background: theme?.inputBg || '#fff',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: isMobile ? '1.15rem 1rem 0.85rem' : '1.5rem 1.5rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: '#fb7185', marginBottom: '0.35rem' }}>
            PARTY MINI GAME
          </div>
          <h2 style={{ margin: 0, fontSize: isMobile ? '1.7rem' : '2rem', fontWeight: 900, color: theme?.text || '#111827' }}>
            FLAMES Game
          </h2>
        </div>

        <div style={{ padding: isMobile ? '0.85rem 1rem 1rem' : '1rem 1.5rem 1.5rem' }}>
          <form onSubmit={handleReveal} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto', gap: '0.7rem' }}>
            <input aria-label="First name for FLAMES" value={nameA} onChange={(e) => setNameA(e.target.value)} placeholder="First name" style={{ padding: '0.9rem 1rem', borderRadius: '0.8rem', border: `1px solid ${theme?.glassBorder || '#f1d4d4'}` }} />
            <input aria-label="Second name for FLAMES" value={nameB} onChange={(e) => setNameB(e.target.value)} placeholder="Second name" style={{ padding: '0.9rem 1rem', borderRadius: '0.8rem', border: `1px solid ${theme?.glassBorder || '#f1d4d4'}` }} />
            <button type="submit" disabled={running} style={{ padding: '0.9rem 1.15rem', borderRadius: '0.8rem', border: 'none', background: running ? '#fb7185' : (theme?.primary || '#f43f5e'), color: '#fff', fontWeight: 800, cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>
              {running ? 'Revealing...' : 'Reveal'}
            </button>
          </form>
          {error && (
            <div role="alert" style={{ marginTop: '0.6rem', color: '#b91c1c', fontWeight: 700 }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: '0.85rem', padding: '0.75rem 0.9rem', borderRadius: '0.7rem', background: '#fff1f2', color: '#9f1239', fontWeight: 700 }}>
            {status}
          </div>

          {cutData && (
            <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '0.75rem' }}>
              <div style={{ border: '1px solid #f8e4e4', borderRadius: '0.9rem', padding: '0.8rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '0.4rem' }}>LETTER CUTTING</div>
                <div style={{ marginBottom: '0.4rem', wordBreak: 'break-word' }}>
                  {cutData.a.map((x) => (
                    <motion.span
                      key={`a-${x.i}`}
                      initial={{ opacity: 1 }}
                      animate={cutPhase && x.cut ? { opacity: 0.35 } : { opacity: 1 }}
                      transition={{ duration: 0.5, delay: x.i * 0.12 }}
                      style={{
                        marginRight: '0.22rem',
                        fontWeight: 800,
                        textDecoration: cutPhase && x.cut ? 'line-through' : 'none',
                        textDecorationColor: '#ef4444',
                        textDecorationThickness: '2px',
                      }}
                    >
                      {x.char.toUpperCase()}
                    </motion.span>
                  ))}
                </div>
                <div style={{ wordBreak: 'break-word' }}>
                  {cutData.b.map((x) => (
                    <motion.span
                      key={`b-${x.i}`}
                      initial={{ opacity: 1 }}
                      animate={cutPhase && x.cut ? { opacity: 0.35 } : { opacity: 1 }}
                      transition={{ duration: 0.5, delay: x.i * 0.12 + 0.25 }}
                      style={{
                        marginRight: '0.22rem',
                        fontWeight: 800,
                        textDecoration: cutPhase && x.cut ? 'line-through' : 'none',
                        textDecorationColor: '#ef4444',
                        textDecorationThickness: '2px',
                      }}
                    >
                      {x.char.toUpperCase()}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div style={{ border: '1px solid #f8e4e4', borderRadius: '0.9rem', padding: '0.8rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '0.4rem' }}>ELIMINATION BOARD</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {board.map((item) => {
                    const gone = eliminated.includes(item);
                    const hot = activeRemoval === item;
                    const meta = FLAMES.find((x) => x.key === item);
                    return (
                      <motion.div
                        key={item}
                        animate={{ scale: hot ? 1.15 : 1, opacity: gone ? 0.25 : 1 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '999px',
                          border: `1px solid ${gone ? '#e5e7eb' : meta.tone}`,
                          color: gone ? '#9ca3af' : meta.tone,
                          textDecoration: gone ? 'line-through' : 'none',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 900,
                          background: hot ? `${meta.tone}22` : '#fff',
                        }}
                      >
                        {item}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{ marginTop: '0.9rem', padding: '1rem', borderRadius: '0.9rem', background: '#fff1f2', border: '1px solid #fecdd3' }}
              >
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 800, color: '#9f1239' }}>FINAL RESULT</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#be123c' }}>
                  {result.key} - {result.label}
                </div>
                <div
                  data-capture-exclude="true"
                  style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row', gap: '0.55rem' }}
                >
                  <button
                    type="button"
                    aria-label="Share FLAMES result to WhatsApp"
                    onClick={handleWhatsAppShare}
                    disabled={shareBusy}
                    style={{ padding: '0.5rem 0.8rem', borderRadius: '0.55rem', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto', opacity: shareBusy ? 0.8 : 1 }}
                  >
                    Share to WhatsApp
                  </button>
                  <button
                    type="button"
                    aria-label="Open native share for FLAMES result"
                    onClick={handleNativeShare}
                    disabled={shareBusy}
                    style={{ padding: '0.5rem 0.8rem', borderRadius: '0.55rem', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto', opacity: shareBusy ? 0.8 : 1 }}
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    aria-label="Download FLAMES result image"
                    onClick={handleDownload}
                    disabled={shareBusy}
                    style={{ padding: '0.5rem 0.8rem', borderRadius: '0.55rem', border: '1px solid #fda4af', background: '#fff', color: '#9f1239', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto', opacity: shareBusy ? 0.8 : 1 }}
                  >
                    Download Image
                  </button>
                  <button
                    type="button"
                    aria-label="Reset and start a new FLAMES game"
                    onClick={resetGameState}
                    disabled={running}
                    style={{ padding: '0.5rem 0.8rem', borderRadius: '0.55rem', border: '1px solid #d1d5db', background: '#fff', color: '#334155', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}
                  >
                    Reset
                  </button>
                </div>
                {shareHint && (
                  <div role="status" style={{ marginTop: '0.55rem', color: '#7f1d1d', fontWeight: 600, fontSize: '0.9rem' }}>
                    {shareHint}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FlamesGame;

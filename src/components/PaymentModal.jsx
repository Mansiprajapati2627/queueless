import React, { useState, useEffect, useRef } from 'react';
import { X, Wallet, CheckCircle, XCircle, Clock, Copy, RefreshCw } from 'lucide-react';

// ─── helpers ────────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const genTxnId = (prefix = 'UPI') =>
  `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

// Merchant UPI handle — change to yours
const MERCHANT_UPI = 'queueless@ybl';
const MERCHANT_NAME = 'QueueLess Canteen';

// ─── UPI apps ────────────────────────────────────────────────────────────────
const UPI_APPS = [
  {
    id: 'gpay',
    name: 'Google Pay',
    color: '#4285F4',
    svg: (
      <svg viewBox="0 0 48 48" width="32" height="32">
        <path fill="#4285F4" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.6 0 6.6 5.5 2.7 13.5l7.8 6.1C12.4 13.2 17.7 9.5 24 9.5z"/>
        <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
        <path fill="#FBBC05" d="M10.5 28.4A14.8 14.8 0 0 1 9.5 24c0-1.5.3-3 .8-4.4l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-6.3z"/>
        <path fill="#EA4335" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.3-7.7 2.3-6.3 0-11.6-3.7-13.5-9.1l-7.8 6.1C6.6 42.5 14.6 48 24 48z"/>
      </svg>
    ),
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    color: '#5f259f',
    svg: (
      <svg viewBox="0 0 48 48" width="32" height="32">
        <rect width="48" height="48" rx="12" fill="#5f259f"/>
        <text x="24" y="32" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">Pe</text>
      </svg>
    ),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    color: '#00B9F1',
    svg: (
      <svg viewBox="0 0 48 48" width="32" height="32">
        <rect width="48" height="48" rx="12" fill="#00B9F1"/>
        <text x="24" y="30" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">PAYTM</text>
      </svg>
    ),
  },
  {
    id: 'bhim',
    name: 'BHIM',
    color: '#00529C',
    svg: (
      <svg viewBox="0 0 48 48" width="32" height="32">
        <rect width="48" height="48" rx="12" fill="#00529C"/>
        <text x="24" y="30" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">BHIM</text>
      </svg>
    ),
  },
];

// ─── sub-components ──────────────────────────────────────────────────────────

/** Animated QR code using the free qrserver.com API */
const QRBlock = ({ upiString, amount }) => {
  const [copied, setCopied] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiString)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={styles.qrBlock}>
      <div style={styles.qrFrame}>
        <img src={qrUrl} alt="UPI QR Code" style={styles.qrImg} />
        <div style={styles.qrCorner('tl')} />
        <div style={styles.qrCorner('tr')} />
        <div style={styles.qrCorner('bl')} />
        <div style={styles.qrCorner('br')} />
      </div>
      <p style={styles.qrCaption}>Scan with any UPI app</p>
      <div style={styles.upiIdRow}>
        <span style={styles.upiIdText}>{MERCHANT_UPI}</span>
        <button style={styles.copyBtn} onClick={handleCopy}>
          {copied ? <CheckCircle size={14} color="#22c55e" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

/** Countdown ring */
const CountdownRing = ({ seconds, total }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const progress = (seconds / total) * circ;
  const color = seconds <= 10 ? '#ef4444' : seconds <= 20 ? '#f59e0b' : '#6366f1';

  return (
    <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle
        cx="32" cy="32" r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={`${progress} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
      />
      <text
        x="32" y="36"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={color}
        style={{ transform: 'rotate(90deg)', transformOrigin: '32px 32px' }}
      >
        {seconds}s
      </text>
    </svg>
  );
};

/** UPI App button */
const AppBtn = ({ app, onClick, disabled }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onClick(app)}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.appBtn,
        borderColor: hovered ? app.color : '#e2e8f0',
        background: hovered ? `${app.color}10` : '#fff',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 4px 12px ${app.color}30` : 'none',
      }}
    >
      {app.svg}
      <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginTop: 4 }}>{app.name}</span>
    </button>
  );
};

// ─── Payment states ──────────────────────────────────────────────────────────
// 'idle' → 'processing' → 'success' | 'failed'

const COUNTDOWN_SECS = 30;

const PaymentModal = ({ isOpen, onClose, onConfirm, total, paymentMethod }) => {
  // UPI tabs: 'apps' | 'qr' | 'id'
  const [upiTab, setUpiTab] = useState('apps');
  const [manualUpiId, setManualUpiId] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [payState, setPayState] = useState('idle'); // idle | processing | success | failed
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const [txnId, setTxnId] = useState('');
  const [failReason, setFailReason] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('');

  const timerRef = useRef(null);

  // Reset on close/open
  useEffect(() => {
    if (!isOpen) {
      clearInterval(timerRef.current);
      setPayState('idle');
      setSelectedApp(null);
      setManualUpiId('');
      setCardNumber('');
      setCardType('');
      setCountdown(COUNTDOWN_SECS);
      setTxnId('');
    }
  }, [isOpen]);

  // Countdown while processing
  useEffect(() => {
    if (payState === 'processing') {
      setCountdown(COUNTDOWN_SECS);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            simulateResult();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [payState]);

  const simulateResult = () => {
    // 90% success rate for demo
    const success = Math.random() > 0.1;
    const id = genTxnId();
    setTxnId(id);
    if (success) {
      setPayState('success');
    } else {
      setFailReason('Payment declined by bank. Please try again.');
      setPayState('failed');
    }
  };

  const startProcessing = (app = null) => {
    setSelectedApp(app);
    setPayState('processing');
  };

  const handleAppPay = (app) => startProcessing(app);

  const handleManualPay = () => {
    if (!manualUpiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. name@bank)');
      return;
    }
    startProcessing(null);
  };

  const handleCardPay = () => {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length !== 16) {
      alert('Please enter a valid 16-digit card number');
      return;
    }
    startProcessing(null);
  };

  const handleCashPay = () => {
    onConfirm('Cash', {});
    onClose();
  };

  const handleConfirmSuccess = () => {
    onConfirm(paymentMethod, { transactionId: txnId });
    onClose();
  };

  const handleRetry = () => {
    setPayState('idle');
    setSelectedApp(null);
    setCountdown(COUNTDOWN_SECS);
  };

  const detectCardType = (number) => {
    const d = number.replace(/\D/g, '');
    if (d.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(d)) return 'Mastercard';
    if (/^3[47]/.test(d)) return 'Amex';
    if (/^6(?:011|5)/.test(d)) return 'Discover';
    return '';
  };

  const handleCardInput = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(digits.replace(/(\d{4})(?=\d)/g, '$1 '));
    setCardType(detectCardType(digits));
  };

  const upiString = `upi://pay?pa=${MERCHANT_UPI}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total}&cu=INR&tn=QueueLess%20Order`;

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Complete Payment</h2>
            <p style={styles.subtitle}>
              {formatCurrency(total)} · {paymentMethod}
            </p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          {/* ── SUCCESS ── */}
          {payState === 'success' && (
            <div style={styles.stateBox}>
              <div style={styles.successIcon}>
                <CheckCircle size={52} color="#22c55e" />
              </div>
              <h3 style={{ ...styles.stateTitle, color: '#15803d' }}>Payment Successful!</h3>
              <p style={styles.stateMsg}>Your order has been placed.</p>
              <div style={styles.txnBox}>
                <span style={styles.txnLabel}>Transaction ID</span>
                <span style={styles.txnId}>{txnId}</span>
              </div>
              <button style={styles.primaryBtn} onClick={handleConfirmSuccess}>
                View Order Status
              </button>
            </div>
          )}

          {/* ── FAILED ── */}
          {payState === 'failed' && (
            <div style={styles.stateBox}>
              <XCircle size={52} color="#ef4444" />
              <h3 style={{ ...styles.stateTitle, color: '#b91c1c' }}>Payment Failed</h3>
              <p style={styles.stateMsg}>{failReason}</p>
              <button style={{ ...styles.primaryBtn, background: '#6366f1' }} onClick={handleRetry}>
                <RefreshCw size={16} /> Try Again
              </button>
            </div>
          )}

          {/* ── PROCESSING ── */}
          {payState === 'processing' && (
            <div style={styles.stateBox}>
              <CountdownRing seconds={countdown} total={COUNTDOWN_SECS} />
              <h3 style={{ ...styles.stateTitle, color: '#4338ca' }}>
                {selectedApp ? `Waiting for ${selectedApp.name}…` : 'Processing Payment…'}
              </h3>
              <p style={styles.stateMsg}>
                {paymentMethod === 'UPI'
                  ? selectedApp
                    ? `Open ${selectedApp.name} and approve ₹${total.toFixed(2)}`
                    : 'Verifying your UPI ID and initiating transfer…'
                  : 'Contacting your bank…'}
              </p>
              <div style={styles.processingDots}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p style={styles.dontClose}>Do not close this window</p>
            </div>
          )}

          {/* ── IDLE: UPI ── */}
          {payState === 'idle' && paymentMethod === 'UPI' && (
            <div>
              {/* Tab bar */}
              <div style={styles.tabBar}>
                {['apps', 'qr', 'id'].map(tab => (
                  <button
                    key={tab}
                    style={{ ...styles.tab, ...(upiTab === tab ? styles.tabActive : {}) }}
                    onClick={() => setUpiTab(tab)}
                  >
                    {tab === 'apps' ? '📱 Apps' : tab === 'qr' ? '⬛ QR Code' : '🔗 UPI ID'}
                  </button>
                ))}
              </div>

              {/* Apps tab */}
              {upiTab === 'apps' && (
                <div>
                  <p style={styles.instruction}>Choose your UPI app to pay {formatCurrency(total)}:</p>
                  <div style={styles.appsGrid}>
                    {UPI_APPS.map(app => (
                      <AppBtn key={app.id} app={app} onClick={handleAppPay} disabled={false} />
                    ))}
                  </div>
                  <p style={styles.demoNote}>
                    🔵 Demo mode — no real money will be charged
                  </p>
                </div>
              )}

              {/* QR tab */}
              {upiTab === 'qr' && (
                <div>
                  <p style={styles.instruction}>Scan to pay {formatCurrency(total)}:</p>
                  <QRBlock upiString={upiString} amount={total} />
                  <button style={{ ...styles.primaryBtn, marginTop: 16 }} onClick={() => startProcessing(null)}>
                    I've Paid — Confirm
                  </button>
                  <p style={styles.demoNote}>🔵 Demo mode — tap confirm after "scanning"</p>
                </div>
              )}

              {/* Manual ID tab */}
              {upiTab === 'id' && (
                <div>
                  <p style={styles.instruction}>Enter your UPI ID:</p>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="yourname@okhdfcbank"
                    value={manualUpiId}
                    onChange={e => setManualUpiId(e.target.value)}
                  />
                  {manualUpiId && (
                    <p style={styles.upiHint}>
                      Paying to: <strong>{MERCHANT_UPI}</strong>
                    </p>
                  )}
                  <button
                    style={{ ...styles.primaryBtn, opacity: manualUpiId ? 1 : 0.5 }}
                    onClick={handleManualPay}
                    disabled={!manualUpiId}
                  >
                    Pay {formatCurrency(total)}
                  </button>
                  <p style={styles.demoNote}>🔵 Demo mode — no real payment</p>
                </div>
              )}
            </div>
          )}

          {/* ── IDLE: Card ── */}
          {payState === 'idle' && paymentMethod === 'Card' && (
            <div>
              <p style={styles.instruction}>Enter your card details:</p>
              <label style={styles.label}>Card Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardInput}
                />
                {cardType && (
                  <span style={styles.cardTypeBadge}>{cardType}</span>
                )}
              </div>
              <div style={styles.cardRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Expiry</label>
                  <input style={styles.input} type="text" placeholder="MM/YY" maxLength={5} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>CVV</label>
                  <input style={styles.input} type="password" placeholder="•••" maxLength={4} />
                </div>
              </div>
              <button style={styles.primaryBtn} onClick={handleCardPay}>
                Pay {formatCurrency(total)}
              </button>
              <p style={styles.demoNote}>🔵 Demo mode — enter any card number</p>
            </div>
          )}

          {/* ── IDLE: Cash ── */}
          {payState === 'idle' && paymentMethod === 'Cash' && (
            <div style={styles.stateBox}>
              <Wallet size={52} color="#6366f1" />
              <h3 style={styles.stateTitle}>Pay at Counter</h3>
              <p style={styles.stateMsg}>
                Show this order to the cashier and pay <strong>{formatCurrency(total)}</strong> in cash.
              </p>
              <button style={styles.primaryBtn} onClick={handleCashPay}>
                Confirm Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* dot animation keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(15,15,35,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16,
  },
  modal: {
    background: '#fff',
    borderRadius: 20,
    width: '100%', maxWidth: 420,
    boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '20px 24px 16px',
    borderBottom: '1px solid #f1f5f9',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  subtitle: { margin: '4px 0 0', fontSize: 13, opacity: 0.85 },
  closeBtn: {
    background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8,
    padding: 6, cursor: 'pointer', color: '#fff', display: 'flex',
  },
  body: { padding: '20px 24px 24px' },

  // Tabs
  tabBar: { display: 'flex', gap: 4, marginBottom: 20, background: '#f8fafc', borderRadius: 10, padding: 4 },
  tab: {
    flex: 1, padding: '8px 4px', fontSize: 12, fontWeight: 600,
    border: 'none', borderRadius: 8, cursor: 'pointer',
    background: 'transparent', color: '#64748b', transition: 'all 0.2s',
  },
  tabActive: { background: '#fff', color: '#6366f1', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },

  instruction: { fontSize: 13, color: '#64748b', marginBottom: 16, marginTop: 0 },

  // Apps grid
  appsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 },
  appBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '12px 8px', borderRadius: 12, border: '2px solid #e2e8f0',
    cursor: 'pointer', transition: 'all 0.2s', background: '#fff',
  },

  // QR
  qrBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  qrFrame: { position: 'relative', padding: 8 },
  qrImg: { display: 'block', borderRadius: 8, border: '1px solid #e2e8f0' },
  qrCorner: (pos) => {
    const base = {
      position: 'absolute', width: 12, height: 12,
      borderColor: '#6366f1', borderStyle: 'solid',
    };
    const corners = {
      tl: { top: 0, left: 0, borderWidth: '3px 0 0 3px', borderRadius: '4px 0 0 0' },
      tr: { top: 0, right: 0, borderWidth: '3px 3px 0 0', borderRadius: '0 4px 0 0' },
      bl: { bottom: 0, left: 0, borderWidth: '0 0 3px 3px', borderRadius: '0 0 0 4px' },
      br: { bottom: 0, right: 0, borderWidth: '0 3px 3px 0', borderRadius: '0 0 4px 0' },
    };
    return { ...base, ...corners[pos] };
  },
  qrCaption: { fontSize: 12, color: '#64748b', margin: 0 },
  upiIdRow: { display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '6px 12px', borderRadius: 8 },
  upiIdText: { fontSize: 13, color: '#374151', fontFamily: 'monospace' },
  copyBtn: {
    display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6366f1',
    background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
    borderRadius: 6, fontWeight: 600,
  },

  // Inputs
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
    border: '2px solid #e2e8f0', outline: 'none', boxSizing: 'border-box',
    marginBottom: 12, fontFamily: 'inherit', transition: 'border-color 0.2s',
  },
  label: { fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 },
  cardRow: { display: 'flex', gap: 12 },
  cardTypeBadge: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-100%)',
    fontSize: 11, fontWeight: 700, color: '#6366f1', background: '#eef2ff',
    padding: '2px 6px', borderRadius: 4,
  },
  upiHint: { fontSize: 12, color: '#64748b', marginBottom: 12 },

  // Primary button
  primaryBtn: {
    width: '100%', padding: '12px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'opacity 0.2s, transform 0.1s',
    marginTop: 4,
  },

  // State screens
  stateBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 12, textAlign: 'center', padding: '8px 0',
  },
  stateTitle: { margin: 0, fontSize: 20, fontWeight: 700 },
  stateMsg: { margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.5 },
  txnBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
    padding: '10px 16px', width: '100%',
  },
  txnLabel: { display: 'block', fontSize: 11, color: '#16a34a', fontWeight: 600, marginBottom: 2 },
  txnId: { fontSize: 13, fontFamily: 'monospace', color: '#15803d', wordBreak: 'break-all' },
  successIcon: { animation: 'none' },

  // Processing dots
  processingDots: { display: 'flex', gap: 6, marginTop: 4 },
  dot: {
    width: 8, height: 8, borderRadius: '50%', background: '#6366f1',
    animation: 'bounce 1.2s infinite',
    display: 'inline-block',
  },
  dontClose: { fontSize: 12, color: '#94a3b8', margin: 0 },

  // Demo note
  demoNote: {
    fontSize: 11, color: '#94a3b8', textAlign: 'center',
    marginTop: 8, marginBottom: 0,
  },
};

export default PaymentModal;
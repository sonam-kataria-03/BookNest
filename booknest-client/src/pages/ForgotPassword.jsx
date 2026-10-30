import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiMail, FiKey, FiLock, FiCheckCircle, FiArrowLeft, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api, { errMsg } from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Wizard steps: 1 = Email, 2 = Verify OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputRefs = useRef([]);

  // Handle resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus the first OTP box when entering Step 2
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 120);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      return toast.error('Please enter your email address.');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      toast.success(res.data.message || 'OTP verification code sent to your email!');
      setStep(2);
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP input changes (Strictly Numeric Only)
  const handleOtpChange = (index, e) => {
    // Strip everything that is not a numeric digit [0-9]
    const rawVal = e.target.value;
    const numericVal = rawVal.replace(/\D/g, '');

    if (!numericVal) {
      const nextOtp = [...otp];
      nextOtp[index] = '';
      setOtp(nextOtp);
      return;
    }

    // Take the last entered numeric digit
    const singleDigit = numericVal.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = singleDigit;
    setOtp(nextOtp);

    // Auto-focus next input box if a digit was entered
    if (index < 5 && singleDigit) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Step 2: Keydown restrictions - strictly prevent non-numeric keys
  const handleOtpKeyDown = (index, e) => {
    const isControlKey = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
      'Home',
      'End',
    ].includes(e.key) || e.ctrlKey || e.metaKey;

    // Allow backspace to jump to previous box if current box is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
      return;
    }

    // If key is not numeric (0-9) and not an allowed control key, immediately reject
    if (!/^[0-9]$/.test(e.key) && !isControlKey) {
      e.preventDefault();
    }
  };

  // Step 2: Handle Paste for OTP (Strictly Numeric Only, up to 6 digits)
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    // Extract only digits
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 6);

    if (!digitsOnly) return;

    const nextOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      nextOtp[i] = digitsOnly[i] || '';
    }
    setOtp(nextOtp);

    // Focus either the next empty input or the last one
    const focusIndex = Math.min(digitsOnly.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('').trim();

    if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
      return toast.error('Please enter all 6 numeric digits of your verification code.');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: fullOtp,
      });

      toast.success(res.data.message || 'OTP verified successfully!');
      setResetToken(res.data.resetToken);
      // Allowed to proceed to Step 3
      setStep(3);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match. Please re-enter.');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        resetToken,
        newPassword,
      });

      toast.success(res.data.message || 'Password updated successfully!');
      setStep(4);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="panel" style={{ width: 'min(480px, 92%)' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="logo-badge" style={{ width: 44, height: 44, margin: '0 auto 12px', fontSize: '1.3rem' }}>
            <FiBookOpen />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem' }}>
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Verify Code'}
            {step === 3 && 'New Password'}
            {step === 4 && 'Password Updated'}
          </h1>
          <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>
            {step === 1 && 'Enter your registered email to receive a 6-digit OTP code.'}
            {step === 2 && (
              <>
                Enter the 6-digit verification code sent to{' '}
                <strong style={{ color: 'var(--forest-800)' }}>{email}</strong>
              </>
            )}
            {step === 3 && 'Verification complete. Choose a new secure password.'}
            {step === 4 && 'Your password has been changed. You can now log into BookNest.'}
          </p>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginBottom: 24,
            }}
          >
            {[
              { num: 1, label: 'Email' },
              { num: 2, label: 'Verify OTP' },
              { num: 3, label: 'New Password' },
            ].map((s, idx) => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className={`step-pill ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                    <span className="step-pill-badge">{isDone ? '✓' : s.num}</span>
                    <span>{s.label}</span>
                  </div>
                  {idx < 2 && <div className={`step-line ${step > s.num ? 'done' : ''}`} />}
                </div>
              );
            })}
          </div>
        )}

        {/* ================= STEP 1: Email Form ================= */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label className="field">
              <span>Email Address</span>
              <input
                type="email"
                required
                placeholder="reader@booknest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </label>

            <button
              type="submit"
              className="btn gold"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 10 }}
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spin" style={{ marginRight: 6 }} /> Sending Verification Code…
                </>
              ) : (
                'Send Verification Code'
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.92rem' }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--forest-700)',
                  fontWeight: 600,
                }}
              >
                <FiArrowLeft /> Back to Log In
              </Link>
            </div>
          </form>
        )}

        {/* ================= STEP 2: Verify OTP Form ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Enter 6-Digit Code
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--forest-700)', fontWeight: 700, background: 'var(--forest-50)', padding: '2px 8px', borderRadius: 4 }}>
                  Numeric digits only
                </span>
              </div>

              {/* 6 Individual Numeric Digits Boxes */}
              <div className="otp-box-grid" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    disabled={loading}
                    className={`otp-box-input ${digit ? 'filled' : ''}`}
                  />
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  marginTop: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textDecoration: 'underline',
                  }}
                >
                  Change email
                </button>

                <div>
                  {resendCooldown > 0 ? (
                    <span className="muted" style={{ fontSize: '0.82rem' }}>
                      Resend in <strong>{resendCooldown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp(null)}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--forest-700)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <FiRefreshCw size={13} /> Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn gold"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 12 }}
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spin" style={{ marginRight: 6 }} /> Verifying OTP…
                </>
              ) : (
                'Verify OTP & Proceed'
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.92rem' }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--forest-700)',
                  fontWeight: 600,
                }}
              >
                <FiArrowLeft /> Back to Log In
              </Link>
            </div>
          </form>
        )}

        {/* ================= STEP 3: Set New Password Form ================= */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div
              style={{
                background: 'var(--forest-50)',
                border: '1px solid var(--forest-100)',
                borderRadius: 'var(--r-sm)',
                padding: '12px 16px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: 'var(--forest-800)',
                fontSize: '0.88rem',
              }}
            >
              <FiCheckCircle style={{ color: 'var(--ok)', flexShrink: 0, fontSize: '1.2rem' }} />
              <div>
                <strong>OTP Verified!</strong> You can now choose a new password for your account.
              </div>
            </div>

            <label className="field">
              <span>New Password</span>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  autoFocus
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4,
                  }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </label>

            <label className="field">
              <span>Confirm New Password</span>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4,
                  }}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </label>

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="err" style={{ marginTop: -12, marginBottom: 16 }}>
                Passwords do not match.
              </p>
            )}

            <button
              type="submit"
              className="btn gold"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 10 }}
              disabled={loading || !newPassword || newPassword.length < 6 || newPassword !== confirmPassword}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spin" style={{ marginRight: 6 }} /> Resetting Password…
                </>
              ) : (
                'Save New Password & Finish'
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 4: Success Message ================= */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 18px',
                borderRadius: '50%',
                background: 'var(--ok-light)',
                color: 'var(--ok)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '2rem',
              }}
            >
              <FiCheckCircle />
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Password Successfully Reset!</h2>
            <p className="muted" style={{ fontSize: '0.94rem', marginBottom: 28, lineHeight: 1.6 }}>
              Your credentials have been securely updated. You may now log in to BookNest with your new password.
            </p>

            <button
              type="button"
              className="btn gold"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={() => navigate('/login')}
            >
              Proceed to Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

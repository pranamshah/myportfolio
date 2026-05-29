import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Anchor } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-surface-deep flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/4 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: "linear-gradient(#C9A452 1px, transparent 1px), linear-gradient(90deg, #C9A452 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-9 h-9 border border-gold/40 rounded flex items-center justify-center">
            <Anchor size={15} className="text-gold" />
          </div>
          <span className="font-display text-xl font-light text-ink">
            Navkar <span className="text-gold">Impex</span>
          </span>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-gold/8 border border-gold/20 flex items-center
                        justify-center mx-auto mb-6">
          <Mail size={26} className="text-gold" />
        </div>

        <h1 className="font-display text-3xl font-light text-ink text-center mb-2">
          Forgot Password?
        </h1>
        <div className="gold-line max-w-[100px] mx-auto mb-4" />

        <div className="card-luxury p-8 mb-6 text-center">
          <p className="text-ink-secondary text-sm leading-relaxed mb-6">
            To reset your password, please contact our admin team. We&apos;ll verify your account and send you a new password within 24 hours.
          </p>

          <div className="bg-surface-hover/50 rounded-lg p-5 text-left space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-ink-muted mb-3">Contact Admin</p>
            <a href="mailto:admin@navkarimpex.com"
              className="flex items-center gap-3 text-sm group">
              <div className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-gold" />
              </div>
              <span className="text-gold group-hover:text-gold-light transition-colors">
                admin@navkarimpex.com
              </span>
            </a>
            <p className="text-xs text-ink-muted pt-2 pl-11">
              Please include your registered email address so we can identify your account.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/login"
            className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink
                       transition-colors">
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

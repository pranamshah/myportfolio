import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-7 h-7 rounded bg-[#C9A452] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l5-10 4 6 3-4 4 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold text-gray-900">Navkar Impex</span>
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-[#C9A452]/10 border border-[#C9A452]/20 flex items-center
                        justify-center mx-auto mb-5">
          <Mail size={22} className="text-[#C9A452]" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <div className="w-10 h-px bg-[#C9A452] mx-auto mb-5" />

        <div className="bg-white border border-gray-200 rounded-xl p-7 mb-6 text-left">
          <p className="text-sm text-gray-500 leading-relaxed mb-5 text-center">
            To reset your password, contact our team. We&apos;ll verify your account and send a new password within 24 hours.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Contact Us</p>
            <a href="mailto:admin@navkarimpex.com"
              className="flex items-center gap-3 text-sm group">
              <div className="w-8 h-8 rounded-lg bg-[#C9A452]/10 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-[#C9A452]" />
              </div>
              <span className="text-[#C9A452] group-hover:underline font-medium">admin@navkarimpex.com</span>
            </a>
            <p className="text-xs text-gray-400 pl-11">
              Include your registered email so we can find your account.
            </p>
          </div>
        </div>

        <Link href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

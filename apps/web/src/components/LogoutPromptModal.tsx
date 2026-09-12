import type { User } from '@sih/shared-types';
import { getUniversitySubRole } from '../utils/portalRouting.js';

interface LogoutPromptModalProps {
  isOpen: boolean;
  user: User;
  onStay: () => void;
  onLogout: () => void;
}

export function LogoutPromptModal({ isOpen, user, onStay, onLogout }: LogoutPromptModalProps) {
  if (!isOpen) return null;

  const univSub = user.role === 'university' ? getUniversitySubRole(user) : null;
  const portalName =
    user.role === 'university'
      ? univSub === 'student'
        ? 'Student Innovator Dashboard (छात्र डेस्क)'
        : univSub === 'mentor'
          ? 'Faculty Mentor Workspace (मेंटर डेस्क)'
          : 'University Admin & Dean Desk (विश्वविद्यालय डेस्क)'
      : user.role === 'admin'
        ? 'Government Admin Portal (प्रशासनिक पोर्टल)'
        : user.role === 'industry'
          ? 'Industry & CSR Portal (उद्योग एवं सीएसआर)'
          : 'Citizen Grievance Portal (नागरिक पोर्टल)';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-prompt-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4"
    >
      <div className="bg-white border-2 border-urgent rounded-[2px] p-6 sm:p-7 max-w-lg w-full shadow-2xl relative">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-border pb-3 mb-4">
          <span className="text-[11px] font-mono text-urgent uppercase font-bold tracking-wider flex items-center gap-1">
            <span>🛡️</span>
            <span>ACTIVE SESSION PROTECTION / सत्र सुरक्षा</span>
          </span>
          <span className="text-[10px] font-mono bg-urgent/10 text-urgent border border-urgent/30 px-2 py-0.5 rounded-[2px] font-bold uppercase">
            BACK NAVIGATION BLOCKED
          </span>
        </div>

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-full bg-urgent/10 border border-urgent/30 flex items-center justify-center text-urgent shrink-0 text-xl font-bold">
            🚪
          </div>
          <div>
            <h2 id="logout-prompt-title" className="font-display text-lg sm:text-xl font-bold text-navy leading-tight">
              Logout Required / लॉग आउट आवश्यक
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              You cannot navigate back to the home page or previous pages while signed in.
            </p>
          </div>
        </div>

        {/* User & Portal Details Card */}
        <div className="bg-paper border border-border rounded-[2px] p-3.5 mb-5 text-xs space-y-1.5 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted uppercase tracking-wider text-[10px] font-mono font-bold">Signed In As:</span>
            <span className="font-bold text-navy">{user.full_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-muted uppercase tracking-wider text-[10px] font-mono font-bold">Current Portal:</span>
            <span className="font-bold text-forest">{portalName}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px] font-mono text-ink-muted">
            <span>Email: {user.email}</span>
            <span className="uppercase font-semibold text-turmeric-deep">Role: {user.role}</span>
          </div>
        </div>

        {/* Explanatory Note */}
        <div className="p-3 bg-turmeric/15 border border-turmeric-deep/30 rounded-[2px] mb-5 text-xs text-ink leading-relaxed">
          <span className="font-bold text-navy">⚠️ Notice:</span> Back button navigation is disabled to protect your active portal session. To return to the home dashboard or switch portals, please log out first.
          <div className="text-[11px] text-ink-muted mt-1 font-sans">
            सक्रिय सत्र की सुरक्षा के लिए बैक बटन अक्षम है। मुख्य पोर्टल पर लौटने के लिए कृपया लॉग आउट करें।
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onStay}
            className="w-full sm:w-auto px-4 py-2.5 bg-navy text-white text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-navy-deep transition-colors text-center cursor-pointer shadow-sm"
          >
            ← Stay on Dashboard / पोर्टल में बने रहें
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full sm:w-auto px-4 py-2.5 bg-urgent text-white text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-urgent/90 transition-colors text-center cursor-pointer shadow-sm"
          >
            🚪 Logout Now / लॉग आउट करें
          </button>
        </div>
      </div>
    </div>
  );
}

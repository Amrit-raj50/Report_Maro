import { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/Card.js';
import { Button } from '../../components/Button.js';
import { useAuthStore } from '../../store/authStore.js';
import type { IndustryCompanyProfile } from './types.js';
import { DEFAULT_COMPANY_PROFILE } from './types.js';

export default function Profile() {
  const authUser = useAuthStore((s) => s.user);

  const [profile, setProfile] = useState<IndustryCompanyProfile>(() => {
    const saved = localStorage.getItem('sih_industry_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      ...DEFAULT_COMPANY_PROFILE,
      companyName: authUser?.organization || DEFAULT_COMPANY_PROFILE.companyName,
      contactPerson: authUser?.full_name || DEFAULT_COMPANY_PROFILE.contactPerson,
      email: authUser?.email || DEFAULT_COMPANY_PROFILE.email,
      phone: authUser?.phone || DEFAULT_COMPANY_PROFILE.phone,
      district: authUser?.district || DEFAULT_COMPANY_PROFILE.district,
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sih_industry_profile', JSON.stringify(profile));
    setIsEditing(false);
    showToast('Company profile details saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 border border-navy bg-navy px-4 py-3 text-xs font-medium text-white shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-turmeric shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border pb-3">
        <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider block">
          Corporate Identity &amp; Compliance
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-0.5">
          <h1 className="font-display text-xl font-bold text-navy">
            Company Profile
          </h1>
          <Button
            variant={isEditing ? 'ghost' : 'secondary'}
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs py-1 px-3"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
        <p className="text-xs text-ink-muted mt-0.5">
          Registered corporate partner credentials empaneled under the Jharkhand State Civic Innovation Scheme.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border border-border bg-white p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center border-2 border-navy bg-paper rounded-[2px] shrink-0">
              <Building2 className="h-7 w-7 text-navy" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-navy">
                  {profile.companyName}
                </h2>
                <span className="border border-forest/30 bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>State Empaneled</span>
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">{profile.division}</p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-ink-muted mt-1">
                <span>CIN: {profile.cinNumber}</span>
                <span>•</span>
                <span>Sector: {profile.sector}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content / Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Company Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-navy mb-1">
                Company / Organization Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full border border-border bg-paper p-2 font-medium focus:border-navy focus:outline-none"
                />
              ) : (
                <p className="p-2 bg-paper border border-border/60 text-ink font-semibold">
                  {profile.companyName}
                </p>
              )}
            </div>

            {/* Corporate Sector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-navy mb-1">
                Industry Sector
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.sector}
                  onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
                  className="w-full border border-border bg-paper p-2 font-medium focus:border-navy focus:outline-none"
                />
              ) : (
                <p className="p-2 bg-paper border border-border/60 text-ink">
                  {profile.sector}
                </p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-navy mb-1">
                Liaison Officer / Contact Person
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.contactPerson}
                  onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                  className="w-full border border-border bg-paper p-2 font-medium focus:border-navy focus:outline-none"
                />
              ) : (
                <p className="p-2 bg-paper border border-border/60 text-ink font-semibold">
                  {profile.contactPerson}
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-navy mb-1">
                Designation
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.designation}
                  onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  className="w-full border border-border bg-paper p-2 font-medium focus:border-navy focus:outline-none"
                />
              ) : (
                <p className="p-2 bg-paper border border-border/60 text-ink">
                  {profile.designation}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-navy mb-1">
                Official Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full border border-border bg-paper p-2 font-mono focus:border-navy focus:outline-none"
                />
              ) : (
                <p className="p-2 bg-paper border border-border/60 text-ink font-mono flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-navy/70" />
                  <span>{profile.email}</span>
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-navy mb-1">
                Contact Phone
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full border border-border bg-paper p-2 font-mono focus:border-navy focus:outline-none"
                />
              ) : (
                <p className="p-2 bg-paper border border-border/60 text-ink font-mono flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-navy/70" />
                  <span>{profile.phone}</span>
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-navy mb-1">
                Registered Office Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full border border-border bg-paper p-2 focus:border-navy focus:outline-none"
                />
              ) : (
                <p className="p-2 bg-paper border border-border/60 text-ink flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-navy/70" />
                  <span>{profile.address}, {profile.district}</span>
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-navy mb-1">
                Corporate Website
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full border border-border bg-paper p-2 font-mono focus:border-navy focus:outline-none"
                />
              ) : (
                <p className="p-2 bg-paper border border-border/60 text-ink font-mono flex items-center gap-1.5 truncate">
                  <Globe className="h-3.5 w-3.5 text-navy/70" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-navy truncate"
                  >
                    {profile.website}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* CSR Focus Domains */}
          <div className="border-t border-border pt-4">
            <span className="block text-[11px] font-bold uppercase text-navy mb-2">
              Priority CSR Thematic Focus Areas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.focusDomains.map((dom) => (
                <span
                  key={dom}
                  className="border border-navy/30 bg-paper px-2.5 py-1 text-xs font-semibold text-navy rounded-[2px]"
                >
                  {dom}
                </span>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Profile Changes
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}

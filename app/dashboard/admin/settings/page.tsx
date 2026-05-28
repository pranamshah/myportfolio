import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Ship, Mail, Phone, Globe } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">Settings</h1>
        <p className="text-text-secondary mt-1">Company and account settings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-heading font-bold text-primary-deep mb-5">Company Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-neutral-light rounded-xl">
            <Ship className="w-5 h-5 text-accent-teal" />
            <div>
              <p className="text-xs text-text-secondary">Company Name</p>
              <p className="font-semibold text-primary-deep">Navkar Exim</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-neutral-light rounded-xl">
            <Globe className="w-5 h-5 text-accent-teal" />
            <div>
              <p className="text-xs text-text-secondary">Business Type</p>
              <p className="font-semibold text-primary-deep">Clearing & Forwarding Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-neutral-light rounded-xl">
            <Mail className="w-5 h-5 text-accent-teal" />
            <div>
              <p className="text-xs text-text-secondary">Admin Email</p>
              <p className="font-semibold text-primary-deep">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-neutral-light rounded-xl">
            <Phone className="w-5 h-5 text-accent-teal" />
            <div>
              <p className="text-xs text-text-secondary">WhatsApp</p>
              <p className="font-semibold text-primary-deep">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-heading font-bold text-primary-deep mb-4">Invoice Defaults</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">GST Registration</span>
            <span className="font-mono font-medium">33XXXXX1234Z1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">PAN</span>
            <span className="font-mono font-medium">XXXXX1234X</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Bank Name</span>
            <span className="font-medium">State Bank of India</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Service SAC Code</span>
            <span className="font-mono font-medium">996001</span>
          </div>
        </div>
        <p className="text-xs text-text-secondary mt-4">Update these in your .env file or database settings.</p>
      </div>
    </div>
  );
}

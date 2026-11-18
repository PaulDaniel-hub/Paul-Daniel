import { useEffect, useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import {
  buildPortfolioPrompt,
  type StudentProfile,
} from '../utils/promptBuilder';

interface PromptBlueprintModalProps {
  isOpen: boolean;
  profile: StudentProfile;
  onUpdateProfile: (next: StudentProfile) => void;
  onClose: () => void;
}

export function PromptBlueprintModal({
  isOpen,
  profile,
  onUpdateProfile,
  onClose,
}: PromptBlueprintModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const generatedPrompt = buildPortfolioPrompt(profile);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-medium text-blue-700">
              Google AI Studio Prompt Blueprint
            </p>
            <h3
              id="prompt-modal-title"
              className="mt-1 font-display text-xl font-semibold text-slate-900"
            >
              Clean, structured prompt for your portfolio
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close prompt blueprint"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <p className="text-xs leading-relaxed text-slate-600">
              Adjust your details below to update both the live portfolio preview and the ready-to-paste Google AI Studio prompt.
            </p>

            <div>
              <label
                htmlFor="profile-name-input"
                className="block text-xs font-medium text-slate-700"
              >
                Student Name
              </label>
              <input
                id="profile-name-input"
                type="text"
                value={profile.name}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, name: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label
                htmlFor="profile-university-input"
                className="block text-xs font-medium text-slate-700"
              >
                College / Department
              </label>
              <input
                id="profile-university-input"
                type="text"
                value={profile.university}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, university: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label
                htmlFor="profile-linkedin-input"
                className="block text-xs font-medium text-slate-700"
              >
                LinkedIn URL
              </label>
              <input
                id="profile-linkedin-input"
                type="url"
                value={profile.linkedinUrl}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, linkedinUrl: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label
                htmlFor="profile-github-input"
                className="block text-xs font-medium text-slate-700"
              >
                GitHub URL
              </label>
              <input
                id="profile-github-input"
                type="url"
                value={profile.githubUrl}
                onChange={(e) =>
                  onUpdateProfile({ ...profile, githubUrl: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>
          </div>

          <div className="flex flex-col lg:col-span-8">
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="generated-prompt-textarea"
                className="text-xs font-medium text-slate-700"
              >
                Structured Prompt (Ready for Google AI Studio)
              </label>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copy Clean Prompt
                  </>
                )}
              </button>
            </div>

            <textarea
              id="generated-prompt-textarea"
              readOnly
              value={generatedPrompt}
              rows={17}
              className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:border-blue-700 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

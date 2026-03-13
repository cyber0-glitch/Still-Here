import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [age, setAge] = useState('');
  const [radiusKm, setRadiusKm] = useState(25);

  // Step 2 - prompts
  const [promptNoPatience, setPromptNoPatience] = useState('');
  const [promptWantCompany, setPromptWantCompany] = useState('');
  const [promptBodyCanHandle, setPromptBodyCanHandle] = useState('');
  const [promptDontTalkLike, setPromptDontTalkLike] = useState('');
  const [promptBeforeIGo, setPromptBeforeIGo] = useState('');
  const [promptFreeform, setPromptFreeform] = useState('');

  // Step 3 - condition
  const [conditionSummary, setConditionSummary] = useState('');
  const [energyLevel, setEnergyLevel] = useState('varies');
  const [mobilityNotes, setMobilityNotes] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke old object URL to prevent memory leak
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleFinish = async () => {
    setError('');
    setLoading(true);
    try {
      // Upload avatar if selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await api('/users/me/avatar', {
          method: 'POST',
          body: formData,
        });
      }

      // Patch user profile
      const payload: Record<string, any> = {
        radiusKm,
        energyLevel,
      };
      if (age) payload.age = parseInt(age, 10);
      if (promptNoPatience) payload.promptNoPatience = promptNoPatience;
      if (promptWantCompany) payload.promptWantCompany = promptWantCompany;
      if (promptBodyCanHandle) payload.promptBodyCanHandle = promptBodyCanHandle;
      if (promptDontTalkLike) payload.promptDontTalkLike = promptDontTalkLike;
      if (promptBeforeIGo) payload.promptBeforeIGo = promptBeforeIGo;
      if (promptFreeform) payload.promptFreeform = promptFreeform;
      if (conditionSummary) payload.conditionSummary = conditionSummary;
      if (mobilityNotes) payload.mobilityNotes = mobilityNotes;

      await api('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      await refreshUser();
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const skip = () => {
    if (step === 3) {
      handleFinish();
    } else {
      next();
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-brand-amber' : 'bg-brand-mid/40'
              }`}
            />
          ))}
        </div>

        <div className="text-sm text-brand-muted mb-2">Step {step} of 3</div>

        {error && (
          <div className="bg-brand-coral/10 border border-brand-coral/30 text-brand-coral rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Avatar, age, radius */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-amber mb-2">
              Let's set you up
            </h2>
            <p className="text-brand-muted mb-8">
              None of this is required. Skip anything you want.
            </p>

            <div className="space-y-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm text-brand-muted mb-2">
                  Profile photo
                </label>
                <div className="flex items-center gap-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-brand-mid/40 flex items-center justify-center text-brand-muted text-sm">
                      Photo
                    </div>
                  )}
                  <label className="btn-ghost cursor-pointer text-sm">
                    Choose file
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm text-brand-muted mb-1.5">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  className="input-field w-32"
                  placeholder="Optional"
                  min={13}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              {/* Radius */}
              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  Search radius: {radiusKm} km
                </label>
                <input
                  type="range"
                  min={5}
                  max={200}
                  step={5}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-amber"
                />
                <div className="flex justify-between text-xs text-brand-muted mt-1">
                  <span>5 km</span>
                  <span>200 km</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Profile prompts */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-amber mb-2">
              Tell people who you are
            </h2>
            <p className="text-brand-muted mb-8">
              Answer any, all, or none. These show on your profile.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  I have no patience for...
                </label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Toxic positivity, pity, unsolicited advice..."
                  value={promptNoPatience}
                  onChange={(e) => setPromptNoPatience(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  I want company for...
                </label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Morning walks, bad movies, hospital waits..."
                  value={promptWantCompany}
                  onChange={(e) => setPromptWantCompany(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  Today my body can handle...
                </label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="A short walk, sitting in a cafe, a video call..."
                  value={promptBodyCanHandle}
                  onChange={(e) => setPromptBodyCanHandle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  Don't talk to me like...
                </label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="I'm fragile, I'm already gone, I need saving..."
                  value={promptDontTalkLike}
                  onChange={(e) => setPromptDontTalkLike(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  Before I go, I want to...
                </label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="See the northern lights, eat a meal I cook myself..."
                  value={promptBeforeIGo}
                  onChange={(e) => setPromptBeforeIGo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  Anything else you want people to know
                </label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Free text. Say whatever you want."
                  value={promptFreeform}
                  onChange={(e) => setPromptFreeform(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Condition / energy / mobility */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-amber mb-2">
              Your body, your terms
            </h2>
            <p className="text-brand-muted mb-8">
              This helps match you with moments that fit your energy. Completely optional.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  Condition summary
                </label>
                <textarea
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Whatever you're comfortable sharing. Only visible to people you connect with."
                  value={conditionSummary}
                  onChange={(e) => setConditionSummary(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-brand-muted mb-3">
                  Typical energy level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['high', 'moderate', 'low', 'varies'] as const).map((level) => (
                    <label
                      key={level}
                      className={`card cursor-pointer text-center transition-colors ${
                        energyLevel === level
                          ? 'border-brand-amber text-brand-amber'
                          : 'hover:border-brand-mid'
                      }`}
                    >
                      <input
                        type="radio"
                        name="energyLevel"
                        value={level}
                        checked={energyLevel === level}
                        onChange={() => setEnergyLevel(level)}
                        className="sr-only"
                      />
                      <span className="capitalize font-medium">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-brand-muted mb-1.5">
                  Mobility notes
                </label>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Wheelchair user, can't stand long, need breaks..."
                  value={mobilityNotes}
                  onChange={(e) => setMobilityNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={skip}
            className="btn-ghost text-sm"
            disabled={loading}
          >
            {step === 3 ? 'Skip & finish' : 'Skip'}
          </button>

          {step < 3 ? (
            <button type="button" onClick={next} className="btn-primary">
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Finish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

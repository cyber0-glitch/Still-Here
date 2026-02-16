import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { MOMENT_CATEGORIES, ENERGY_LEVELS } from '../types';

const PLACEHOLDER_EXAMPLES = [
  'Coffee and honest conversation',
  'Drive along the coast, no destination',
  'Watch a terrible movie and laugh',
  'Sit in a park and say nothing',
  'Cook something ridiculous together',
  'Museum visit, wheelchair-friendly',
  'Late night walk, slow pace okay',
  'Video call - just want company',
];

export default function NewMoment() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('flexible');
  const [locationName, setLocationName] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [energyLevelNeeded, setEnergyLevelNeeded] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    // Pick a random placeholder and rotate every 4 seconds
    const pick = () =>
      setPlaceholder(
        PLACEHOLDER_EXAMPLES[Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length)]
      );
    pick();
    const interval = setInterval(pick, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError('');
    setLoading(true);
    try {
      const payload: Record<string, any> = {
        title: title.trim(),
        category,
        locationType,
        maxParticipants: parseInt(maxParticipants, 10) || 2,
      };
      if (description.trim()) payload.description = description.trim();
      if (locationName.trim()) payload.locationName = locationName.trim();
      if (preferredDate) payload.preferredDate = preferredDate;
      if (preferredTime) payload.preferredTime = preferredTime;
      if (energyLevelNeeded) payload.energyLevelNeeded = energyLevelNeeded;

      await api('/moments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Failed to create moment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-brand-amber mb-2">
        What do you want to do?
      </h1>
      <p className="text-brand-muted mb-8">
        Post it. Someone nearby will say "I'm in."
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-brand-coral/10 border border-brand-coral/30 text-brand-coral rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm text-brand-muted mb-1.5">
            Title <span className="text-brand-coral">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            className="input-field"
            placeholder={placeholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm text-brand-muted mb-1.5">
            Category
          </label>
          <select
            id="category"
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {MOMENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm text-brand-muted mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            className="input-field min-h-[100px] resize-none"
            placeholder="Add any details - pace, accessibility, vibe..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Location type */}
        <div>
          <label className="block text-sm text-brand-muted mb-1.5">
            Location type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['specific', 'flexible', 'virtual'] as const).map((lt) => (
              <label
                key={lt}
                className={`card cursor-pointer text-center text-sm transition-colors ${
                  locationType === lt
                    ? 'border-brand-amber text-brand-amber'
                    : 'hover:border-brand-mid'
                }`}
              >
                <input
                  type="radio"
                  name="locationType"
                  value={lt}
                  checked={locationType === lt}
                  onChange={() => setLocationType(lt)}
                  className="sr-only"
                />
                <span className="capitalize">{lt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location name (only for specific) */}
        {locationType === 'specific' && (
          <div>
            <label htmlFor="locationName" className="block text-sm text-brand-muted mb-1.5">
              Location name
            </label>
            <input
              id="locationName"
              type="text"
              className="input-field"
              placeholder="e.g. Central Park, Cafe Europa"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>
        )}

        {/* Date and time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm text-brand-muted mb-1.5">
              Preferred date
            </label>
            <input
              id="date"
              type="date"
              className="input-field"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm text-brand-muted mb-1.5">
              Preferred time
            </label>
            <input
              id="time"
              type="time"
              className="input-field"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            />
          </div>
        </div>

        {/* Energy level */}
        <div>
          <label htmlFor="energy" className="block text-sm text-brand-muted mb-1.5">
            Energy level needed
          </label>
          <select
            id="energy"
            className="input-field"
            value={energyLevelNeeded}
            onChange={(e) => setEnergyLevelNeeded(e.target.value)}
          >
            <option value="">Not specified</option>
            {ENERGY_LEVELS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>

        {/* Max participants */}
        <div>
          <label htmlFor="maxParticipants" className="block text-sm text-brand-muted mb-1.5">
            Max participants
          </label>
          <input
            id="maxParticipants"
            type="number"
            min={1}
            max={20}
            className="input-field w-32"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Posting...' : 'Post moment'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/feed')}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

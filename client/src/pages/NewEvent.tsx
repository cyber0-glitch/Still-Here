import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { MOMENT_CATEGORIES, ENERGY_LEVELS } from '../types';

export default function NewEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('talk');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [virtualLink, setVirtualLink] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [energyLevel, setEnergyLevel] = useState('moderate');
  const [accessibilityNotes, setAccessibilityNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Not verified -- show gate
  if (user?.verificationStatus !== 'verified') {
    return (
      <div className="space-y-6">
        <Link
          to="/events"
          className="text-brand-muted hover:text-brand-text text-sm transition-colors"
        >
          &larr; Back to Events
        </Link>

        <div className="card text-center py-12">
          <h1 className="text-xl font-bold text-brand-text mb-3">
            Verification Required
          </h1>
          <p className="text-brand-muted">
            Event creation is for verified users. Verify your identity first.
          </p>
          <Link to="/verify" className="btn-primary inline-block mt-6">
            Go to Verification
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!eventDate || !eventTime) {
      setError('Event date and time are required');
      return;
    }

    setSubmitting(true);

    try {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`).toISOString();

      await api('/events', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          eventDate: eventDateTime,
          locationName: locationName.trim() || undefined,
          locationAddress: locationAddress.trim() || undefined,
          isVirtual,
          virtualLink: isVirtual ? virtualLink.trim() || undefined : undefined,
          durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : undefined,
          maxAttendees: maxAttendees ? parseInt(maxAttendees, 10) : undefined,
          energyLevel,
          accessibilityNotes: accessibilityNotes.trim() || undefined,
        }),
      });

      navigate('/events');
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/events"
        className="text-brand-muted hover:text-brand-text text-sm transition-colors"
      >
        &larr; Back to Events
      </Link>

      <h1 className="text-2xl font-bold text-brand-text">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm text-brand-muted mb-1.5">
            Title <span className="text-brand-coral">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's happening?"
            className="input-field"
            maxLength={120}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-brand-muted mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell people more about this event..."
            className="input-field min-h-[100px] resize-y"
            rows={4}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-brand-muted mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {MOMENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-brand-muted mb-1.5">
              Date <span className="text-brand-coral">*</span>
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-brand-muted mb-1.5">
              Time <span className="text-brand-coral">*</span>
            </label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Virtual toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsVirtual(!isVirtual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              isVirtual ? 'bg-brand-teal' : 'bg-brand-mid'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                isVirtual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm text-brand-text">Virtual Event</span>
        </div>

        {/* Location or Virtual Link */}
        {isVirtual ? (
          <div>
            <label className="block text-sm text-brand-muted mb-1.5">
              Virtual Link
            </label>
            <input
              type="url"
              value={virtualLink}
              onChange={(e) => setVirtualLink(e.target.value)}
              placeholder="https://zoom.us/j/..."
              className="input-field"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-brand-muted mb-1.5">
                Location Name
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g., Central Park, Joe's Coffee"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-muted mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="Full address"
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* Duration */}
        <div>
          <label className="block text-sm text-brand-muted mb-1.5">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="60"
            className="input-field"
            min="15"
            max="480"
          />
        </div>

        {/* Max Attendees */}
        <div>
          <label className="block text-sm text-brand-muted mb-1.5">
            Max Attendees
          </label>
          <input
            type="number"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(e.target.value)}
            placeholder="Leave empty for unlimited"
            className="input-field"
            min="2"
          />
        </div>

        {/* Energy Level */}
        <div>
          <label className="block text-sm text-brand-muted mb-1.5">
            Energy Level
          </label>
          <select
            value={energyLevel}
            onChange={(e) => setEnergyLevel(e.target.value)}
            className="input-field"
          >
            {ENERGY_LEVELS.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </option>
            ))}
          </select>
        </div>

        {/* Accessibility Notes */}
        <div>
          <label className="block text-sm text-brand-muted mb-1.5">
            Accessibility Notes
          </label>
          <textarea
            value={accessibilityNotes}
            onChange={(e) => setAccessibilityNotes(e.target.value)}
            placeholder="Wheelchair access, seating available, quiet space, etc."
            className="input-field min-h-[80px] resize-y"
            rows={3}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-brand-coral text-sm">{error}</p>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? 'Creating...' : 'Create Event'}
          </button>
          <Link to="/events" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

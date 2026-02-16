import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        email,
        password,
        displayName,
        locationCity: locationCity || undefined,
        locationCountry: locationCountry || undefined,
      });
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-brand-amber mb-2 text-center">
          Join Still Here
        </h1>
        <p className="text-brand-muted text-center mb-8">
          No gatekeeping. No diagnosis required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-brand-coral/10 border border-brand-coral/30 text-brand-coral rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm text-brand-muted mb-1.5">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              required
              className="input-field"
              placeholder="What people will call you"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-brand-muted mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-brand-muted mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="input-field"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm text-brand-muted mb-1.5">
                City
              </label>
              <input
                id="city"
                type="text"
                className="input-field"
                placeholder="Your city"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm text-brand-muted mb-1.5">
                Country
              </label>
              <input
                id="country"
                type="text"
                className="input-field"
                placeholder="Your country"
                value={locationCountry}
                onChange={(e) => setLocationCountry(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-brand-muted text-sm text-center mt-8">
          Already a member?{' '}
          <Link to="/login" className="text-brand-amber hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

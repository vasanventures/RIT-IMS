import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.ts';
import api from '../services/api.ts';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      
      const role = response.data.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'FACULTY') navigate('/faculty');
      else navigate('/student');
    } catch (err: unknown) {
      let message = 'Login failed. Please check your credentials.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response: { data: { message?: string } } };
        message = axiosErr.response.data.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-[20px] shadow-2xl overflow-hidden min-h-[500px]">
        {/* Left Pane - Branding & Info */}
        <div className="md:w-[45%] bg-[#254170] p-10 flex flex-col items-center text-center justify-center text-white relative">
          {/* Logo Placeholder - RIT Style */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <svg viewBox="0 0 100 100" className="w-10 h-10 fill-white">
                    <path d="M50 10 L80 90 L20 90 Z" opacity="0.5" />
                    <text x="50" y="65" textAnchor="middle" fontSize="30" fontWeight="bold" fill="white">rit</text>
                </svg>
            </div>
            <div className="text-left">
                <h1 className="text-3xl font-bold leading-tight tracking-tight">RIT</h1>
                <p className="text-xs uppercase tracking-[0.2em] font-medium opacity-80">Rajalakshmi Institute of Technology</p>
            </div>
          </div>
          
          <div className="max-w-xs space-y-4">
            <p className="text-sm leading-relaxed font-light opacity-90 italic">
              "Rajalakshmi Institute of Technology is an engineering college in Chennai, Tamil Nadu, India. RIT is approved by AICTE and affiliated with Anna University, Chennai and accredited with 'A++' Grade in NAAC. ."
            </p>
          </div>
          
          {/* Decorative Wave (approximation) */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/5 pointer-events-none hidden md:block" 
               style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 40% 50%, 0 0)' }}>
          </div>
        </div>

        {/* Right Pane - Login Form */}
        <div className="md:w-[55%] p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-700">Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 text-gray-600"
                  placeholder="User ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400 text-gray-600 pr-12"
                  placeholder="Password"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#007bff] hover:bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            Forgot password? <a href="#" className="text-blue-600 hover:underline font-medium">Reset here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

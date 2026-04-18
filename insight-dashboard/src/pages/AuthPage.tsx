import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { CyberGlobe } from '../components/widgets/CyberGlobe';
import { Activity, Lock, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const AuthPage = () => {
   const { loginWithGoogle, user } = useAuth();
   const navigate = useNavigate();
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (user) navigate('/');
   }, [user, navigate]);

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      // Dummy credentials check
      if (username === 'admin' && password === 'admin123') {
         setLoading(true);
         await loginWithGoogle(); // reuses the same login function (sets dummy user)
         setLoading(false);
      } else {
         setError('Invalid credentials. Use admin / admin123');
      }
   };

   return (
      <div className="relative w-screen h-screen bg-[#060B19] overflow-hidden font-sans">
         {/* 3D Background */}
         <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
               <ambientLight intensity={0.2} />
               <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
               <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
               <Environment preset="city" />
               <CyberGlobe />
               <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
         </div>

         {/* Gradient Overlay */}
         <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#060B19] via-[#060B19]/80 to-transparent flex items-center px-8 md:px-24">
            
            {/* Glassmorphism Auth Container */}
            <div className="w-full max-w-sm border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-8">
               
               <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
                     <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                     <h1 className="text-xl font-bold tracking-wider text-white">MONOLITH</h1>
                     <p className="text-[10px] uppercase tracking-widest text-[#00ffff] font-mono">Telemetry & Ops</p>
                  </div>
               </div>

               <h2 className="text-2xl font-semibold text-white mb-1">Welcome Back</h2>
               <p className="text-sm text-gray-400 mb-6">
                  Authenticate to access live infrastructure metrics and command center operations.
               </p>

               <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
                     />
                  </div>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
                     />
                  </div>

                  {error && (
                     <p className="text-red-400 text-xs font-mono">{error}</p>
                  )}

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full flex items-center justify-center gap-2 bg-primary/80 hover:bg-primary border border-primary/50 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50"
                  >
                     {loading ? 'Authenticating...' : 'Login'}
                  </button>
               </form>

               <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-[10px] text-gray-400 font-mono text-center">
                     Demo credentials: <span className="text-[#00ffff]">admin</span> / <span className="text-[#00ffff]">admin123</span>
                  </p>
               </div>

               <div className="mt-4 text-center border-t border-white/10 pt-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                     Monolith Systems Enterprise v2.4
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AuthPage;


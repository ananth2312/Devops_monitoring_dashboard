import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { CyberGlobe } from '../components/widgets/CyberGlobe';
import { Activity, Github, Mail } from 'lucide-react';
import { useEffect } from 'react';

const AuthPage = () => {
   const { loginWithGoogle, user } = useAuth();
   const navigate = useNavigate();

   // Redirect if already authenticated
   useEffect(() => {
      if (user) {
         navigate('/');
      }
   }, [user, navigate]);

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

         {/* Gradient Overlay for better contrast */}
         <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#060B19] via-[#060B19]/80 to-transparent flex items-center px-8 md:px-24">
            
            {/* Glassmorphism Auth Container */}
            <div className="w-full max-w-sm border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-8 transform transition-all">
               
               <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
                     <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                     <h1 className="text-xl font-bold tracking-wider text-white">MONOLITH</h1>
                     <p className="text-[10px] uppercase tracking-widest text-[#00ffff] font-mono">Telemetry & Ops</p>
                  </div>
               </div>

               <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
               <p className="text-sm text-gray-400 mb-8">
                  Authenticate to access live infrastructure metrics and command center operations.
               </p>

               <div className="space-y-4">
                  <button 
                     onClick={loginWithGoogle}
                     className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-2.5 rounded-lg transition-all"
                  >
                     <Mail className="w-4 h-4" />
                     Authenticate with Google
                  </button>
                  
                  <button 
                     disabled
                     className="w-full flex items-center justify-center gap-3 bg-black/40 border border-white/5 text-gray-500 font-medium py-2.5 rounded-lg cursor-not-allowed"
                  >
                     <Github className="w-4 h-4 opacity-50" />
                     SSO Login (Disabled)
                  </button>
               </div>

               <div className="mt-8 text-center border-t border-white/10 pt-6">
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

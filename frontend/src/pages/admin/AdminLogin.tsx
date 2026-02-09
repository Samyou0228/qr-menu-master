import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { token } = await api.login(username, password);
      localStorage.setItem("token", token);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden p-4">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link 
          to="/" 
          className="absolute top-6 left-6 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-elevated transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>

        <Card className="border-none shadow-elevated bg-white/90 backdrop-blur overflow-hidden">
          <div className="h-2 bg-gradient-warm w-full" />
          <CardHeader className="space-y-1 text-center pb-2">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4"
            >
              <Lock className="w-6 h-6 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-display font-bold text-foreground">Admin Portal</CardTitle>
            <CardDescription>Enter your credentials to manage the menu</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center font-medium"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter username"
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      placeholder="Enter password"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-11 gradient-warm text-white font-medium shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
                >
                  Sign In
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Secure Admin Access
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

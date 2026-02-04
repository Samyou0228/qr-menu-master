import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 p-6 rounded-xl border bg-card">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        {error && <div className="text-destructive text-sm">{error}</div>}
        <div>
          <label className="text-sm mb-1 block">Username</label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="text-sm mb-1 block">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;

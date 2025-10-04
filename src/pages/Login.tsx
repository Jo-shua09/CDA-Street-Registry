import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - In real app, this would connect to backend
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Login Successful",
          description: "Welcome to the Street Registry Admin Panel",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter valid credentials",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background border m-auto my-auto mx-auto flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="CDA Registry Logo" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Street Registry Admin</h1>
          <p className="text-muted-foreground">Secure access to street and property management</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cdaregistry.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">Secure admin access only. Unauthorized access is prohibited.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="border border-yellow-300 bg-yellow-50 rounded-md p-5 text-sm text-gray-700">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-500 mt-0.5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01M12 5.5a6.5 6.5 0 11-6.5 6.5 6.5 6.5 0 016.5-6.5z"
                />
              </svg>
              <div>
                <p className="font-semibold text-lg">Forgot your login details?</p>
                <p className="mt-1">
                  If you have forgotten your login credentials or need assistance accessing your account, please contact the ICT department at
                  <a href="mailto:ict@iblcdacda.lg.gov.ng" className="text-yellow-700 px-1 underline">
                    ict@iblcdacda.lg.gov.ng
                  </a>
                  or call <span className="text-yellow-700 font-medium">+234-123-456-7890</span>.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">© 2025 CDA Street & Property Registry System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

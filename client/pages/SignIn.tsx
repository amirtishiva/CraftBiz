import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password
    if (email && password) {
      // Store user data in localStorage for demo
      localStorage.setItem('user', JSON.stringify({
        name: email.split('@')[0],
        email: email,
        isLoggedIn: true
      }));
      
      // Post-signin routing
      const shouldOpenNew = localStorage.getItem('openNewProjectAfterSignIn') === 'true';
      if (shouldOpenNew) {
        localStorage.removeItem('openNewProjectAfterSignIn');
        navigate('/projects', { state: { openNewProject: true } });
      } else {
        navigate('/projects');
      }

      // Notify app about auth change
      window.dispatchEvent(new Event('auth:changed'));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f4f0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
    

          {/* Welcome Message */}
          <h1 className="text-3xl font-bold mb-2">Welcome back.</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue building.
          </p>

          {/* Sign In Section */}
          <form onSubmit={handleSignIn} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Sign in</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your email and password to access your account.
            </p>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between mt-4 mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[#8b6b4a] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit"
              className="w-full h-12 bg-[#8b6b4a] hover:bg-[#7a5a3f] text-white rounded-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center mb-6">
            <Button variant="outline" className="h-12 border border-border hover:bg-muted rounded-lg px-8">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-sm text-[#8b6b4a] hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

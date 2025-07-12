import { useState } from "react";
import { 
  Mic, 
  BarChart3, 
  Calculator, 
  Smartphone, 
  Globe, 
  Bell, 
  Shield, 
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  MicIcon, ChartBarIncreasingIcon, WalletCardsIcon
} from "lucide-react";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signupCount] = useState(1247);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle waitlist signup
    console.log("Signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-400/20 backdrop-blur-lg bg-background/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl w-14 h-14">
           <img className="w-full" src="https://res.cloudinary.com/ddvozdtkg/image/upload/v1752335127/wallet_talk-logo-removebg-preview_ctvv3w.png" alt="" />
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-purple-400">Features</a>
            <a href="#how-it-works" className="hover:text-purple-400">How It Works</a>
            <a href="#waitlist" className="hover:text-purple-400">Join Waitlist</a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-400/50 bg-gray-900/95 backdrop-blur-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
              <a href="#waitlist" className="hover:text-purple-400 transition-colors">Join Waitlist</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 bg-gray-900 rounded-2xl  w-[230px] mx-auto text-xs py-1">
            🎙️ Voice-Powered Finance Tracker
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Talk to your money.{" "}
            <span className="bg-purple-500 bg-clip-text text-transparent">
              Budget better.
            </span>{" "}
            Live smarter.
          </h1>
          
          <p className="text-xl md:text-2xl textgray-400 mb-8 max-w-2xl mx-auto">
            The fastest way to track expenses for young adults. Just speak your spending, 
            watch beautiful visuals, and stay on top of your financial goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={()=> navigate('/auth')}  size="lg" className=" flex items-center hover:scale-105 text-lg px-8 py-2 rounded-lg bg-purple-500 text-gray-900">
              Start Budgeting <ArrowRight className="ml-2" />
            </button>
            <button size="lg" className="text-lg px-8 py-2 text-gray-100 rounded-lg hover:border-purple-500/40 border border-gray-500/50">
              Join the Waitlist
            </button>
          </div>
          
          <div className="relative max-w-2xl mx-auto">
            <img 
              src='https://res.cloudinary.com/ddvozdtkg/image/upload/v1750944049/chat-app-profiles/xgg507bbbwww2mzgexgz.webp' 
              alt="WalletTalk App Preview" 
              className="w-full h-auto rounded-2xl shadow-card"
            />
            <div className="absolute inset-0 bg-purple-900-primary opacity-10 rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-blue-900-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Three Simple Steps
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Managing money has never been this easy. No complex forms, no tedious data entry.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Speak",
                description: "Say your expense naturally. 'Spent $15 on lunch at Subway'",
                icon: MicIcon,
                accent: "from-primary to-primary-glow"
              },
              {
                step: "02", 
                title: "Track",
                description: "Watch beautiful visuals update automatically with smart categorization",
                icon: ChartBarIncreasingIcon,
                accent: "from-accent to-accent-glow"
              },
              {
                step: "03",
                title: "Budget",
                description: "Stay on top of your goals with intelligent insights and reminders",
                icon: WalletCardsIcon,
                accent: "from-primary-glow to-accent"
              }
            ].map((step, index) => (
              <div key={index} className="bg-black/8 backdrop-blur-sm border rounded-lg border-gray-400/20 hover:bg-card/70 transition-all duration-300 animate-fade-in">
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-700 ${step.accent} p-4`}>
                    <img 
                      src='https://res.cloudinary.com/ddvozdtkg/image/upload/v1750944049/chat-app-profiles/xgg507bbbwww2mzgexgz.webp' 
                      alt={step.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-sm font-mono text-purple-600 mb-2">{step.step}</div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for the modern, mobile-first lifestyle.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Mic className="w-6 h-6" />,
                title: "Voice-Powered Logging",
                description: "Just speak naturally to log any expense instantly"
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Smart Visual Tracking", 
                description: "Beautiful progress bars and charts that make sense"
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Multi-Currency Support",
                description: "KES, USD, EUR and more with real-time conversion"
              },
              {
                icon: <Bell className="w-6 h-6" />,
                title: "Smart Reminders",
                description: "Gentle nudges to help you stay on track"
              },
              {
                icon: <Calculator className="w-6 h-6" />,
                title: "Custom Categories",
                description: "Create spending categories that match your lifestyle"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Privacy First",
                description: "Your financial data stays secure and private"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-black/6 backdrop-blur-sm rounded-lg border border-gray-400/20 hover:bg-card/50 transition-all duration-300 group">
                <div className="p-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why WalletTalk */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Why Choose WalletTalk?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                {[
                  "Fast voice-first experience built for busy lifestyles",
                  "Clean, fun UI designed specifically for Gen Z & Millennials", 
                  "Privacy-first approach with no complex setup required",
                  "Smart AI that learns your spending patterns"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-neutral-950" />
                    </div>
                    <p className="text-left text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-black/10 backdrop-blur-sm rounded-lg border border-gray-400/20">
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <blockquote className="text-lg italic mb-4">
                    "Finally, a finance app that doesn't feel like homework. I love how I can just talk to it!"
                  </blockquote>
                  <div className="text-sm text-gray-400">
                    — Alex, Beta User
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Waitlist
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Be among the first to experience the future of personal finance. 
              Get early access and exclusive perks.
            </p>
            
            <div className="bg-neutral-950/50 backdrop-blur-sm rounded-lg border border-gray-500/20 p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{signupCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">people have signed up already</div>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-5 bg-black/50 border border-gray-500/20 text-sm"
                    required
                  />
                  <button type="submit" className="text-lg px-8 py-2 bg-purple-500 text-gray-900" size="lg">
                    Join Waitlist
                  </button>
                </form>
                
                <p className="text-xs text-gray-400">
                  No spam, just updates on our launch progress and early access opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-500/20 bg-slate-900/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl w-14 h-14">
           <img className="w-full" src="https://res.cloudinary.com/ddvozdtkg/image/upload/v1752335127/wallet_talk-logo-removebg-preview_ctvv3w.png" alt="" />
          </div>
              <p className="text-gray-400 mb-4">
                The voice-powered finance tracker that makes budgeting feel natural and fun.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">LinkedIn</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-purple-500 transition-colors">Features</a>
                <a href="#how-it-works" className="block text-gray-400 hover:text-purple-500 transition-colors">How It Works</a>
                <a href="/pricing" className="block text-gray-400 hover:text-purple-500 transition-colors">Pricing</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-purple-500 transition-colors">About</a>
                <a href="#" className="block text-gray-400 hover:text-purple-500 transition-colors">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-purple-500 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-purple-500 transition-colors">Terms of Use</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-500/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} WalletTalk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
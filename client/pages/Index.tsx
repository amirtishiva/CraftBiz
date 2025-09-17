import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowRight,
  Lightbulb,
  Target,
  Palette,
  Briefcase,
  MapPin,
  Megaphone,
  Download,
  Share2,
  User,
  ChevronDown,
  Star,
  Check,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Truck,
  Phone,
  MessageCircle,
  Upload,
  FileText,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Play,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import StepsFlow from "@/components/StepsFlow";
import SiteFooter from "@/components/layout/SiteFooter";
import { useLocation, useNavigate } from "react-router-dom";
// 3D removed per request; using static image instead

interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "completed";
  progress: number;
  createdAt: string;
  lastModified: string;
}

interface BusinessPlan {
  executiveSummary: string;
  targetAudience: string;
  costs: string;
  goToMarket: string;
  operations: string;
}

interface FinancialData {
  unitCost: number;
  sellingPrice: number;
  setupBudget: number;
  monthlyOrders: number;
  grossMargin: number;
  breakEvenPoint: number;
  paybackPeriod: string;
}

interface Dealer {
  id: string;
  name: string;
  rating: number;
  services: string[];
  distance: string;
  phone: string;
  address: string;
}

interface MarketingContent {
  platform: string;
  copy: string;
  hashtags: string[];
  tone: string;
  angle: string;
}

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [currentView, setCurrentView] = useState<
    | "landing"
    | "dashboard"
    | "plan"
    | "design"
    | "dealers"
    | "marketing"
    | "export"
    | "projects"
    | "settings"
  >("landing");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Handle project selection from navigation and check authentication
  useEffect(() => {
    if (location.state?.selectedProject) {
      setCurrentProject(location.state.selectedProject);
      setCurrentView("dashboard");
      setIsLoggedIn(true);
      setCurrentUser({ name: "Demo User", email: "demo@example.com" });
    }
    
    // Check if user is logged in from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, [location.state]);
  const [selectedPlanSection, setSelectedPlanSection] = useState("executive");
  const [designTab, setDesignTab] = useState("branding");
  const [mockupProduct, setMockupProduct] = useState("t-shirt");
  const [mockupColor, setMockupColor] = useState("black");

  // Pricing billing cycle state (monthly | annual)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const formatINR = (n: number) => n.toLocaleString("en-IN");
  const billingPrice = (monthly: number) =>
    billingCycle === "monthly" ? formatINR(monthly) : formatINR(monthly * 10);

  useEffect(() => {
    if (currentView === "landing") {
      document.body.classList.add("cream-ui");
    } else {
      document.body.classList.remove("cream-ui");
    }
    return () => {
      document.body.classList.remove("cream-ui");
    };
  }, [currentView]);

  const [financialData, setFinancialData] = useState<FinancialData>({
    unitCost: 500,
    sellingPrice: 1500,
    setupBudget: 50000,
    monthlyOrders: 100,
    grossMargin: 66.7,
    breakEvenPoint: 50,
    paybackPeriod: "2-3 months",
  });

  const [businessPlan, setBusinessPlan] = useState<BusinessPlan>({
    executiveSummary:
      "We aim to create a sustainable t-shirt brand that combines eco-friendly materials with modern designs, targeting environmentally conscious millennials and Gen Z consumers.",
    targetAudience:
      "Our primary target audience consists of environmentally conscious individuals aged 18-35 who value sustainable fashion and are willing to pay a premium for ethically made products.",
    costs:
      "Our primary costs will include organic cotton sourcing (₹200 per unit), printing and manufacturing (₹150 per unit), packaging (₹50 per unit), and marketing expenses (₹100 per unit).",
    goToMarket:
      "We will launch through social media marketing, influencer partnerships, and pop-up events in major cities. Our online-first approach will be supported by strategic retail partnerships.",
    operations:
      "Operations will be managed through a network of certified sustainable manufacturers, with quality control at every stage and direct-to-consumer shipping from our fulfillment center.",
  });

  const [dealers] = useState<Dealer[]>([
    {
      id: "1",
      name: "EcoTees Printing Co.",
      rating: 4.8,
      services: ["DTG Printing", "Screen Print", "Embroidery"],
      distance: "2.1km",
      phone: "+91 98765 43210",
      address: "123 Green Street, Mumbai",
    },
    {
      id: "2",
      name: "Sustainable Print Palace",
      rating: 4.5,
      services: ["Screen Print", "Organic Inks"],
      distance: "5.8km",
      phone: "+91 87654 32109",
      address: "456 Eco Lane, Mumbai",
    },
    {
      id: "3",
      name: "Green Garment Hub",
      rating: 4.9,
      services: ["Full Service", "Sustainable Materials"],
      distance: "3.2km",
      phone: "+91 76543 21098",
      address: "789 Nature Road, Mumbai",
    },
  ]);

  const [marketingContent, setMarketingContent] = useState<MarketingContent>({
    platform: "Instagram",
    copy: "🌱 Sustainable fashion that doesn't compromise on style! Our eco-friendly t-shirts are made from 100% organic cotton and printed with water-based inks. Join the green revolution! #SustainableFashion #EcoFriendly",
    hashtags: [
      "#SustainableFashion",
      "#EcoFriendly",
      "#OrganicCotton",
      "#GreenFashion",
      "#EthicalClothing",
      "#ZeroWaste",
      "#SlowFashion",
      "#EcoConscious",
    ],
    tone: "Playful",
    angle: "Environmental Impact",
  });

  const projects: Project[] = [
    {
      id: "1",
      name: "Eco T-Shirt Brand",
      description:
        "Sustainable fashion startup targeting eco-conscious millennials",
      status: "active",
      progress: 75,
      createdAt: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: "2",
      name: "Local Coffee Shop",
      description: "Artisanal coffee shop in downtown area",
      status: "draft",
      progress: 25,
      createdAt: "2024-01-10",
      lastModified: "2024-01-12",
    },
  ];

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentUser({ name: "Priya Sharma", email: "priya@example.com" });
    setCurrentView("dashboard");
  };

  const handleStartNewProject = () => {
    if (!isLoggedIn) {
      // Mark intent and redirect to sign in
      localStorage.setItem('openNewProjectAfterSignIn', 'true');
      navigate('/signin');
      return;
    }
    // Authenticated: go to projects page and open the create modal
    navigate('/projects', { state: { openNewProject: true } });
  };

  const handleWatchDemo = () => {
    if (!isLoggedIn) {
      // Redirect to sign in page
      window.location.href = '/signin';
      return;
    }
    setCurrentView("projects");
  };

  const handleCreateProject = (idea: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: idea.split(" ").slice(0, 3).join(" ") + " Business",
      description: idea,
      status: "draft",
      progress: 10,
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    };
    setCurrentProject(newProject);
    setShowNewProjectModal(false);
    setCurrentView("dashboard");
  };

  const generateBusinessPlan = () => {
    setBusinessPlan({
      ...businessPlan,
      executiveSummary:
        "AI-generated comprehensive business plan based on your idea. This executive summary outlines the key value proposition, target market, and competitive advantages of your business concept.",
    });
  };

  const regenerateSection = (section: keyof BusinessPlan) => {
    setBusinessPlan({
      ...businessPlan,
      [section]: `Regenerated ${section} content with fresh AI insights and updated market analysis.`,
    });
  };

  const updateFinancialData = (field: keyof FinancialData, value: number) => {
    const updated = { ...financialData, [field]: value } as FinancialData;
    if (field === "unitCost" || field === "sellingPrice") {
      updated.grossMargin =
        ((updated.sellingPrice - updated.unitCost) / updated.sellingPrice) *
        100;
    }
    if (
      field === "setupBudget" ||
      field === "sellingPrice" ||
      field === "unitCost"
    ) {
      updated.breakEvenPoint = Math.ceil(
        updated.setupBudget / (updated.sellingPrice - updated.unitCost),
      );
    }
    setFinancialData(updated);
  };

  const generateMarketingCopy = () => {
    const newCopy =
      "🚀 Revolutionary new product that's changing the game! Experience innovation like never before. Limited time offer - don't miss out! #Innovation #GameChanger #LimitedOffer";
    setMarketingContent({ ...marketingContent, copy: newCopy });
  };

  function NewProjectModal() {
    const [ideaText, setIdeaText] = useState("");
    const [category, setCategory] = useState("Clothing");
    const [style, setStyle] = useState("Modern");
    const [priceRange, setPriceRange] = useState("Mid-Range");

    return (
      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Transform your business idea into a comprehensive launch-ready
              plan
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="idea" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="idea">Start from Idea</TabsTrigger>
              <TabsTrigger value="design">Start from Design</TabsTrigger>
            </TabsList>

            <TabsContent value="idea" className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Describe your idea:
                </label>
                <textarea
                  className="w-full mt-1 p-3 border border-border rounded-md resize-none"
                  rows={3}
                  placeholder="e.g., Eco-friendly t-shirt brand for young professionals"
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Optional Tags (helps improve AI results):
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <label className="text-xs text-muted-foreground" htmlFor="idea-category">
                      Category:
                    </label>
                    <select
                      id="idea-category"
                      className="w-full p-2 border border-border rounded text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>Clothing</option>
                      <option>Food & Beverage</option>
                      <option>Technology</option>
                      <option>Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground" htmlFor="idea-style">
                      Style:
                    </label>
                    <select
                      id="idea-style"
                      className="w-full p-2 border border-border rounded text-sm"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                    >
                      <option>Modern</option>
                      <option>Retro</option>
                      <option>Minimalist</option>
                      <option>Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground" htmlFor="idea-price">
                      Price:
                    </label>
                    <select
                      id="idea-price"
                      className="w-full p-2 border border-border rounded text-sm"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <option>Budget</option>
                      <option>Mid-Range</option>
                      <option>Premium</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop your design here, or click to browse
                </p>
                <Button variant="outline" className="mt-2">
                  Choose File
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewProjectModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCreateProject(ideaText)}
              disabled={!ideaText.trim()}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  function LandingPage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f4f0] to-[#fefcf9]">
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#efe0d3] text-[#8b6b4a] px-4 py-2 rounded-full text-sm font-medium">
                  <Lightbulb className="h-4 w-4" />
                  AI-Powered Business Launch Platform
                </div>

                {/* Headline */}
                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                  Start any small business today
              </h1>

                {/* Description */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From idea to designs, dealers, marketing & costs in minutes. Your AI co-founder that transforms one-line ideas into launch-ready business kits.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                    className="h-12 px-8 text-base font-semibold bg-[#8b6b4a] hover:bg-[#7a5a3f] text-white rounded-full"
                  onClick={handleStartNewProject}
                >
                    <Play className="mr-2 h-4 w-4" />
                    Start Building Now
                </Button>
                <Button
                    variant="outline"
                  size="lg"
                    className="h-12 px-8 text-base font-semibold border-2 border-[#8b6b4a] text-[#8b6b4a] hover:bg-[#8b6b4a] hover:text-white rounded-full"
                  onClick={handleWatchDemo}
                >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                </Button>
              </div>
            </motion.div>

              {/* Right Column - Abstract UI Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border border-[#efe0d3]">
                  {/* Window Controls */}
                  <div className="flex gap-2 mb-4">
                    <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
              </div>

                  {/* UI Elements */}
                  <div className="space-y-4">
                    {/* Lightbulb Icon */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#efe0d3] rounded-full flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-[#8b6b4a]" />
            </div>
                      <div className="h-3 bg-[#f5f0e8] rounded w-24"></div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2">
                      <div className="h-2.5 bg-gradient-to-r from-[#d4c4b0] to-[#c9b5a0] rounded-full w-full"></div>
                      <div className="h-2.5 bg-gradient-to-r from-[#e8d5c0] to-[#d4c4b0] rounded-full w-3/4"></div>
                      <div className="h-2.5 bg-gradient-to-r from-[#c9b5a0] to-[#b8a088] rounded-full w-1/2"></div>
                    </div>

                    {/* Colored Circles */}
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#d4c4b0] to-[#c9b5a0] rounded-full"></div>
                      <div className="w-6 h-6 bg-gradient-to-br from-[#e8d5c0] to-[#d4c4b0] rounded-full"></div>
                      <div className="w-6 h-6 bg-gradient-to-br from-[#c9b5a0] to-[#b8a088] rounded-full"></div>
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="absolute bottom-4 right-4">
                    <Button size="sm" className="bg-white border border-[#8b6b4a] text-[#8b6b4a] hover:bg-[#8b6b4a] hover:text-white rounded-md text-xs">
                      <Download className="mr-1 h-3 w-3" />
                      Export
                    </Button>
                  </div>

                  {/* Star Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#d4c4b0] to-[#c9b5a0] rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-[#8b6b4a]" />
                    </div>
                  </div>
                </div>

                {/* Lightning Bolt Icon */}
                <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#8b6b4a] to-[#a67c52] rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              Everything you need to launch
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Lightbulb,
                  title: "AI Business Planner",
                  desc: "Generate comprehensive business plans with financial projections",
                },
                {
                  icon: Palette,
                  title: "Design Studio",
                  desc: "Create logos and product mockups with AI-powered design tools",
                },
                {
                  icon: MapPin,
                  title: "Local Suppliers",
                  desc: "Find and connect with verified local dealers and manufacturers",
                },
                {
                  icon: Megaphone,
                  title: "Marketing Kit",
                  desc: "Generate platform-specific content and promotional materials",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card className="p-6 text-center hover:shadow-md transition-shadow">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <StepsFlow />

        {/* Testimonials */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <span className="inline-block bg-muted px-3 py-1 rounded-full text-xs">
                Success Stories
              </span>
              <h2 className="text-3xl font-extrabold mt-4">
                Indian entrepreneurs love CraftBiz
              </h2>
              <p className="text-muted-foreground mt-2">
                Real stories from entrepreneurs who transformed their ideas into
                successful businesses
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    '"Craft Connect transformed my tea business idea into a reality. Within 2 weeks, I had everything needed to start - from suppliers in Assam to marketing materials!"',
                  name: "Priya Sharma",
                  role: "Founder, Chai Craft",
                  location: "Mumbai, Maharashtra",
                  avatar:
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
                },
                {
                  quote:
                    '"The AI business planner helped me understand the handicraft market in India. I found local artisans and launched my online store in just 10 days."',
                  name: "Rajesh Kumar",
                  role: "CEO, Heritage Crafts",
                  location: "Jaipur, Rajasthan",
                  avatar:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
                },
                {
                  quote:
                    '"From idea to launch in 3 weeks! The supplier network and marketing kit were game-changers for my organic food startup."',
                  name: "Anita Patel",
                  role: "Founder, Pure Harvest",
                  location: "Ahmedabad, Gujarat",
                  avatar:
                    "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=256&q=80",
                },
              ].map((t, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full shadow-sm overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-12 w-12 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const initials = t.name.split(' ').map(n => n[0]).join('');
                            parent.innerHTML = `<div class="flex items-center justify-center h-12 w-12 text-white font-semibold text-sm">${initials}</div>`;
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star
                            key={k}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-sm mb-3">{t.quote}</p>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role} • {t.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center mb-6">
            <h2 className="text-3xl font-extrabold">
              Simple, affordable pricing
            </h2>
            <p className="text-muted-foreground mt-2">
              Choose the plan that fits your entrepreneurial journey
            </p>

            {/* Billing toggle */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1 rounded-full ${billingCycle === "monthly" ? "bg-foreground text-white" : "bg-muted"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-3 py-1 rounded-full ${billingCycle === "annual" ? "bg-foreground text-white" : "bg-muted"}`}
              >
                Annual (2 months free)
              </button>
            </div>
          </div>

          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <Card className="p-6 text-center rounded-lg">
                <h3 className="font-semibold mb-2">Starter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for students and first-time entrepreneurs
                </p>
                <div className="text-2xl font-bold mb-4">
                  ₹{billingPrice(299)}{" "}
                  <span className="text-sm text-muted-foreground">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                <ul className="text-sm text-left mb-6 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    1 Project
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Basic Business Plan Generation (summary & audience only)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Limited AI Logo Generations (2 rounds)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Standard Mockup Templates
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Basic Marketing Copy Generation
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </Card>

              <Card
                className="p-6 border-2 border-primary shadow-lg relative rounded-lg"
                style={{ transform: "translateY(-6px)" }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-white px-3 py-1 rounded-full text-xs">
                  Most Popular
                </div>
                <h3 className="font-semibold mb-2">Professional</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ideal for serious entrepreneurs and small businesses
                </p>
                <div className="text-2xl font-bold mb-4">
                  ₹{billingPrice(599)}{" "}
                  <span className="text-sm text-muted-foreground">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                <ul className="text-sm text-left mb-6 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Up to 10 Projects
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Full Business Plan + Cost/Revenue Calculator
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Unlimited AI Logo Generations
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Premium Mockup Templates
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Full Marketing Kit (incl. Scheduling Tips)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Iterative Refinement (Refine feature)
                  </li>
                </ul>
                <Button className="w-full bg-foreground text-white">
                  Get Started
                </Button>
              </Card>

              <Card className="p-6 text-center rounded-lg">
                <h3 className="font-semibold mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The Power User / Team Plan
                </p>
                <div className="text-2xl font-bold mb-4">
                  {billingCycle === "monthly"
                    ? `₹${formatINR(999)} /month`
                    : "Custom"}
                </div>
                <ul className="text-sm text-left mb-6 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Everything in Professional
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Unlimited Projects
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Team Collaboration (multi-user seats)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Priority Support (dedicated account manager)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#efe0d3] text-[#8b6b4a]">
                      ✓
                    </span>{" "}
                    Custom Branding Options (future)
                  </li>
                </ul>
                <Button className="w-full">Contact Sales</Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="pt-24 pb-0 bg-gradient-to-br from-[#f9f4f0] to-[#fefcf9]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left Column - Contact Information */}
              <div>
                <h2 className="text-3xl font-extrabold mb-4">Ready to start your entrepreneurial journey?</h2>
                <p className="text-muted-foreground mb-8">
                  Join thousands of Indian entrepreneurs who have transformed their ideas into successful businesses with CraftBiz.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground/10 mt-1">
                      <MessageCircle className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email Support</p>
                      <p className="text-muted-foreground">support@craftbiz.com</p>
                    </div>
            </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground/10 mt-1">
                      <Phone className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Phone Support</p>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-foreground/10 mt-1">
                      <MapPin className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Office</p>
                      <p className="text-muted-foreground">Hyderabad, Telangana, India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <Card className="p-8 shadow-lg bg-white rounded-lg">
                <h3 className="text-2xl font-extrabold mb-2">Send us a message</h3>
                <p className="text-muted-foreground mb-6">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name</label>
                      <Input placeholder="Enter your first name" className="rounded-md" />
                </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name</label>
                      <Input placeholder="Enter your last name" className="rounded-md" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <Input placeholder="Enter your email" className="rounded-md" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                      placeholder="Tell us more about your project..."
                      className="w-full border border-border rounded-md p-3 resize-y min-h-[100px]"
                  rows={4}
                />
                </div>

                  <Button className="w-full h-12 text-base font-semibold bg-[#8b6b4a] hover:bg-[#7a5a3f] text-white rounded-full">
                    Send Message
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Footer - only on landing page */}
        <SiteFooter />
      </div>
    );
  }

  function WorkspaceDashboard() {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">
                  {currentProject?.name || "Eco T-Shirt Brand"}
                </h1>
                <Badge variant={currentProject?.status === "active" ? "default" : "secondary"}>
                  {currentProject?.status || "Draft"}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView("projects")}
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Back
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentView("export")}
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
                
                {isLoggedIn && (
                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" /> {currentUser?.name}
                    <ChevronDown className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" /> Business Plan
                      & Costs
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Breakeven ~3-5wks (Est.)
                  </p>
                  <Button onClick={() => setCurrentView("plan")}>
                    Generate Plan
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Palette className="h-5 w-5 text-purple-500" /> Design Studio
                    </h3>
                  </div>
                  <div className="bg-muted rounded-lg h-20 mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      Logo Preview
                    </span>
                  </div>
                  <Button onClick={() => setCurrentView("design")}>
                    Open Studio
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-500" /> Dealers &
                      Suppliers
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find: t-shirt printer
                  </p>
                  <Button onClick={() => setCurrentView("dealers")}>
                    Find Dealers
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Megaphone className="h-5 w-5 text-orange-500" />{" "}
                      Marketing Kit
                    </h3>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">Instagram</Badge>
                    <Badge variant="outline">Facebook</Badge>
                    <Badge variant="outline">TikTok</Badge>
                    <Badge variant="outline">Youtube</Badge>
                    <Badge variant="outline">....</Badge>
                  </div>
                  <Button onClick={() => setCurrentView("marketing")}>
                    Generate Copy
                  </Button>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Suggested Next Steps</h3>
                <div className="space-y-3">
                  {[
                    { label: "Create Project", completed: true },
                    { label: "Generate Plan", completed: false, current: true },
                    { label: "Generate Designs", completed: false },
                    { label: "Find Dealers", completed: false },
                    { label: "Create Marketing Kit", completed: false },
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {step.completed ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : step.current ? (
                        <div className="h-4 w-4 rounded-full border-2 border-primary bg-primary/20" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span
                        className={`text-sm ${step.current ? "font-medium" : ""}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{currentProject?.progress || 75}% Complete</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${currentProject?.progress || 75}%` }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PlanView() {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              </Button>
              <h1 className="text-3xl font-bold ml-4">
              Business Plan & Revenue
              </h1>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card className="p-4">
                  <nav className="space-y-2">
                    {[
                      {
                        id: "executive",
                        label: "Executive Summary",
                        icon: FileText,
                      },
                      { id: "audience", label: "Target Audience", icon: Users },
                      {
                        id: "costs",
                        label: "Costs",
                        icon: DollarSign,
                        current: true,
                      },
                      { id: "market", label: "Go-to-Market", icon: TrendingUp },
                      { id: "operations", label: "Operations", icon: Upload },
                    ].map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setSelectedPlanSection(section.id)}
                        className={`w-full flex items-center gap-2 p-2 rounded text-left ${
                          selectedPlanSection === section.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <section.icon className="h-4 w-4" />
                        <span className="text-sm">{section.label}</span>
                      </button>
                    ))}
                  </nav>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {selectedPlanSection === "executive" &&
                        "Executive Summary"}
                      {selectedPlanSection === "audience" && "Target Audience"}
                      {selectedPlanSection === "costs" && "Costs"}
                      {selectedPlanSection === "market" &&
                        "Go-to-Market Strategy"}
                      {selectedPlanSection === "operations" && "Operations"}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedPlanSection === "executive" &&
                        businessPlan.executiveSummary}
                      {selectedPlanSection === "audience" &&
                        businessPlan.targetAudience}
                      {selectedPlanSection === "costs" && businessPlan.costs}
                      {selectedPlanSection === "market" &&
                        businessPlan.goToMarket}
                      {selectedPlanSection === "operations" &&
                        businessPlan.operations}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() =>
                        regenerateSection(
                          selectedPlanSection as keyof BusinessPlan,
                        )
                      }
                    >
                      Regenerate section
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">
                    Cost/Revenue Calculator
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    (Ballpark figures for demo)
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Unit Cost:</label>
                      <Input
                        type="number"
                        value={financialData.unitCost}
                        onChange={(e) =>
                          updateFinancialData(
                            "unitCost",
                            Number(e.target.value),
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Selling Price:
                      </label>
                      <Input
                        type="number"
                        value={financialData.sellingPrice}
                        onChange={(e) =>
                          updateFinancialData(
                            "sellingPrice",
                            Number(e.target.value),
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Setup Budget:
                      </label>
                      <Input
                        type="number"
                        value={financialData.setupBudget}
                        onChange={(e) =>
                          updateFinancialData(
                            "setupBudget",
                            Number(e.target.value),
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Monthly Orders:
                      </label>
                      <Input
                        type="number"
                        value={financialData.monthlyOrders}
                        onChange={(e) =>
                          updateFinancialData(
                            "monthlyOrders",
                            Number(e.target.value),
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Gross Margin:</span>
                        <span className="text-sm font-medium">
                          {financialData.grossMargin.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Break-even Point:</span>
                        <span className="text-sm font-medium">
                          {financialData.breakEvenPoint} Units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payback Period:</span>
                        <span className="text-sm font-medium">
                          {financialData.paybackPeriod}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Add Assumption
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function DesignView() {
    const [brandName, setBrandName] = useState("");
    const [tagline, setTagline] = useState("");
    const [designedFor, setDesignedFor] = useState("");
    const [graphicIdea, setGraphicIdea] = useState("");
    const [ideaMode, setIdeaMode] = useState<"text" | "image">("text");
    const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [imageScale, setImageScale] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleGenerate = () => {
      // Demo: create placeholder SVG data URLs representing generated logos
      const makeSvg = (text: string, bg: string) =>
        `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>
            <rect width='100%' height='100%' rx='24' ry='24' fill='${bg}'/>
            <text x='50%' y='48%' dominant-baseline='middle' text-anchor='middle' fill='#2d2a26' font-family='Inter, system-ui' font-size='28' font-weight='700'>${text}</text>
            <text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' fill='#4b3b2c' font-family='Inter, system-ui' font-size='14'>CraftConnect</text>
          </svg>`
        )}`;
      const base = brandName || "LOGO";
      const ideas = ["A", "B", "C", "D", "E", "F"]; // 6 samples
      const palette = ["#efe0d3", "#e8d5c0", "#d4c4b0", "#c9b5a0", "#f5f0e8", "#e9e1d9"];
      const imgs = ideas.map((suffix, i) => makeSvg(`${base} ${suffix}`.trim(), palette[i % palette.length]));
      setGeneratedLogos(imgs);
    };

    const buildInspiredPrompt = () => {
      const parts: string[] = [];
      if (brandName.trim()) parts.push(`Brand: ${brandName.trim()}`);
      if (tagline.trim()) parts.push(`Tagline: "${tagline.trim()}"`);
      if (designedFor.trim()) parts.push(`For: ${designedFor.trim()}`);
      const core = parts.length ? parts.join(" • ") : "A fresh modern startup";
      return `${core} — minimalist logo mark, strong silhouette, clean geometry, balanced negative space, scalable, works on light and dark backgrounds.`;
    };

    const handleInspire = () => {
      setIdeaMode("text");
      setGraphicIdea(buildInspiredPrompt());
    };

    const downloadImage = (src: string, name: string) => {
      const link = document.createElement("a");
      link.href = src;
      link.download = `${name}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
          setImageScale(1);
          setImagePosition({ x: 0, y: 0 });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
        setImagePosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setImageScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
    };

    const removeImage = () => {
      setUploadedImage(null);
      setImageScale(1);
      setImagePosition({ x: 0, y: 0 });
    };

    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              </Button>
              <h1 className="text-3xl font-bold ml-4">Design Studio</h1>
            </div>

            <Tabs
              value={designTab}
              onValueChange={setDesignTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="mockups">Mockups</TabsTrigger>
              </TabsList>

              <div className="grid lg:grid-cols-6 gap-7 mt-6">
                <div className="lg:col-span-3">
                  <Card className="p-6">
                    <TabsContent value="branding">
                      <h3 className="font-semibold mb-4">Generate Logo</h3>
                      <div className="space-y-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left column: text inputs */}
                          <div className="space-y-3">
                                <div className="relative">
                                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                  </div>
                                  <Input
                                    placeholder="Enter Brand Name"
                                    className="pl-9 rounded-lg shadow-sm placeholder:text-muted-foreground/70"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                  />
                        </div>
                                <div className="relative">
                                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Edit className="h-4 w-4" />
                      </div>
                                  <Input
                                    placeholder="Enter a tagline in the logo"
                                    className="pl-9 rounded-lg shadow-sm placeholder:text-muted-foreground/70"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                  />
                                </div>
                                <div className="relative">
                                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Briefcase className="h-4 w-4" />
                                  </div>
                                  <Input
                                    placeholder="Designed for - Your business or product"
                                    className="pl-9 rounded-lg shadow-sm placeholder:text-muted-foreground/70"
                                    value={designedFor}
                                    onChange={(e) => setDesignedFor(e.target.value)}
                                  />
                                </div>
                              </div>

                          {/* Right column: idea + toggle */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className={`flex-1 px-3 py-1.5 text-sm rounded-full border ${ideaMode === "text" ? "bg-foreground text-white border-foreground" : "bg-background border-border"}`}
                                onClick={() => setIdeaMode("text")}
                              >
                                Text Idea
                              </button>
                              <button
                                type="button"
                                className={`flex-1 px-3 py-1.5 text-sm rounded-full border ${ideaMode === "image" ? "bg-foreground text-white border-foreground" : "bg-background border-border"}`}
                                onClick={() => setIdeaMode("image")}
                              >
                                Image To Logo
                              </button>
                          </div>
                            {ideaMode === "text" ? (
                              <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-3 text-muted-foreground">
                                  <Lightbulb className="h-4 w-4" />
                        </div>
                                <textarea
                                  rows={6}
                                  placeholder="Describe a key element (e.g., lion with crown)"
                                  className="w-full rounded-lg border border-input bg-background p-3 pl-9 text-sm shadow-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[132px]"
                                  value={graphicIdea}
                                  onChange={(e) => setGraphicIdea(e.target.value)}
                                />
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {!uploadedImage ? (
                                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                    <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                                    <p className="text-xs text-muted-foreground">Drop an image here or browse</p>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                      className="hidden"
                                      id="image-upload"
                                      aria-label="Upload image for logo generation"
                                    />
                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => document.getElementById('image-upload')?.click()}>
                                      Browse Files
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="relative w-32 h-32 mx-auto">
                                      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100">
                                        <div
                                          className="absolute inset-0 cursor-move select-none"
                                          onMouseDown={handleMouseDown}
                                          onMouseMove={handleMouseMove}
                                          onMouseUp={handleMouseUp}
                                          onMouseLeave={handleMouseUp}
                                          onWheel={handleWheel}
                                style={{
                                            transform: `scale(${imageScale}) translate(${imagePosition.x / imageScale}px, ${imagePosition.y / imageScale}px)`,
                                            transformOrigin: 'center center',
                                          }}
                                        >
                                          <img
                                            src={uploadedImage}
                                            alt="Uploaded"
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                          />
                        </div>

                                        {/* Close button - positioned outside the circular frame */}
                                        <button
                                          onClick={removeImage}
                                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:scale-110 transition-all duration-200 z-10 border-2 border-white"
                                          aria-label="Remove image"
                                        >
                                          ×
                                        </button>
                                        
                                        {/* Score display - positioned outside the circular frame */}
                                        <div className="absolute -bottom-2 -left-2 px-2 py-1 bg-white text-gray-900 rounded-lg text-xs font-bold shadow-lg ring-2 ring-white/90 select-none min-w-[48px] text-center border border-gray-200">
                                          {imageScale.toFixed(2)}
                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      {/* placeholder to preserve vertical rhythm */}
                                    </div>
                                    <div className="text-center">
                                      <span className="text-xs text-gray-500">Drag to move • Scroll to zoom</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {ideaMode === "text" && (
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="rounded-full" onClick={handleInspire}>
                                  Inspire me
                          </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Button
                            className="rounded-full bg-[#8b6b4a] text-white hover:bg-[#7a5a3f] w-full md:w-auto px-6 py-2 transition-transform hover:scale-[1.02]"
                            onClick={handleGenerate}
                          >
                            <Star className="h-4 w-4 mr-2" /> Generate
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="mockups">
                      {(() => {
                        const [mockupPrompt, setMockupPrompt] = React.useState("");
                        const [aspect, setAspect] = React.useState<"16:9" | "1:1" | "9:16">("16:9");
                        const categories = [
                          "Festival",
                          "Logo-Mockup",
                          "Logo-Poster",
                          "Illustration",
                          "Portrait",
                          "Uniform",
                          "Product",
                          "Poster",
                          "3D",
                        ];
                        const [activeCat, setActiveCat] = React.useState<string>(categories[3]);

                        const sizeForAspect = (a: typeof aspect) => {
                          if (a === "1:1") return { w: 640, h: 640 };
                          if (a === "9:16") return { w: 540, h: 960 };
                          return { w: 960, h: 540 };
                        };

                        const generate = () => {
                          const { w, h } = sizeForAspect(aspect);
                          const make = (i: number) =>
                            `data:image/svg+xml;utf8,${encodeURIComponent(
                              `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
                                <rect width='100%' height='100%' rx='24' ry='24' fill='#f3f3f5'/>
                                <g font-family='Inter, system-ui' text-anchor='middle'>
                                  <text x='50%' y='45%' fill='#333' font-size='22' font-weight='700'>${activeCat}</text>
                                  <text x='50%' y='55%' fill='#555' font-size='12'>${aspect} • #${i + 1}</text>
                                </g>
                              </svg>`
                            )}`;
                          const imgs = Array.from({ length: 8 }, (_, i) => make(i));
                          // Push to global preview on the right panel
                          setGeneratedLogos(imgs);
                        };

                        return (
                          <div className="space-y-4">
                            <div>
                              <textarea
                                className="w-full h-40 rounded-xl border border-border p-3 text-sm"
                                placeholder="Generate 4 mockups of my logo in different coffee shop scenes."
                                value={mockupPrompt}
                                onChange={(e) => setMockupPrompt(e.target.value)}
                              />
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {categories.map((c) => (
                                <button
                                  key={c}
                                  className={`px-4 py-1.5 text-sm rounded-full border ${activeCat === c ? "bg-foreground text-white border-foreground" : "bg-background"}`}
                                  onClick={() => setActiveCat(c)}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">Aspect Ratio</p>
                              <div className="flex items-center gap-2">
                                {(["16:9", "1:1", "9:16"] as const).map((a) => (
                                  <button
                                    key={a}
                                    className={`px-3 py-1.5 text-xs rounded-full border ${aspect === a ? "bg-foreground text-white border-foreground" : "bg-background"}`}
                                    onClick={() => setAspect(a)}
                                  >
                                    {a}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <Button className="w-full rounded-full" onClick={generate}>
                              Generate
                        </Button>
                      </div>
                        );
                      })()}
                    </TabsContent>
                  </Card>
                </div>

                <div className="lg:col-span-3">
                  <Card className="p-6">
                    <div className="aspect-video bg-muted rounded-lg p-4">
                      {generatedLogos.length === 0 ? (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                          Generated logos will appear here
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 h-full overflow-auto">
                          {generatedLogos.map((src, idx) => (
                            <button
                              key={idx}
                              className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-background hover:shadow"
                              onClick={() => downloadImage(src, `${brandName || "logo"}-${idx + 1}`)}
                              aria-label="Download logo"
                            >
                              <img src={src} alt={`Generated logo ${idx + 1}`} className="h-full w-full object-cover" />
                              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/10 text-xs text-white">
                                Click to download
                      </div>
                            </button>
                          ))}
                    </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  function DealersView() {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              </Button>
              <h1 className="text-3xl font-bold ml-4">Dealers & Suppliers</h1>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Distance:</span>
                  <select className="border border-border rounded px-2 py-1 text-sm" aria-label="Distance filter">
                    <option>10km</option>
                    <option>25km</option>
                    <option>50km</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Rating:</span>
                  <select className="border border-border rounded px-2 py-1 text-sm" aria-label="Rating filter">
                    <option>4+ stars</option>
                    <option>3+ stars</option>
                    <option>All</option>
                  </select>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" /> Open Now
                </Button>
                <Button variant="outline" size="sm">
                  <Truck className="h-4 w-4 mr-2" /> Delivery
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {dealers.map((dealer) => (
                  <Card key={dealer.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{dealer.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(dealer.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {dealer.rating}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">{dealer.distance}</Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {dealer.services.map((service, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-4">
                      <p>{dealer.address}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" /> Call
                      </Button>
                      <Button size="sm">
                        <MapPin className="h-4 w-4 mr-2" /> Visit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Interactive map showing dealer locations
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-xs">You are here</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span className="text-xs">Dealers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function MarketingView() {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              </Button>
              <h1 className="text-3xl font-bold ml-4">Marketing Kit</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Platform Picker</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "Instagram",
                      "TikTok",
                      "Facebook",
                      "Twitter",
                      "LinkedIn",
                      "YouTube",
                    ].map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={["Instagram", "TikTok"].includes(
                            platform,
                          )}
                        />
                        <span className="text-sm">{platform}</span>
                      </label>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Ad Copy Generator</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium">Tone:</label>
                      <select className="w-full border border-border rounded px-2 py-1 mt-1" aria-label="Tone selection">
                        <option>Playful</option>
                        <option>Professional</option>
                        <option>Witty</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Angle:</label>
                      <select className="w-full border border-border rounded px-2 py-1 mt-1" aria-label="Angle selection">
                        <option>Environmental Impact</option>
                        <option>Quality Focus</option>
                        <option>Price Value</option>
                        <option>Lifestyle</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={generateMarketingCopy} className="mb-4">
                    Generate New Copy
                  </Button>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">{marketingContent.copy}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Copy
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Hashtag Set</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {marketingContent.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="outline">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    Copy All
                  </Button>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Poster Creative</h3>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Palette className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        AI-generated poster will appear here
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full">Generate Poster</Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">AI Scheduling Tips</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-1 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">
                          Best posting times:
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Instagram: 6-9 AM, 12-2 PM, 5-7 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 mt-1 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">
                          Target audience active:
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Weekdays 7-9 AM, Weekends 10 AM-2 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 mt-1 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">Engagement boost:</p>
                        <p className="text-xs text-muted-foreground">
                          Use stories 2-3 times daily for better reach
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ExportView() {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 pb-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentView("dashboard")}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              </Button>
              <h1 className="text-3xl font-bold ml-4">Export & Share</h1>
            </div>

            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6">
                Build your business plan pack
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">
                    Select sections to include:
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: "plan", label: "Business Plan", checked: true },
                      { id: "mockups", label: "Design Mockups", checked: true },
                      {
                        id: "dealers",
                        label: "Dealer Contacts",
                        checked: false,
                      },
                      {
                        id: "marketing",
                        label: "Marketing Materials",
                        checked: true,
                      },
                      {
                        id: "financial",
                        label: "Financial Projections",
                        checked: true,
                      },
                    ].map((section) => (
                      <label
                        key={section.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={section.checked}
                        />
                        <span className="text-sm">{section.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Export format:</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="format" defaultChecked />
                      <span className="text-sm">PDF</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="format" />
                      <span className="text-sm">Markdown</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Delivery:</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="delivery" defaultChecked />
                      <span className="text-sm">Download Now</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="delivery" />
                      <span className="text-sm">
                        Email to me ({currentUser?.email})
                      </span>
                    </label>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" /> Generate Export
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  function ProjectsView() {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Your Projects</h1>
              <Button onClick={() => setShowNewProjectModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Project
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        project.status === "active" ? "default" : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground mb-4">
                    <span>Created: {project.createdAt}</span>
                    <span>Modified: {project.lastModified}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setCurrentProject(project);
                        setCurrentView("dashboard");
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Open
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit project</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete project</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SettingsView() {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-10 pb-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name:</label>
                    <Input value={currentUser?.name} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email:</label>
                    <Input value={currentUser?.email} className="mt-1" />
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Read our{" "}
                    <a href="#" className="text-primary hover:underline">
                      Data Retention Statement
                    </a>
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Export all my data
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete my account
                    </Button>
                  </div>
                </div>
              </Card>

              <Button
                variant="outline"
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentUser(null);
                  setCurrentView("landing");
                  localStorage.removeItem('user');
                  window.dispatchEvent(new Event('auth:changed'));
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NewProjectModal />
      {currentView === "landing" && <LandingPage />}
      {currentView === "dashboard" && <WorkspaceDashboard />}
      {currentView === "plan" && <PlanView />}
      {currentView === "design" && <DesignView />}
      {currentView === "dealers" && <DealersView />}
      {currentView === "marketing" && <MarketingView />}
      {currentView === "export" && <ExportView />}
      {currentView === "projects" && <ProjectsView />}
      {currentView === "settings" && <SettingsView />}
    </div>
  );
}

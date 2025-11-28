import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Users, 
  GraduationCap, 
  Award, 
  Globe, 
  Heart,
  Building,
  CheckCircle2,
  Star,
  TrendingUp,
  Brain,
  Shield,
  Clock,
  MessageCircle,
  ChevronRight,
  Menu,
  X,
  Map,
  Sparkles,
  Trophy,
  Lightbulb,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IMAGES, getImage } from "@/config/images";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);

  const stats = [
    { value: "500+", label: "Healthcare Professionals Trained" },
    { value: "95%", label: "Placement Success Rate" },
    { value: "50+", label: "Partner Facilities" },
    { value: "4.9/5", label: "Average Rating" },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Comprehensive Training",
      description: "Industry-leading healthcare training programs tailored for the Northern Ireland and the UK NHS systems.",
      image: IMAGES.features.training,
    },
    {
      icon: Globe,
      title: "Cultural Proficiency",
      description: "Specialised cultural proficiency training ensuring smooth adaptation into Northern Ireland and the UK healthcare sector.",
      image: IMAGES.features.cultural,
    },
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalised culturally adaptive learning paths powered by advanced AI technology",
      image: IMAGES.features.aiLearning,
    },
    {
      icon: Award,
      title: "Certified Programs",
      description: "HSC and NHS approved certifications recognised across Northern Ireland and UK",
      image: IMAGES.features.certified,
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "24/7 support from experienced healthcare professionals and industry experts",
      image: IMAGES.features.support,
    },
    {
      icon: Shield,
      title: "Compliance Assured",
      description: "Full compliance with Northern Ireland HSC regulations and UK standards",
      image: IMAGES.features.compliance,
    },
  ];

  const services = [
    {
      title: "Healthcare Professional Training",
      description: "Comprehensive training programs for healthcare professional",
      features: ["Clinical Skills", "Northern Ireland HSC System", "NMC Standards", "Practical Assessments"],
      color: "from-blue-500 to-cyan-500",
      image: IMAGES.services.healthcare,
    },
    {
      title: "Cultural Adaptive Onboarding",
      description: "Essential cultural training for new healthcare professionals (relocated) to Northern Ireland, England, Scotland, and Wales.",
      features: ["Local Culture", "Communication Skills", "Patient Interaction", "Team Integration"],
      color: "from-purple-500 to-pink-500",
      image: IMAGES.services.cultural,
    },
    {
      title: "Recruitment & Placement",
      description: "Connect qualified healthcare professionals with top Northern Ireland HSC facilities",
      features: ["Job Matching", "Interview Preparation", "Documentation Support", "Onboarding Assistance"],
      color: "from-orange-500 to-red-500",
      image: IMAGES.services.recruitment,
    },
    {
      title: "C-SMART",
      description: "Cultural adaptive AI-powered training and management platform that enhances healthcare workforce development in culturally diverse and high-pressured environments to improve patient outcomes",
      features: [
        "Training & Development Pathways",
        "Staff Management & Retention", 
        "Cultural Adaptability & Integration",
        "Onboarding & Orientation",
        "Integration & Community Forums",
        "Career Progression Pathways",
        "Staff Appraisals",
        "Gamification & Cultural Journey Map"
      ],
      color: "from-teal-500 to-emerald-500",
      image: IMAGES.services.csmart,
    },
    {
      title: "Clinify-AI",
      description: "24/7 AI-powered medical communication companion with dialect recognition, multilingual support, and NHS-compliant safety layer",
      features: [
        "Medical Abbreviations & Terminology",
        "UK Dialect Recognition (Geordie, Scouse, Scottish, Welsh)",
        "Local Jargon Interpretation",
        "Cultural & Community Sensitivity",
        "Multilingual + Local Dialects (Polish, Urdu, Punjabi, Arabic)",
        "Compliance & Safety Layer (NHS/NICE Standards)"
      ],
      color: "from-indigo-500 to-violet-500",
      image: IMAGES.services.clinifyAi,
    },
    {
      title: "Complimentary E-learning Resources",
      description: "Get certified with HSC and NHS approved mandatory training courses recognised across Northern Ireland and the UK health sector",
      features: ["Cardiac Arrest and AED Awareness", "Health and Safety", "Food Safety and Hygiene", "Infection Prevention & Control"],
      color: "from-amber-500 to-yellow-500",
      image: IMAGES.services.elearning,
    },
    {
      title: "Benefits Management",
      description: "Comprehensive staff benefits administration and flexible marketplace for healthcare organisations",
      features: ["Staff Benefit Portals", "Flexible Benefits Marketplace", "Manager Cost Visibility", "Wellness Allowance"],
      color: "from-emerald-500 to-teal-500",
      image: IMAGES.services.healthcare, // Placeholder
    },
    {
      title: "Document Management & Storage",
      description: "Secure, compliant document repository with version control and full audit trails for inspections",
      features: ["Secure Repository", "E-Signatures & Audit Trails", "Compliance Evidence", "Easy Inspection Retrieval"],
      color: "from-blue-600 to-indigo-600",
      image: IMAGES.services.healthcare, // Placeholder
    },
    {
      title: "Employer of Record (EOR) Solutions",
      description: "Payroll and compliance outsourcing for healthcare providers with right-to-work verification",
      features: ["Payroll Outsourcing", "Right-to-Work Checks", "Contract Management", "Tax & Pension Compliance"],
      color: "from-violet-500 to-purple-500",
      image: IMAGES.services.healthcare, // Placeholder
    },
    {
      title: "Health & Safety",
      description: "AI-powered safety management with real-time hazard alerts and incident reporting",
      features: ["Risk Assessment", "Incident Reporting", "Real-time Hazard Alerts", "AI Safety Compliance Audits"],
      color: "from-red-500 to-rose-500",
      image: IMAGES.services.healthcare, // Placeholder
    },
    {
      title: "Mock Compliance Testing & Visits",
      description: "Prepare for RQIA & CQC inspections with AI-powered simulations and scoring",
      features: ["RQIA & CQC Simulation", "AI-Generated Reports", "Improvement Guidance", "Pre-Audit Preparation"],
      color: "from-orange-500 to-amber-500",
      image: IMAGES.services.healthcare, // Placeholder
    },
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      role: "Registered Nurse",
      content: "The training program was exceptional. I felt fully prepared to work in the Irish healthcare system from day one.",
      rating: 5,
      avatar: IMAGES.testimonials.maria,
    },
    {
      name: "John Kumar",
      role: "Healthcare Assistant",
      content: "Cultural Staffing Solutions made my transition to Ireland seamless. The support was incredible throughout.",
      rating: 5,
      avatar: IMAGES.testimonials.john,
    },
    {
      name: "Dr. Sarah O'Brien",
      role: "Hospital Administrator",
      content: "We've hired several professionals through CSS. They arrive well-trained and culturally aware.",
      rating: 5,
      avatar: IMAGES.testimonials.sarah,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16 w-full">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <Button
                onClick={() => setWaitlistModalOpen(true)}
                className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
              >
                Join Our Waiting List <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button asChild variant="outline" size="sm" className="font-montserrat">
                <Link to="/login">
                  Login
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </a>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Testimonials
                </a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
                <Button
                  onClick={() => {
                    setWaitlistModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold w-full"
                >
                  Join Our Waiting List <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button asChild variant="outline" className="font-montserrat w-full">
                  <Link to="/login">
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-css-white via-background to-css-grey-light relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={getImage('hero.background', { width: 1920, height: 1080, quality: 85 })}
            alt="Healthcare professionals"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <img
                src="/images/logos/csmart-logo.svg"
                alt="C-Smart"
                className="h-20 md:h-24 w-auto object-contain"
              />
            </div>
            <Badge className="bg-css-gold/10 text-css-gold border-css-gold">
              A Cultural Staffing Solutions Platform
            </Badge>
            <h1 className="font-montserrat font-bold text-4xl md:text-6xl lg:text-7xl text-foreground">
              Empowering Healthcare
              <span className="block text-transparent bg-clip-text bg-gradient-gold">
                Through Excellence
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Equiping healthcare professionals and bridging cultural gaps in diverse multicultural, 
              high-pressured environments with culturally adaptive AI-powered solutions to thrive in the UK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
                onClick={() => setWaitlistModalOpen(true)}
              >
                Join Our Waiting List <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="font-montserrat">
                <Link to="/login" className="flex items-center">
                  Login to Portal <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-montserrat font-bold text-3xl md:text-4xl text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-foreground mb-4">
              Why Choose C-Smart?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide culturally adaptive holistic solutions that ensure healthcare professionals thrive in Northern Ireland and the UK.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-css-black" />
                  </div>
                  <CardTitle className="font-montserrat">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Journey Map Section - Featured */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-amber-400 rounded-full" />
          <div className="absolute top-40 right-20 w-24 h-24 border-2 border-amber-400 rounded-full" />
          <div className="absolute bottom-20 left-1/4 w-20 h-20 border-2 border-amber-400 rounded-full" />
          <div className="absolute bottom-40 right-1/3 w-28 h-28 border-2 border-amber-400 rounded-full" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Gamified Learning Experience
              </Badge>
              
              <h2 className="font-montserrat font-bold text-4xl md:text-5xl">
                Cultural Journey Map
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Your Passport to Excellence
                </span>
              </h2>
              
              <p className="text-lg text-slate-300">
                Embark on a gamified learning journey where you collect stamps, unlock cultural insights, 
                and earn your <strong className="text-amber-400">Cultural Intelligence Certificate</strong> — 
                CPD accredited and recognised across the UK healthcare sector.
              </p>
              
              <div className="italic text-slate-400 border-l-4 border-amber-500 pl-4">
                "You are not just completing modules — you are travelling through culture 
                and earning recognition for your journey."
              </div>
              
              {/* Milestones Preview */}
              <div className="space-y-3 pt-4">
                <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider">5 Cultural Milestones</p>
                <div className="flex flex-wrap gap-2">
                  {['Communication', 'Respect', 'Cultural Humility', 'Dual-Culture Dynamics', 'Patient-Centred Care'].map((milestone, i) => (
                    <span 
                      key={milestone}
                      className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                    >
                      {milestone}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-bold shadow-lg shadow-amber-500/25"
                onClick={() => setWaitlistModalOpen(true)}
              >
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Right - Passport Visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Passport Card */}
                <div className="w-72 md:w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-4 border-amber-500 p-6 transform hover:scale-105 transition-transform duration-300">
                  {/* Gold Stripe */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-t-xl" />
                  
                  {/* Passport Header */}
                  <div className="text-center mb-6 pt-2">
                    <Globe className="h-16 w-16 text-amber-400 mx-auto mb-2" />
                    <p className="text-amber-400 font-bold tracking-widest text-sm">CULTURAL</p>
                    <p className="text-amber-400 font-bold tracking-wider text-xs">PASSPORT</p>
                  </div>
                  
                  {/* Stamp Collection Preview */}
                  <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                    <p className="text-slate-400 text-xs text-center mb-3">Collect Stamps as You Learn</p>
                    <div className="grid grid-cols-4 gap-2">
                      {['🎧', '👐', '🙏', '🪞', '🌍', '📝', '💊', '⚖️'].map((stamp, i) => (
                        <div 
                          key={i}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                            i < 4 
                              ? 'bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 shadow-md' 
                              : 'bg-slate-600/50 border-2 border-dashed border-slate-500 opacity-50'
                          }`}
                        >
                          {stamp}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <Trophy className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                      <p className="text-white text-xs font-semibold">17</p>
                      <p className="text-slate-400 text-[10px]">Stamps</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <Lightbulb className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                      <p className="text-white text-xs font-semibold">17</p>
                      <p className="text-slate-400 text-[10px]">Insights</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <BookOpen className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-white text-xs font-semibold">17</p>
                      <p className="text-slate-400 text-[10px]">Pro Tips</p>
                    </div>
                  </div>
                  
                  {/* Certificate Badge */}
                  <div className="mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg p-3 border border-amber-500/30">
                    <div className="flex items-center gap-2">
                      <Award className="h-6 w-6 text-amber-400" />
                      <div>
                        <p className="text-amber-400 font-bold text-sm">Cultural Intelligence Certificate</p>
                        <p className="text-slate-400 text-xs">CPD Accredited</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded-full text-sm shadow-lg animate-bounce">
                  NEW!
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Complete All</p>
                      <p className="text-slate-400 text-[10px]">Earn Your Certificate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinify-AI Feature Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-4 py-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                AI-Powered Healthcare Communication
              </Badge>
              
              <h2 className="font-montserrat font-bold text-4xl md:text-5xl">
                Clinify-AI
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Your Medical Communication Companion
                </span>
              </h2>
              
              <p className="text-lg text-slate-300">
                24/7 AI-powered assistant that bridges language barriers, interprets local healthcare jargon, 
                and ensures <strong className="text-indigo-300">NHS/NICE compliant</strong> communication 
                across diverse UK communities.
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/25"
                onClick={() => setWaitlistModalOpen(true)}
              >
                Try Clinify-AI <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Right - Feature Cards */}
            <div className="space-y-4">
              {/* Feature 1 - Dialect Recognition */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🎙️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">UK Dialect Recognition</h3>
                    <p className="text-sm text-slate-300">Understands Geordie, Scouse, Scottish, Welsh & West Country accents. Adapts speech-to-text for accuracy.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 - Local Jargon */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Local Jargon Interpretation</h3>
                    <p className="text-sm text-slate-300">Converts hospital slang to clinical language and back. Plain English translations for patient understanding.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 3 - Cultural Sensitivity */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shrink-0">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Cultural & Community Sensitivity</h3>
                    <p className="text-sm text-slate-300">Adjusts phrasing for dietary restrictions, taboos & sensitive conditions across diverse cultural backgrounds.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 4 - Multilingual */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Multilingual + Local Dialects</h3>
                    <p className="text-sm text-slate-300">Polish, Urdu, Punjabi, Arabic & more. Bridges staff ↔ patient gaps where interpreters aren't available.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature 5 - Compliance */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Compliance & Safety Layer</h3>
                    <p className="text-sm text-slate-300">All translations meet NHS/NICE standards. Safe prescription terminology & care instruction verification.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Culturally adaptive holistic solutions tailored for healthcare excellence
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-card overflow-hidden group">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-60`} />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-montserrat font-bold text-2xl">{service.title}</h3>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardDescription className="text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Success stories from healthcare professionals and facilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-card">
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <CardDescription className="text-foreground">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-montserrat font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-css-gold/10 via-background to-css-grey-light">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our waiting list or access your training portal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
              onClick={() => setWaitlistModalOpen(true)}
            >
              Join Our Waiting List <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="font-montserrat">
              <Link to="/login" className="flex items-center">
                Login to Portal <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5 text-css-gold" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-5 w-5 text-css-gold" />
              <span className="text-sm">HSC Certified</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="h-5 w-5 text-css-gold" />
              <span className="text-sm">Career Growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-css-black text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/images/logos/csmart-logo.svg"
                  alt="C-Smart"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <p className="text-sm text-gray-400">
                AI-powered healthcare training and management platform by Cultural Staffing Solutions
              </p>
            </div>

            <div>
              <h4 className="font-montserrat font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-css-gold transition-colors">Features</a></li>
                <li><a href="#services" className="hover:text-css-gold transition-colors">Services</a></li>
                <li><a href="#testimonials" className="hover:text-css-gold transition-colors">Testimonials</a></li>
                <li><Link to="/login" className="hover:text-css-gold transition-colors">Portal Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-montserrat font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Healthcare Training</li>
                <li>Cultural Integration</li>
                <li>Recruitment</li>
                <li>Compliance Support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-montserrat font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📍 Belfast, Northern Ireland</li>
                <li>📧 info@culturalstaffing.co.uk</li>
                <li>📞 +44 28 9012 3456</li>
                <li className="flex gap-4 pt-2">
                  <Building className="h-5 w-5 hover:text-css-gold cursor-pointer transition-colors" />
                  <Users className="h-5 w-5 hover:text-css-gold cursor-pointer transition-colors" />
                  <Heart className="h-5 w-5 hover:text-css-gold cursor-pointer transition-colors" />
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Cultural Staffing Solutions. All rights reserved.</p>
            <p className="mt-2">
              <a href="#" className="hover:text-css-gold transition-colors">Privacy Policy</a>
              {" • "}
              <a href="#" className="hover:text-css-gold transition-colors">Terms of Service</a>
              {" • "}
              <a href="#" className="hover:text-css-gold transition-colors">Cookie Policy</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      <Dialog open={waitlistModalOpen} onOpenChange={setWaitlistModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <WaitlistForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
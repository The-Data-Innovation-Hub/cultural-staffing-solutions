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
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IMAGES, getImage } from "@/config/images";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      description: "Industry-leading healthcare training programs tailored for the Northern Ireland NHS system",
      image: IMAGES.features.training,
    },
    {
      icon: Globe,
      title: "Cultural Integration",
      description: "Specialized cultural sensitivity training ensuring smooth integration into Northern Ireland healthcare",
      image: IMAGES.features.cultural,
    },
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized learning paths powered by advanced AI technology",
      image: IMAGES.features.aiLearning,
    },
    {
      icon: Award,
      title: "Certified Programs",
      description: "HSC-approved certifications recognized across Northern Ireland and UK",
      image: IMAGES.features.certified,
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "24/7 support from experienced healthcare professionals",
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
      description: "Comprehensive training programs for nurses, care assistants, and healthcare workers",
      features: ["Clinical Skills", "Northern Ireland HSC System", "NMC Standards", "Practical Assessments"],
      color: "from-blue-500 to-cyan-500",
      image: IMAGES.services.healthcare,
    },
    {
      title: "Cultural Orientation Program",
      description: "Essential cultural training for international healthcare workers in Northern Ireland",
      features: ["Northern Ireland Culture", "Communication Skills", "Patient Interaction", "Team Integration"],
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold">
                <span className="text-css-black font-montserrat font-bold text-sm">CSS</span>
              </div>
              <div>
                <h1 className="font-montserrat font-bold text-lg text-foreground">
                  Cultural Staffing Solutions
                </h1>
              </div>
            </div>

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
              <Button asChild className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold">
                <Link to="/login">
                  Login <ArrowRight className="ml-2 h-4 w-4" />
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
                <Button asChild className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold w-full">
                  <Link to="/login">
                    Login <ArrowRight className="ml-2 h-4 w-4" />
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
            <Badge className="bg-css-gold/10 text-css-gold border-css-gold">
              Northern Ireland's Premier Healthcare Staffing Solution
            </Badge>
            <h1 className="font-montserrat font-bold text-4xl md:text-6xl lg:text-7xl text-foreground">
              Empowering Healthcare
              <span className="block text-transparent bg-clip-text bg-gradient-gold">
                Through Excellence
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Bridging the gap between international healthcare talent and Northern Ireland HSC facilities 
              with comprehensive training, cultural integration, and AI-powered learning solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold">
                <Link to="/login" className="flex items-center">
                  Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="font-montserrat">
                <a href="#services" className="flex items-center">
                  Learn More <ChevronRight className="ml-2 h-5 w-5" />
                </a>
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
              Why Choose Cultural Staffing Solutions?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive solutions that ensure healthcare professionals thrive in Ireland
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

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions tailored for healthcare excellence
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
            Ready to Transform Your Healthcare Career?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of healthcare professionals who have successfully integrated into the Irish healthcare system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold">
              <Link to="/login" className="flex items-center">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="font-montserrat">
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Us
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5 text-css-gold" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-5 w-5 text-css-gold" />
              <span className="text-sm">HSE Certified</span>
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
                <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
                  <span className="text-css-black font-montserrat font-bold text-sm">CSS</span>
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg">
                    Cultural Staffing
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Ireland's premier healthcare staffing and training solution
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
            <p>&copy; 2024 Cultural Staffing Solutions. All rights reserved.</p>
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
    </div>
  );
};

export default LandingPage;
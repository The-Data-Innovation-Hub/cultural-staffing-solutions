import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, AlertCircle, Loader2, Mic, Globe, BookOpen, Shield, Languages, MessageSquare, HeartHandshake, Stethoscope, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chatWithGPT, isOpenAIConfigured, ChatMessage } from "@/services/openai";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Clinify-AI Features Configuration
const CLINIFY_FEATURES = [
  {
    id: "dialect",
    title: "UK Dialect Recognition",
    description: "Understands UK regional accents including Geordie, Scouse, Scottish, Welsh, and West Country dialects.",
    icon: Mic,
    color: "from-blue-500 to-cyan-500",
    capabilities: [
      "Speech-to-text adaptation for regional accents",
      "Text-to-speech with accent awareness",
      "Real-time transcription accuracy",
      "Voice command interpretation"
    ],
    examplePrompt: "What are common Geordie terms for feeling unwell, and how should I respond to them in a clinical setting?",
    chatContext: "I'm helping you with UK dialect recognition. I can interpret regional accents like Geordie, Scouse, Scottish, Welsh, and West Country. What would you like to know?"
  },
  {
    id: "jargon",
    title: "Local Jargon Interpretation",
    description: "Maps common local healthcare terms, slang, and shorthand used in hospitals, ambulance services, and care homes.",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    capabilities: [
      "Converts jargon to standardised clinical language",
      "Reverse translation: clinical terms to plain English",
      "Hospital shorthand dictionary",
      "Care home terminology mapping"
    ],
    examplePrompt: "What does 'PRN' mean and how do I explain it to a patient in plain English?",
    chatContext: "I'm ready to help with local healthcare jargon. I can convert hospital slang to clinical language or translate medical terms into plain English. What term would you like me to interpret?"
  },
  {
    id: "cultural",
    title: "Cultural & Community Sensitivity",
    description: "Recognises that health terms can have different cultural interpretations and adjusts phrasing accordingly.",
    icon: HeartHandshake,
    color: "from-rose-500 to-orange-500",
    capabilities: [
      "Culture-aware term interpretation",
      "Dietary restriction awareness",
      "Sensitive condition phrasing",
      "Taboo topic navigation"
    ],
    examplePrompt: "How do I sensitively discuss end-of-life care with a Muslim family, respecting their cultural and religious beliefs?",
    chatContext: "I'm here to help with culturally sensitive communication. I can advise on dietary restrictions, sensitive topics, and appropriate phrasing for diverse cultural backgrounds. How can I assist?"
  },
  {
    id: "multilingual",
    title: "Multilingual + Local Dialects",
    description: "Goes beyond major languages to include local dialects spoken in UK communities.",
    icon: Languages,
    color: "from-emerald-500 to-teal-500",
    capabilities: [
      "Polish, Urdu, Punjabi, Arabic support",
      "Local dialect variations",
      "Staff ↔ patient gap bridging",
      "Interpreter assistance mode"
    ],
    examplePrompt: "How do I explain 'blood pressure monitoring' in Urdu to a patient who doesn't speak English?",
    chatContext: "I can help bridge language gaps with multilingual support including Polish, Urdu, Punjabi, Arabic, and local UK dialects. What would you like to translate or communicate?"
  },
  {
    id: "compliance",
    title: "Compliance & Safety Layer",
    description: "Ensures all translated and localised terms meet NHS/NICE compliance standards.",
    icon: Shield,
    color: "from-amber-500 to-yellow-500",
    capabilities: [
      "NHS/NICE standards compliance",
      "Safe prescription terminology",
      "Treatment instruction accuracy",
      "Care instruction verification"
    ],
    examplePrompt: "Is this prescription instruction 'Take 2 tablets TDS with food' compliant with NHS standards? How should I communicate it safely?",
    chatContext: "I'm focused on NHS/NICE compliance and safety. I can verify prescription terminology, treatment instructions, and ensure all communication meets healthcare standards. What would you like me to check?"
  },
  {
    id: "medical-terms",
    title: "Medical Dictionary & Terminology",
    description: "Comprehensive medical abbreviations, acronyms, and terminology database with instant lookup.",
    icon: BookOpen,
    color: "from-indigo-500 to-violet-500",
    capabilities: [
      "NHS medical abbreviations",
      "Clinical acronym decoder",
      "Drug name translations",
      "Procedure terminology"
    ],
    linkTo: "/employee/abbreviations",
    examplePrompt: "What does the abbreviation 'SOB' mean in a clinical context?",
    chatContext: "I can help you decode medical abbreviations, acronyms, drug names, and procedure terminology. What term would you like me to look up?"
  }
];

const AIGuru = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m Clinify AI, your medical communication companion. 🩺\n\nI can help you with:\n• **UK Dialect Recognition** - Geordie, Scouse, Scottish, Welsh accents\n• **Medical Jargon Translation** - Convert clinical terms to plain English\n• **Multilingual Support** - Polish, Urdu, Punjabi, Arabic and more\n• **Cultural Sensitivity** - Appropriate phrasing for diverse communities\n• **NHS/NICE Compliance** - Safe, standardised terminology\n\nHow can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isConfigured = isOpenAIConfigured();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!isConfigured) {
      toast.error('OpenAI API key is not configured. Please contact your administrator.');
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatWithGPT([...messages, userMessage]);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get AI response');
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again later or contact support if the issue persists.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle feature card click - switch to chat with feature context only
  const handleFeatureClick = (feature: typeof CLINIFY_FEATURES[0]) => {
    // Don't process if it has a linkTo (Medical Dictionary goes to different page)
    if (feature.linkTo) return;
    
    // Replace all messages with just the feature context (no welcome message)
    const contextMessage: ChatMessage = {
      role: 'assistant',
      content: `🎯 **${feature.title}**\n\n${feature.chatContext}`
    };
    
    setMessages([contextMessage]);
    setActiveTab('chat');
    
    // Focus the input after a short delay
    setTimeout(() => {
      const inputEl = document.querySelector('input[placeholder*="medical terms"]') as HTMLInputElement;
      if (inputEl) inputEl.focus();
    }, 100);
  };

  const suggestedQuestions = [
    "Translate 'nil by mouth' into plain English for a patient",
    "What does 'TDS' mean in prescription terms?",
    "How do I explain a diagnosis sensitively to a Punjabi-speaking family?",
    "What are common Geordie terms for feeling unwell?",
    "Convert 'PRN medication' to patient-friendly language"
  ];

  const [activeTab, setActiveTab] = useState("features");

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <img
            src="/clinify-ai-logo.png"
            alt="Clinify AI"
            className="h-20 w-auto object-contain"
          />
        </div>
        <h1 className="text-3xl font-montserrat font-bold text-foreground mb-2">
          Clinify AI Healthcare Assistant
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Your 24/7 AI-powered medical communication companion with UK dialect recognition, 
          multilingual support, and NHS-compliant safety layer
        </p>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            <Mic className="h-3 w-3 mr-1" /> Dialect Recognition
          </Badge>
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            <Languages className="h-3 w-3 mr-1" /> Multilingual
          </Badge>
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            <Shield className="h-3 w-3 mr-1" /> NHS Compliant
          </Badge>
        </div>
      </div>

      {!isConfigured && (
        <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            The AI assistant is not configured. Please add your OpenAI API key to the .env file to enable this feature.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="features" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <Bot className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="animate-in fade-in duration-300">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {CLINIFY_FEATURES.map((feature) => {
              const IconComponent = feature.icon;
              const isClickable = !feature.linkTo;
              return (
                <Card 
                  key={feature.id} 
                  className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${isClickable ? 'cursor-pointer hover:scale-[1.02] hover:border-primary/50' : ''}`}
                  onClick={isClickable ? () => handleFeatureClick(feature) : undefined}
                >
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {feature.title}
                          {isClickable && (
                            <Badge variant="outline" className="text-xs font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to try
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          {capability}
                        </li>
                      ))}
                    </ul>
                    {feature.linkTo ? (
                      <Link to={feature.linkTo} onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" className="w-full mt-4 group-hover:bg-muted">
                          Open Medical Dictionary
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`w-full mt-4 group-hover:bg-gradient-to-r group-hover:${feature.color} group-hover:text-white group-hover:border-transparent transition-all`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeatureClick(feature);
                        }}
                      >
                        Try this feature
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Start CTA */}
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Ready to Try Clinify AI?</h3>
                  <p className="text-indigo-100">
                    Ask questions in any UK dialect, get translations, or decode medical jargon instantly.
                  </p>
                </div>
                <Button 
                  onClick={() => setActiveTab("chat")}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shrink-0"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Start Chatting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-css-gold" />
                    Chat with Clinify AI
                  </CardTitle>
                  <CardDescription>
                    Ask about medical terminology, get dialect translations, or decode healthcare jargon
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 p-0 flex flex-col">
                  <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`flex gap-3 max-w-[80%] ${
                              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                message.role === 'user'
                                  ? 'bg-gradient-gold text-css-black'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {message.role === 'user' ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                            </div>
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                message.role === 'user'
                                  ? 'bg-gradient-gold text-css-black'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Bot className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="rounded-lg px-4 py-2 bg-muted">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask about medical terms, dialects, or translations..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading || !isConfigured}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim() || !isConfigured}
                        className="bg-gradient-gold text-css-black hover:bg-css-gold"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Try These Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs h-auto py-2 px-3 whitespace-normal"
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isLoading || !isConfigured}
                    >
                      <span className="block text-left">{question}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Clinify AI Can Help With</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p className="flex items-center gap-2">
                      <Mic className="h-3 w-3 text-blue-500" />
                      UK regional dialect interpretation
                    </p>
                    <p className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3 text-purple-500" />
                      Healthcare jargon translation
                    </p>
                    <p className="flex items-center gap-2">
                      <HeartHandshake className="h-3 w-3 text-rose-500" />
                      Culturally sensitive phrasing
                    </p>
                    <p className="flex items-center gap-2">
                      <Languages className="h-3 w-3 text-emerald-500" />
                      Multilingual medical terms
                    </p>
                    <p className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-amber-500" />
                      NHS/NICE compliant terminology
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
                <CardHeader>
                  <CardTitle className="text-sm text-white">Safety Notice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-300">
                    Clinify AI provides guidance based on NHS/NICE standards. All translations are 
                    designed to be safe for clinical use. However, always verify critical medical 
                    instructions with qualified professionals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIGuru;
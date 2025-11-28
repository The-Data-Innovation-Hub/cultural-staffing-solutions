import { useState } from "react";
import { 
  Sparkles, 
  Globe2, 
  Trophy, 
  Users, 
  MapPin, 
  Flame,
  Star,
  Medal,
  Bell,
  CheckCircle2,
  ChevronRight,
  Zap,
  Target,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Regional data
const REGIONS = [
  { id: 'england', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', system: 'NHS England', cities: 'London, Birmingham, Manchester' },
  { id: 'scotland', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', system: 'NHS Scotland', cities: 'Edinburgh, Glasgow, Aberdeen' },
  { id: 'wales', name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', system: 'NHS Wales', cities: 'Cardiff, Swansea, Newport' },
  { id: 'northern-ireland', name: 'Northern Ireland', flag: '🇬🇧', system: 'HSC', cities: 'Belfast, Derry, Lisburn' },
  { id: 'ireland', name: 'Ireland', flag: '🇮🇪', system: 'HSE', cities: 'Dublin, Cork, Galway' },
];

// XP rewards
const XP_REWARDS = [
  { action: 'Complete Module', xp: 100, icon: '📖' },
  { action: 'Write Reflection', xp: 50, icon: '✍️' },
  { action: 'Earn Badge', xp: 500, icon: '🏅' },
  { action: '7-Day Streak', xp: 200, icon: '🔥' },
  { action: '30-Day Streak', xp: 1000, icon: '⚡' },
  { action: 'Earn Certificate', xp: 2000, icon: '🎓' },
];

type TabType = 'regions' | 'leaderboard';

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('regions');

  const handleNotify = () => {
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-1 text-sm mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Phase 2 Coming Soon
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Your Journey
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              Gets Even Better
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            We're building exciting new features to enhance your cultural intelligence journey. 
            Get ready for regional tracks and friendly competition!
          </p>
        </div>

        {/* Feature Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1.5 inline-flex flex-wrap justify-center gap-1">
            <button
              onClick={() => setActiveTab('regions')}
              className={cn(
                "px-5 py-3 rounded-xl font-medium transition-all",
                activeTab === 'regions'
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Globe2 className="h-5 w-5 inline mr-2" />
              Regional Tracks
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={cn(
                "px-5 py-3 rounded-xl font-medium transition-all",
                activeTab === 'leaderboard'
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Trophy className="h-5 w-5 inline mr-2" />
              Peer Leaderboard
            </button>
          </div>
        </div>

        {/* Regional Tracks Section */}
        {activeTab === 'regions' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Card */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-slate-700 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4">
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      <MapPin className="h-3 w-3 mr-1" /> Phase 2.1
                    </Badge>
                    <h2 className="text-3xl font-bold text-white">
                      Country-Specific Cultural Onboarding
                    </h2>
                    <p className="text-slate-300">
                      Extend your cultural journey with region-specific tracks tailored to where 
                      you'll be working. Learn the nuances of local healthcare systems, dialects, 
                      and cultural expectations.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        <Flag className="h-3 w-3 mr-1" /> 5 Regions
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        <Star className="h-3 w-3 mr-1" /> Themed Stamps
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        <Medal className="h-3 w-3 mr-1" /> Regional Certificates
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Region Preview */}
                  <div className="w-full lg:w-auto">
                    <div className="grid grid-cols-3 gap-3">
                      {REGIONS.slice(0, 3).map((region, i) => (
                        <div 
                          key={region.id}
                          className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-slate-700/50 border border-slate-600 shadow-lg transition-transform hover:scale-110",
                            i === 1 && "transform -translate-y-2"
                          )}
                        >
                          {region.flag}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 justify-center pl-10">
                      {REGIONS.slice(3).map((region) => (
                        <div 
                          key={region.id}
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl bg-slate-700/50 border border-slate-600 shadow-lg transition-transform hover:scale-110"
                        >
                          {region.flag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REGIONS.map((region) => (
                <Card 
                  key={region.id}
                  className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-amber-500/50 transition-all group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{region.flag}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {region.name}
                        </h3>
                        <p className="text-sm text-slate-400 mb-2">{region.system}</p>
                        <p className="text-xs text-slate-500">{region.cities}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Modules</span>
                        <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                          Coming Soon
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* How It Works */}
            <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  How Regional Tracks Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { step: 1, title: 'Complete Core Journey', desc: 'Finish your Cultural Journey Map', icon: CheckCircle2, color: 'text-green-400' },
                    { step: 2, title: 'Select Your Region', desc: 'Choose where you\'ll be working', icon: MapPin, color: 'text-blue-400' },
                    { step: 3, title: 'Learn Local Culture', desc: 'Complete region-specific modules', icon: Globe2, color: 'text-purple-400' },
                    { step: 4, title: 'Earn Regional Badge', desc: 'Get certified for your region', icon: Medal, color: 'text-amber-400' },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className={cn(
                        "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                        "bg-slate-700/50 border border-slate-600"
                      )}>
                        <item.icon className={cn("h-6 w-6", item.color)} />
                      </div>
                      <p className="text-sm font-medium text-white mb-1">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leaderboard Section */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Card */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-slate-700 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      <Trophy className="h-3 w-3 mr-1" /> Phase 2.2
                    </Badge>
                    <h2 className="text-3xl font-bold text-white">
                      Peer Leaderboard & Friendly Competition
                    </h2>
                    <p className="text-slate-300">
                      Earn XP points, climb the leaderboard, and compete with your team in a 
                      fun, supportive environment. Opt-in only, with full privacy controls.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        <Star className="h-3 w-3 mr-1" /> XP Points
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        <Flame className="h-3 w-3 mr-1" /> Streaks
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        <Users className="h-3 w-3 mr-1" /> Team Rankings
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Leaderboard Preview */}
                  <div className="w-full lg:w-80">
                    <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="h-5 w-5 text-amber-400" />
                        <span className="text-white font-medium">Top Performers</span>
                      </div>
                      {[
                        { rank: 1, name: 'Sarah M.', xp: 4250, streak: 14, badge: '🥇' },
                        { rank: 2, name: 'James K.', xp: 3890, streak: 8, badge: '🥈' },
                        { rank: 3, name: 'Priya S.', xp: 3420, streak: 21, badge: '🥉' },
                      ].map((user) => (
                        <div 
                          key={user.rank}
                          className="flex items-center gap-3 py-2 border-b border-slate-700 last:border-0"
                        >
                          <span className="text-2xl">{user.badge}</span>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{user.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>{user.xp.toLocaleString()} XP</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Flame className="h-3 w-3 text-orange-400" />
                                {user.streak}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 pt-3 border-t border-slate-700 text-center">
                        <p className="text-slate-500 text-xs">Your Rank: #42</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* XP Rewards */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400" />
                  Earn XP Points
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Complete actions to earn experience points and climb the leaderboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {XP_REWARDS.map((reward) => (
                    <div 
                      key={reward.action}
                      className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700 hover:border-purple-500/50 transition-all"
                    >
                      <div className="text-3xl mb-2">{reward.icon}</div>
                      <p className="text-xs text-slate-400 mb-1">{reward.action}</p>
                      <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        +{reward.xp} XP
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mx-auto mb-4 flex items-center justify-center">
                    <Flame className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Streak Tracking</h3>
                  <p className="text-sm text-slate-400">
                    Build daily and weekly learning streaks to earn bonus XP and special badges
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Team Leaderboards</h3>
                  <p className="text-sm text-slate-400">
                    Compete with your ward, department, or cohort in friendly team challenges
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
                  <p className="text-sm text-slate-400">
                    Opt-in only with full control over what's visible. Go anonymous anytime.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Notice */}
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Your Privacy Matters</h3>
                    <p className="text-sm text-slate-300">
                      Leaderboard participation is <strong>100% opt-in</strong>. You choose:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-400">
                      <li>• Show your full profile</li>
                      <li>• Appear as "Anonymous Staff #42"</li>
                      <li>• Hide from leaderboards entirely</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notify Me Section */}
        <Card className="mt-12 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 border-slate-700">
          <CardContent className="p-8 text-center">
            {subscribed ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">You're on the list!</h3>
                <p className="text-slate-300">
                  We'll notify you as soon as these features are available.
                </p>
              </div>
            ) : (
              <>
                <Bell className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Get Notified</h3>
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                  Be the first to know when Phase 2 features are ready. 
                  Enter your email to get early access.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Button 
                    onClick={handleNotify}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                  >
                    Notify Me
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm mb-4">Expected Timeline</p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-300 text-sm">Phase 1 Complete</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-slate-300 text-sm">Regional Tracks (Q2 2025)</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-slate-400 text-sm">Leaderboards (Q3 2025)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;


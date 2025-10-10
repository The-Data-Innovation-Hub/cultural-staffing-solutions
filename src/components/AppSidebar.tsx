import { useLocation, NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  FileText,
  Award,
  PieChart,
  Upload,
  UserCog,
  User,
  LogOut,
  BookMarked,
  Sparkles,
  TrendingUp,
  FileCode2
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/contexts/AuthContext";

// Custom icon component for Clinify AI
const ClinifyAIIcon = ({ className }: { className?: string }) => (
  <img
    src="/clinify-ai-logo.png"
    alt="Clinify AI"
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

// Navigation items for different roles
const employeeNavItems = [
  { title: "Dashboard", url: "/employee", icon: BarChart3 },
  { title: "Onboarding Assessment", url: "/employee/onboarding", icon: Sparkles },
  { title: "My Learning Path", url: "/employee/learning-path", icon: TrendingUp },
  { title: "Training Center", url: "/employee/training", icon: BookOpen },
  { title: "Assessments", url: "/employee/assessments", icon: GraduationCap },
  { title: "Clinify AI", url: "/employee/ai-guru", icon: ClinifyAIIcon },
  { title: "Medical Abbreviations", url: "/employee/abbreviations", icon: BookMarked },
  { title: "Certificates", url: "/employee/certificates", icon: Award },
  { title: "Profile", url: "/employee/profile", icon: User },
];

const managerNavItems = [
  { title: "Dashboard", url: "/manager", icon: BarChart3 },
  { title: "Team Management", url: "/manager/team", icon: Users },
  { title: "Reports", url: "/manager/reports", icon: FileText },
  { title: "Analytics", url: "/manager/analytics", icon: PieChart },
  { title: "Medical Abbreviations", url: "/manager/abbreviations", icon: BookMarked },
  { title: "Profile", url: "/manager/profile", icon: User },
];

const adminNavItems = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Waitlist", url: "/admin/waitlist", icon: Users },
  { title: "Workforce Analytics", url: "/admin/analytics", icon: PieChart },
  { title: "Medical Abbreviations", url: "/admin/abbreviations", icon: BookMarked },
  { title: "Profile", url: "/admin/profile", icon: User },
];

const adminComingSoonItems = [
  { title: "Content Management", url: "/admin/content", icon: Upload },
  { title: "User Management", url: "/admin/users", icon: UserCog },
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "API Documentation", url: "/admin/api-docs", icon: FileCode2 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isCollapsed = state === "collapsed";
  
  // Determine current role from path
  const currentRole = location.pathname.split('/')[1];
  
  let navItems = employeeNavItems;
  let roleLabel = "Employee";
  
  if (currentRole === 'manager') {
    navItems = managerNavItems;
    roleLabel = "Manager";
  } else if (currentRole === 'admin') {
    navItems = adminNavItems;
    roleLabel = "Administrator";
  }
  
  // Extract user data
  const userData = {
    name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "User",
    email: user?.email || "",
    role: user?.role || roleLabel,
    imageUrl: user?.profileImage,
  };

  const initials = userData.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isActive = (path: string) => {
    if (path.endsWith(`/${currentRole}`)) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <Sidebar 
      className={`border-r border-border bg-card`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData.imageUrl} alt={userData.name} />
            <AvatarFallback className="bg-gradient-gold text-css-black font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-montserrat font-semibold text-sm text-foreground truncate">
                {userData.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {userData.role}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-muted-foreground font-montserrat font-medium">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      w-full justify-start gap-3 px-3 py-3 rounded-lg transition-all duration-200
                      hover:bg-accent/10 hover:text-accent-foreground
                      ${isActive(item.url)
                        ? 'bg-gradient-gold text-css-black font-medium shadow-sm'
                        : 'text-muted-foreground'
                      }
                    `}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-montserrat font-medium">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentRole === 'admin' && (
          <>
            <Separator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 py-2 text-muted-foreground font-montserrat font-medium">
                {!isCollapsed && "Coming Soon"}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className="px-2">
                  {adminComingSoonItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`
                          w-full justify-start gap-3 px-3 py-3 rounded-lg transition-all duration-200
                          hover:bg-accent/10 hover:text-accent-foreground
                          ${isActive(item.url)
                            ? 'bg-gradient-gold text-css-black font-medium shadow-sm'
                            : 'text-muted-foreground'
                          }
                        `}
                      >
                        <NavLink to={item.url} className="flex items-center gap-3 w-full">
                          <item.icon className="h-5 w-5 shrink-0" />
                          {!isCollapsed && (
                            <span className="font-montserrat font-medium">
                              {item.title}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border p-2">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={`
            w-full justify-start gap-3 px-3 py-3 rounded-lg
            text-muted-foreground hover:text-foreground hover:bg-destructive/10
            transition-colors duration-200
          `}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <span className="font-montserrat font-medium">Logout</span>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
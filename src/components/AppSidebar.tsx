import { useLocation, NavLink } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  Award,
  MessageCircle,
  PieChart,
  Upload,
  UserCog
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
  useSidebar,
} from "@/components/ui/sidebar";

// Navigation items for different roles
const employeeNavItems = [
  { title: "Dashboard", url: "/employee", icon: BarChart3 },
  { title: "Training Center", url: "/employee/training", icon: BookOpen },
  { title: "Assessments", url: "/employee/assessments", icon: GraduationCap },
  { title: "AI Guru", url: "/employee/ai-guru", icon: MessageCircle },
  { title: "Certificates", url: "/employee/certificates", icon: Award },
];

const managerNavItems = [
  { title: "Dashboard", url: "/manager", icon: BarChart3 },
  { title: "Team Management", url: "/manager/team", icon: Users },
  { title: "Reports", url: "/manager/reports", icon: FileText },
  { title: "Analytics", url: "/manager/analytics", icon: PieChart },
];

const adminNavItems = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Content Management", url: "/admin/content", icon: Upload },
  { title: "User Management", url: "/admin/users", icon: UserCog },
  { title: "System Analytics", url: "/admin/analytics", icon: PieChart },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  
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
  
  const isActive = (path: string) => {
    if (path.endsWith(`/${currentRole}`)) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar 
      className={`border-r border-border bg-card`}
      collapsible="icon"
    >
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-muted-foreground font-montserrat font-medium">
            {!isCollapsed && roleLabel + " Portal"}
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
      </SidebarContent>
    </Sidebar>
  );
}
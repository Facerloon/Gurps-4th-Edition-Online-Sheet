import { Circle, Shield, Zap, X, BookOpen, Sword, Wand2, FileText } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

export type SectionKey = 
  | 'primary'
  | 'attributes'
  | 'advantages'
  | 'disadvantages'
  | 'skills'
  | 'equipment'
  | 'spells'
  | 'campaign';

interface NavigationItem {
  key: SectionKey;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  { key: 'primary', title: 'Primary Information', icon: Circle },
  { key: 'attributes', title: 'Attributes & Characteristics', icon: Shield },
  { key: 'advantages', title: 'Advantages & Perks', icon: Zap },
  { key: 'disadvantages', title: 'Disadvantages & Quirks', icon: X },
  { key: 'skills', title: 'Skills & Techniques', icon: BookOpen },
  { key: 'equipment', title: 'Equipment', icon: Sword },
  { key: 'spells', title: 'Spells', icon: Wand2 },
  { key: 'campaign', title: 'Campaign Lore', icon: FileText },
];

interface CharacterNavigationProps {
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}

export const CharacterNavigation = ({ activeSection, onSectionChange }: CharacterNavigationProps) => {
  const { open, setOpen } = useSidebar();

  return (
    <Sidebar className={!open ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Character Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.key)}
                    className={`w-full transition-colors ${
                      activeSection === item.key 
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
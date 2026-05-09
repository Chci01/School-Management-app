import React from 'react';
import { Home, Users, BookOpen, MessageCircle, MoreHorizontal, GraduationCap, ClipboardList } from 'lucide-react';
import '../MobileAesthetics.css';

interface BottomNavProps {
  role: 'professor' | 'parent' | 'student';
  activeTab: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ role, activeTab }) => {
  const getNavItems = () => {
    switch (role) {
      case 'professor':
        return [
          { id: 'accueil', label: 'Accueil', icon: Home },
          { id: 'classes', label: 'Classes', icon: Users },
          { id: 'devoirs', label: 'Devoirs', icon: ClipboardList },
          { id: 'messages', label: 'Messages', icon: MessageCircle },
          { id: 'plus', label: 'Plus', icon: MoreHorizontal },
        ];
      case 'parent':
        return [
          { id: 'accueil', label: 'Accueil', icon: Home },
          { id: 'enfants', label: 'Enfants', icon: Users },
          { id: 'notes', label: 'Notes', icon: GraduationCap },
          { id: 'messages', label: 'Messages', icon: MessageCircle },
          { id: 'plus', label: 'Plus', icon: MoreHorizontal },
        ];
      case 'student':
        return [
          { id: 'accueil', label: 'Accueil', icon: Home },
          { id: 'notes', label: 'Notes', icon: GraduationCap },
          { id: 'devoirs', label: 'Devoirs', icon: BookOpen },
          { id: 'messages', label: 'Messages', icon: MessageCircle },
          { id: 'plus', label: 'Plus', icon: MoreHorizontal },
        ];
    }
  };

  return (
    <nav className={`bottom-nav ${role}`}>
      {getNavItems().map((item) => (
        <a key={item.id} href={`#/${item.id}`} className={`nav-item ${activeTab === item.id ? 'active' : ''}`}>
          <item.icon size={24} />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default BottomNav;

import { useNavigate } from 'react-router-dom';
import {
    Terminal,
    Briefcase,
    Trophy,
    BookOpen,
    Users,
    Code,
    Lightbulb,
    PresentationIcon
} from 'lucide-react';

const MobileCategoryGrid = () => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Hackathons', path: '/hackathons', icon: Terminal, color: 'bg-indigo-500/10 text-indigo-600' },
        { name: 'Internships', path: '/events?search=internship', icon: Briefcase, color: 'bg-blue-500/10 text-blue-600' },
        { name: 'Competitions', path: '/competitions', icon: Trophy, color: 'bg-orange-500/10 text-orange-600' },
        { name: 'Courses', path: '/courses', icon: BookOpen, color: 'bg-green-500/10 text-green-600' },
        { name: 'Workshops', path: '/events?search=workshop', icon: Users, color: 'bg-purple-500/10 text-purple-600' },
        { name: 'Resources', path: '/free-resources', icon: Lightbulb, color: 'bg-yellow-500/10 text-yellow-600' },
        { name: 'Mentorship', path: '/events?search=mentorship', icon: PresentationIcon, color: 'bg-pink-500/10 text-pink-600' },
        { name: 'Coding', path: '/events?search=coding', icon: Code, color: 'bg-cyan-500/10 text-cyan-600' },
    ];

    return (
        <div className="md:hidden mt-8 mb-12">
            <div className="grid grid-cols-4 gap-3 px-4">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => navigate(category.path)}
                        className="flex flex-col items-center group active:scale-95 transition-transform"
                    >
                        <div className={`w-full aspect-square rounded-2xl ${category.color} flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5`}>
                            <category.icon className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-bold mt-2 text-gray-600 dark:text-gray-400 capitalize whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileCategoryGrid;

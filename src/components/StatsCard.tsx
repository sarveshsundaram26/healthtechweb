import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  name: string;
  stat: string;
  icon: LucideIcon;
  gradient: string;
  alert?: boolean;
}

export default function StatsCard({ name, stat, icon: Icon, gradient, alert }: StatsCardProps) {
  return (
    <div className={`relative overflow-hidden bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group ${alert ? 'ring-2 ring-red-500/20 shadow-red-500/10' : ''}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:opacity-10 transition-opacity blur-2xl rounded-full -mr-8 -mt-8`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-6`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
      
      <div className="mt-6 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 group-hover:text-slate-400 transition-colors">{name}</p>
        <div className="flex items-baseline gap-2">
           <h3 className="text-3xl font-black text-white tracking-tighter">{stat}</h3>
           {alert && <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />}
        </div>
      </div>
    </div>
  );
}

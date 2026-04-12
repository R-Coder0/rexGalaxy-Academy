import {
  Lightbulb,
  Award,
  Briefcase,
  Users
} from "lucide-react";

export default function InfoBar() {
  const items = [
    {
      icon: Lightbulb,
      title: "Learn The Essential Skills",
    },
    {
      icon: Award,
      title: "Earn Certificates And Degrees",
    },
    {
      icon: Briefcase,
      title: "Get Ready for The Next Career",
    },
    {
      icon: Users,
      title: "Master at Different Areas",
    },
  ];

  return (
    <section className="bg-zinc-900 border-t border-b border-orange-500/30">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 text-white group"
              >
                {/* ICON */}
                <div className="p-3 rounded-lg border border-orange-500/40 text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition">
                  <Icon size={26} />
                </div>

                {/* TEXT */}
                <p className="font-medium text-base leading-snug">
                  {item.title}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

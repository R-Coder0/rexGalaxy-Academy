export default function CourseExpertise() {
  return (
    <section className="bg-black border-y border-orange-500/20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ===== EXPERTISE ===== */}
        <h3 className="text-start text-orange-500 font-semibold mb-8">
          Expertise
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <ExpertiseCard
            value="400000+"
            label="Professionals Trained"
          />
          <ExpertiseCard
            value="50+"
            label="Industry Expert Trainers"
          />
          <ExpertiseCard
            value="10"
            label="Branches"
          />
          <ExpertiseCard
            value="2500+"
            label="Corporate Served"
          />
        </div>

        {/* ===== META STRIP ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center border-t border-orange-500/20 pt-8">
          <MetaItem
            label="Course Duration"
            value="--"
          />
          <MetaItem
            label="Certificate"
            value="Yes"
          />
          <MetaItem
            label="Live Project"
            value="--"
          />
          <MetaItem
            label="Training Mode"
            value="Classroom / Online"
          />
        </div>

      </div>
    </section>
  );
}

/* ===== SMALL COMPONENTS ===== */

function ExpertiseCard({
  value,
  label
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="bg-zinc-900 border border-orange-500/20 rounded-xl p-6 text-center">
      <p className="text-2xl font-bold text-orange-500 mb-1">
        {value}
      </p>
      <p className="text-gray-300 text-sm">
        {label}
      </p>
    </div>
  );
}

function MetaItem({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r last:border-r-0 border-orange-500/20 px-4">
      <p className="text-gray-400 text-sm mb-1">
        {label}
      </p>
      <p className="text-white font-semibold">
        {value}
      </p>
    </div>
  );
}

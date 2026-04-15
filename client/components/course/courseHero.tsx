import Image from "next/image";

type LegacyCourseHeroData = {
  title: string;
  shortDescription: string;
  image: string;
};

export default function CourseHero({ course }: { course: LegacyCourseHeroData }) {
  return (
    <section className="border-b border-orange-500/20 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          <p className="text-orange-500 uppercase text-sm mb-2">
            Home / Courses / {course.title}
          </p>

          <h1 className="text-4xl font-bold mb-4 text-white">
            {course.title}
          </h1>

          <p className="text-gray-300 max-w-xl mb-6">
            {course.shortDescription}
          </p>

          <div className="flex gap-4 ">
            <button className="bg-orange-500 text-black md:px-6 px-2 py-3 rounded-md font-semibold hover:bg-orange-400">
              Download Curriculum
            </button>
            <button className="border border-orange-500 md:px-6 px-2 py-3 rounded-md text-orange-500 hover:bg-orange-500 hover:text-black">
              Schedule Demo
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE CIRCLE */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64 rounded-full border-4 border-orange-500 overflow-hidden flex items-center justify-center bg-zinc-900">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-contain p-8"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}

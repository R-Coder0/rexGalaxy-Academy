export default function CourseEnquiryForm({
  courseName
}: {
  courseName: string;
}) {
  return (
<aside className="bg-zinc-900 border border-orange-500/20 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 text-orange-500">
        Enquire Now
      </h3>

      <form className="space-y-4">
        <input className="input" placeholder="Full Name" />
        <input className="input" placeholder="Email Address" />
        <input className="input" placeholder="Phone Number" />
        <input className="input" value={courseName} disabled />
        <button className="w-full bg-orange-500 text-black py-3 rounded-md font-semibold">
          Submit
        </button>
      </form>
    </aside>
  );
}

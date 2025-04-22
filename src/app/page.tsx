// import Image from "next/image";

export default function HomePage() {
  return (
    <div className="md:px-12 bg-violet-200 pb-10" >
      {/* Hero Section */}
      <section className="relative h-[400px]">
        {/* Background Image */}

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl text-shadow-gray-600 text-center leading-snug">
            WELCOME TO THE{" "}
            <span className="relative inline-block text-violet-900">
              <span className="relative z-10">ROTAREX-2025</span>
              <span
                className="absolute left-0 bottom-1 w-full h-2 bg-gradient-to-r from-pink-400 to-violet-600 rounded-md opacity-70 z-0"
                aria-hidden="true"
              />
            </span>
          </h2>

          <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
            THE STATE LEVEL PROJECT EXHIBITION & COMPETITION
          </p>

          <a
            href="/register"
            className="inline-block bg-gradient-to-r from-violet-600 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transform transition duration-300 mt-6"
          >
            🚀 Register Now
          </a>
        </div>
      </section>
      <span className="h-5 bg-black w-full"></span>
      {/* Competition Details Section */}
      <section className="mt-12 bg-white p-6 md:p-10 shadow-xl rounded-2xl border-l-8 border-violet-600 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-violet-700 mb-6 text-center">
          🏆 Competition Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          <div>
            <h3 className="text-xl font-semibold mb-2">📍 Location</h3>
            <p>Dnyanshree Institute of Engineering and Technology, Satara</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🗓️ Date & Time</h3>
            <p>30th April 2025 | 10:00 AM – 6:00 PM</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              📝 Registration Deadline
            </h3>
            <p>25th April 2025</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🎯 Categories</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Major Projects – Advanced Technical Innovations</li>
              <li>Mini Projects – Creative Working Models</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

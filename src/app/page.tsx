import Image from "next/image";

export default function HomePage() {
  return (
    <div className="md:px-12 bg-violet-200 pb-10">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 m-4">
          <Image
            src="/page.jpeg" // Replace with your image path
            alt="Background"
            layout="fill"
            // objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-70" />
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl leading-snug">
            WELCOME TO THE{" "}
            <span className="relative inline-block text-white">
              <span className="relative z-10">ROTAREX-2025</span>
              <span
                className="absolute left-0 bottom-1 w-full h-2 bg-gradient-to-r from-pink-400 to-violet-600 rounded-md opacity-70 z-0"
                aria-hidden="true"
              />
            </span>
          </h2>

          <p className="text-lg md:text-xl max-w-2xl drop-shadow-md text-white bg-violet-600 bg-opacity-80 rounded-full p-2">
            THE STATE LEVEL PROJECT EXHIBITION & COMPETITION
          </p>

          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-violet-600 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transform transition duration-300 mt-6"
          >
            🚀 Evaluate
          </a>
        </div>
      </section>

      <span className="h-5 bg-black w-full"></span>
      {/* Competition Details Section */}
      <section className="mt-12 bg-white p-6 md:p-10 shadow-xl rounded-2xl border-l-8 border-violet-600 max-w-5xl mx-auto m-4">
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
      <footer className="bg-white shadow-lg py-4 text-center">
        <p className="text-sm text-gray-600">
          © 2025 Rotatex. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

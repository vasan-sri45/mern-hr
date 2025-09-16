
const ContentSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Intro Text */}
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
            Maecenas ut libero nisl.
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut libero nisl.
          </p>
        </div>

        {/* First Content Block */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6">
              Empower Employees to Understand and<br />
              Prevent Sexual Harassment
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Maecenas ut libero nisl. Interdum et malesuada fames ac 
              ante ipsum primis in faucibus. Ut euismod, turpis eget 
              effendi varius, nisl nunc feugiat est, in vulputate justo 
              turpis ac nisl. Nam a justo interdum mauris elementum 
              ultricies. Aliquam sed facilisis leo. Donec aliquam 
              bibendum bibendum.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Mauris sit amet magna magna. Aenean quis neque lectus. 
              Nullam consectetur erat felis, ac ultricies ipsum accumsan 
              lacinia. Aliquam ac mi at justo scelerisque vulputate ut a 
              est. Ut libero mi, dictum sollicitudin fermentum ac, 
              euismod vel neque. Donec a blandit ante. Cras libero 
              quam, rutrum id est non, aliquam consequat justo. Donec 
              scelerisque placerat imperdiet.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              Know more →
            </button>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 relative overflow-hidden">
                {/* Illustration placeholder - using geometric shapes to represent people */}
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-full mr-4"></div>
                    <div className="w-16 h-16 bg-orange-500 rounded-full"></div>
                  </div>
                  <div className="w-20 h-32 bg-blue-600 rounded-lg mx-auto mb-4"></div>
                  <div className="flex justify-center gap-2">
                    <div className="w-8 h-12 bg-purple-400 rounded"></div>
                    <div className="w-12 h-16 bg-blue-400 rounded"></div>
                  </div>
                </div>
                {/* Background decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-green-300 rounded opacity-50"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-blue-300 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Content Block */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl p-8 relative overflow-hidden">
                {/* Training illustration placeholder */}
                <div className="relative z-10">
                  <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-500 rounded mx-auto mb-2"></div>
                      <div className="text-xs font-medium text-gray-700">POSH</div>
                      <div className="text-xs text-gray-500">TRAINING</div>
                    </div>
                  </div>
                  <div className="flex items-end justify-center gap-2">
                    <div className="w-12 h-20 bg-purple-500 rounded-lg"></div>
                    <div className="w-12 h-16 bg-orange-500 rounded-lg"></div>
                    <div className="w-12 h-14 bg-blue-500 rounded-lg"></div>
                    <div className="w-12 h-24 bg-green-500 rounded-lg"></div>
                  </div>
                </div>
                {/* Background decorative elements */}
                <div className="absolute top-6 left-6 w-6 h-6 bg-purple-300 rounded opacity-40"></div>
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-green-300 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">
              Empower Employees to Understand and<br />
              Prevent Sexual Harassment
            </h4>
            <p className="text-gray-600 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Maecenas ut libero nisl. Interdum et malesuada fames ac 
              ante ipsum primis in faucibus. Ut euismod, turpis eget 
              effendi varius, nisl nunc feugiat est, in vulputate justo 
              turpis ac nisl. Nam a justo interdum mauris elementum 
              ultricies. Aliquam sed facilisis leo. Donec
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Mauris sit amet magna magna. Aenean quis neque lectus. 
              Nullam consectetur erat felis, ac ultricies ipsum accumsan 
              lacinia. Aliquam ac mi at justo scelerisque vulputate ut a 
              est. Ut libero mi, dictum sollicitudin fermentum ac, 
              euismod vel neque. Donec a blandit ante. Cras libero
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              Know more →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;

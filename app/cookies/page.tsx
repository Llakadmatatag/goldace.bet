'use client';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 font-audiowide">
            Cookies <span className="text-orange-500">Policy</span>
          </h1>
          <p className="text-xl text-gray-400">
            How GoldAce uses cookies and similar technologies
          </p>
        </div>

        {/* Cookies Content */}
        <div className="space-y-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-gray-300">
                
                {/* Initial Notice */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Cookie Notice
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    By continuing to use GoldAce, you understand that essential cookies and similar browser technologies may be used to keep core features working properly.
                  </p>
                </div>

                {/* What This Policy Covers */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    What This Policy Covers
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    This Cookies Policy explains how GoldAce uses cookies and similar browser technologies when you browse the site, sign in, or use interactive features such as profile settings and admin-protected pages.
                  </p>
                </div>

                {/* Authentication and Security Cookies */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Authentication and Security Cookies
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    GoldAce uses authentication-related cookies to help keep users signed in, secure protected areas, and verify access to account-based features. These cookies are especially important for Discord sign-in and for protected areas such as the admin section.
                  </p>
                </div>

                {/* Preference and Functionality Storage */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Preference and Functionality Storage
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    GoldAce may store limited browser data to improve usability, such as remembering certain profile-related information, reducing repeated requests, and keeping the site experience smoother across page loads. Some of this may use local browser storage in addition to cookies.
                  </p>
                </div>

                {/* Embedded and Third-Party Content */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Embedded and Third-Party Content
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Pages on GoldAce may include links, partner destinations, or embedded third-party experiences such as streaming content. Those third parties may set their own cookies or similar tracking technologies under their own privacy and cookie policies.
                  </p>
                </div>

                {/* Why Cookies Are Used */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Why Cookies Are Used
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Cookies and similar technologies help GoldAce maintain login sessions, secure protected routes, support account features, improve page behavior, and understand whether site functionality is working as intended.
                  </p>
                </div>

                {/* Managing Cookies */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Managing Cookies
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    You can usually control or delete cookies through your browser settings. Blocking essential cookies may prevent sign-in, account features, or other parts of GoldAce from working correctly.
                  </p>
                </div>

                {/* Policy Updates */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Policy Updates
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    GoldAce may update this policy if site features, authentication flows, or third-party integrations change. Continued use of the site after an update means you accept the revised policy.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Cookie Types Overview */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 font-audiowide">
              Cookie Types Used by GoldAce
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                <h4 className="text-orange-400 font-semibold mb-2">Essential Cookies</h4>
                <p className="text-gray-300 text-sm">
                  Required for authentication, security, and core functionality
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                <h4 className="text-orange-400 font-semibold mb-2">Functional Cookies</h4>
                <p className="text-gray-300 text-sm">
                  Remember preferences and improve user experience
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                <h4 className="text-orange-400 font-semibold mb-2">Third-Party Cookies</h4>
                <p className="text-gray-300 text-sm">
                  From embedded content and partner integrations
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                <h4 className="text-orange-400 font-semibold mb-2">Security Cookies</h4>
                <p className="text-gray-300 text-sm">
                  Protect against unauthorized access and fraud
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Questions About Cookies?
              </h3>
              <p className="text-gray-400 mb-4">
                If you have any questions about our use of cookies, please contact us.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer"
                >
                  Back to Home
                </a>
                <a 
                  href="/terms"
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

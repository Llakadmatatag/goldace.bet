'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 font-audiowide">
            Terms of <span className="text-orange-500">Service</span>
          </h1>
          <p className="text-xl text-gray-400">
            Please read these terms carefully before using GoldAce
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-gray-300">
                
                {/* Agreement */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Agreement to Terms
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    By using GoldAce, you agree to these terms. If you do not agree, please stop using the site and any connected services.
                  </p>
                </div>

                {/* Platform Purpose */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Platform Purpose
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    GoldAce is a content and community platform that highlights partner bonuses, leaderboards, giveaways, raffle-style promotions, streams, and future merchandise features. GoldAce is not the operator of third-party gambling platforms featured on the site.
                  </p>
                </div>

                {/* Eligibility and Responsible Use */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Eligibility and Responsible Use
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    You must be at least 18 years old, or the legal gambling age in your jurisdiction, to use gambling-related offers shown through GoldAce. You are responsible for making sure that accessing partner platforms is legal where you live and for gambling responsibly at all times.
                  </p>
                </div>

                {/* Affiliate and Third-Party Links */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Affiliate and Third-Party Links
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Some links, bonus codes, and promotions on GoldAce are affiliate links. If you use them, GoldAce may receive a commission from the partner at no additional cost to you. Bonus terms, withdrawals, wagering requirements, account restrictions, and other rules are controlled by the third-party platform, not by GoldAce.
                  </p>
                </div>

                {/* Accounts and Profile Data */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Accounts and Profile Data
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Certain features may require signing in with Discord or another supported account method. You are responsible for the accuracy of the information you provide and for keeping access to your account secure. GoldAce may limit, suspend, or remove access to site features if misuse, fraud, abuse, or policy violations are detected.
                  </p>
                </div>

                {/* Leaderboards, Giveaways, and Rewards */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Leaderboards, Giveaways, and Rewards
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Leaderboard data, giveaway entries, raffle mechanics, prizes, and reward eligibility may be subject to additional campaign-specific rules. GoldAce may update, pause, or cancel promotional features if needed for fairness, compliance, technical stability, or fraud prevention.
                  </p>
                </div>

                {/* Content Accuracy and Availability */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Content Accuracy and Availability
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    GoldAce tries to keep bonus information, campaign details, and platform content accurate and current, but we cannot guarantee that all information will always be complete, available, or error-free. Offers and third-party conditions may change without notice.
                  </p>
                </div>

                {/* Limitation of Responsibility */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Limitation of Responsibility
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    GoldAce is not responsible for losses, disputes, account actions, payment issues, technical failures, or policy decisions made by third-party platforms. Your relationship with any featured casino, case-opening site, or partner platform is between you and that platform.
                  </p>
                </div>

                {/* Changes to These Terms */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3 font-audiowide">
                    Changes to These Terms
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    GoldAce may update these Terms of Service from time to time as the platform evolves. Continued use of the site after changes are published means you accept the updated terms.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Questions About These Terms?
              </h3>
              <p className="text-gray-400 mb-4">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 cursor-pointer"
                >
                  Back to Home
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

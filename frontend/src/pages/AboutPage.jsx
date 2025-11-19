import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/theme-provider';

function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Blog</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Sharing knowledge, ideas, and stories that inspire and educate our readers.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Our Mission</h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            We believe in the power of sharing knowledge and experiences. Our mission is to create 
            a platform where writers and readers can connect, learn, and grow together through 
            engaging and informative content.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '📚',
              title: 'Quality Content',
              description: 'Carefully curated articles on various topics to expand your knowledge.'
            },
            {
              icon: '✍️',
              title: 'Easy to Write',
              description: 'Simple and intuitive interface for writers to share their thoughts.'
            },
            {
              icon: '🌐',
              title: 'Global Community',
              description: 'Connect with readers and writers from around the world.'
            }
          ].map((feature, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'bg-gray-800 border border-gray-700 hover:border-indigo-500' : 'bg-white'}`}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-indigo-50'} rounded-lg p-8 text-center`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Ready to start writing?</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Join our community of writers and share your stories with the world.</p>
          <Link 
            to="/register" 
            className={`${isDark ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-6 py-2 rounded-md transition-colors inline-block`}
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
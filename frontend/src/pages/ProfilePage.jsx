import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  Globe, 
  Twitter, 
  Github, 
  Linkedin 
} from 'lucide-react';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'Member since June 2023',
    bio: 'Full-stack developer passionate about creating beautiful and functional web applications. Love working with React, Node.js, and modern web technologies.',
    website: 'alexjohnson.dev',
    twitter: 'alexj',
    github: 'alexjohnson',
    linkedin: 'alexjohnson'
  });

  const [tempUser, setTempUser] = useState({ ...user });

  const handleEdit = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser({ ...tempUser });
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                    <Edit size={16} />
                  </button>
                )}
              </div>
              
              <div className="text-center md:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={tempUser.name}
                    onChange={handleChange}
                    className="text-2xl font-bold bg-transparent border-b border-white/30 focus:outline-none focus:border-white mb-2 text-center md:text-left"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                )}
                <p className="text-blue-100 mb-2">{user.joinDate}</p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a href="#" className="text-white hover:text-blue-200">
                    <Github size={20} />
                  </a>
                  <a href="#" className="text-white hover:text-blue-200">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="text-white hover:text-blue-200">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            <div className="flex justify-end mb-6">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={tempUser.bio}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
              ) : (
                <p className="text-gray-600">{user.bio}</p>
              )}
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                
                <div className="flex items-start">
                  <Mail className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={tempUser.email}
                        onChange={handleChange}
                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={tempUser.phone}
                        onChange={handleChange}
                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{user.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={tempUser.location}
                        onChange={handleChange}
                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800">{user.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
                
                <div className="flex items-start">
                  <Globe className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Website</p>
                    {isEditing ? (
                      <div className="flex">
                        <span className="text-gray-500 mr-1">https://</span>
                        <input
                          type="text"
                          name="website"
                          value={tempUser.website}
                          onChange={handleChange}
                          className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <a 
                        href={`https://${user.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.website}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Twitter className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Twitter</p>
                    {isEditing ? (
                      <div className="flex">
                        <span className="text-gray-500 mr-1">@</span>
                        <input
                          type="text"
                          name="twitter"
                          value={tempUser.twitter}
                          onChange={handleChange}
                          className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <a 
                        href={`https://twitter.com/${user.twitter}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        @{user.twitter}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Github className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">GitHub</p>
                    {isEditing ? (
                      <div className="flex">
                        <span className="text-gray-500 mr-1">github.com/</span>
                        <input
                          type="text"
                          name="github"
                          value={tempUser.github}
                          onChange={handleChange}
                          className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <a 
                        href={`https://github.com/${user.github}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.github}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
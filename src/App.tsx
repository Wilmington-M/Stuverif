import { useState } from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Student } from './types/student';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .or(`student_id.eq.${searchQuery},email.eq.${searchQuery}`)
        .maybeSingle();

      if (error) throw error;
      setStudent(data);
    } catch (error) {
      console.error('Error verifying student:', error);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <img src="/WilmingtonLogoOri.png" alt="Wilmington Logo" className="h-24 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Student Verification Portal
            </h1>
            <p className="text-lg text-gray-600">
              Enter a student ID or email address to verify enrollment status
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., STU2024001 or student@university.edu"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    disabled={loading}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Verifying...' : 'Verify Student'}
              </button>
            </form>
          </div>

          {searched && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {student ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Verified Student</h2>
                      <p className="text-gray-600">This student is currently enrolled</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {student.first_name} {student.last_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Student ID</p>
                      <p className="text-lg font-semibold text-gray-900">{student.student_id}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                      <p className="text-lg font-semibold text-gray-900">{student.email}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Program</p>
                      <p className="text-lg font-semibold text-gray-900">{student.program}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Enrollment Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(student.enrollment_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h2>
                  <p className="text-gray-600">
                    No active student record found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please verify the student ID or email address and try again
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>For testing, try: STU2024001, STU2024002, STU2024003, STU2023015, or STU2023042</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

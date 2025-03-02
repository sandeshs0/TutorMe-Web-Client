import { BookOpen, Calendar, Clock, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchTutorSessions, getTutorEarnings } from "../services/api";
import TutorWalletCard from "./TutorWalletCard";

const OverviewSection = ({ tutorData }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalEarnings: 0,
    totalHours: 0,
    studentsHelped: 0,
    completionRate: 0,
    averageRating: 0,
  });

  const [earningsData, setEarningsData] = useState([]);
  const [sessionsData, setSessionsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [earnings, sessions] = await Promise.all([
          getTutorEarnings(),
          fetchTutorSessions(),
        ]);

        setEarningsData(earnings);
        setSessionsData(sessions);

        // Calculate stats
        const completedSessions = sessions.filter(
          (s) => s.status === "completed"
        );
        const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
        const totalHours = completedSessions.reduce(
          (sum, s) => sum + s.actualDuration,
          0
        );
        const uniqueStudents = new Set(sessions.map((s) => s.studentId)).size;
        const completionRate =
          sessions.length > 0
            ? (completedSessions.length / sessions.length) * 100
            : 0;

        setStats({
          totalSessions: completedSessions.length,
          totalEarnings: totalEarnings.toFixed(2),
          totalHours: totalHours.toFixed(1),
          studentsHelped: uniqueStudents,
          completionRate: Math.round(completionRate),
          averageRating: 4.8, 
        });

        const earningsByDate = earnings
          .map((e) => ({
            date: new Date(e.date).toLocaleDateString(), 
            earnings: Number(e.amount.toFixed(2)),
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setMonthlyEarningsData(earningsByDate);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingSessions = sessionsData
    .filter(
      (session) =>
        new Date(session.startTime) > new Date() &&
        session.status !== "completed"
    )
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 4);

  // Prepare chart data
  const [monthlyEarningsData, setMonthlyEarningsData] = useState([]);

  const subjectsData = [
    { name: "Mathematics", value: 42 },
    { name: "Physics", value: 28 },
    { name: "Chemistry", value: 18 },
    { name: "Other", value: 12 },
  ];

  const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#6366F1"];

  if (loading || !tutorData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome back, {tutorData.name || "Tutor"}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's an overview of your tutoring activities
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-medium">
                Today: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TutorWalletCard
            name={tutorData.name || "N/A"}
            balance={tutorData.walletBalance.toFixed(2)}
            date={new Date().toLocaleDateString()}
            onWithdraw={() => alert("Withdraw initiated!")}
          />
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative bg-indigo-100 dark:bg-indigo-900 rounded-xl shadow-md border border-indigo-300 dark:border-indigo-700 p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              
              <div className="absolute hidden bottom-0 inset-0 z-0 opacity-20">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1440 320"
                >
                  <path
                    fill="#818cf8"
                    fillOpacity="1"
                    d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,176C960,192,1056,192,1152,181.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
              </div>
              <p className="relative z-10 text-gray-700 dark:text-gray-200 text-xl font-semibold mb-4">
                Total Sessions
              </p>
              <h3 className="relative z-10 text-8xl font-bold text-gray-900 dark:text-white mb-2">
                {stats.totalSessions}
              </h3>
             
            </div>

            <div className="relative bg-teal-100 dark:bg-teal-900 rounded-xl shadow-md border border-teal-300 dark:border-teal-700 p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="absolute hidden inset-0 z-0 opacity-20">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1440 320"
                >
                  <path
                    fill="#2dd4bf"
                    fillOpacity="1"
                    d="M0,224L48,213.3C96,203,192,181,288,165.3C384,149,480,139,576,149.3C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,134.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
              </div>
              <p className="relative z-10 text-gray-700 dark:text-gray-200 text-xl font-semibold mb-4">
                Minutes Tutored
              </p>
              <h3 className="relative z-10 text-8xl font-bold text-gray-900 dark:text-white mb-2">
                {(stats.totalHours * 60).toFixed(1)}
              </h3>
              
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Performance Analytics
            </h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  My Earnings
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={monthlyEarningsData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.1}
                  />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      borderColor: "#4F46E5",
                      color: "white",
                    }}
                    formatter={(value) => [`$${value}`, "Earnings"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 flex items-center justify-end text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Earnings over time</span>
              </div>
            </div>
          </div>

         
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Upcoming Sessions
              </h2>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </button>
            </div>
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600 p-4 mb-3 last:mb-0 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {session.studentName}
                    </h3>
                    <div className="flex items-center text-md text-gray-500 dark:text-gray-400">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>
                        {new Date(session.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-md text-gray-600 dark:text-gray-300 space-y-2">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                      <span>{session.subject || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                      <span>
                        {new Date(session.startTime).toLocaleTimeString(
                          "en-US",
                          { hour: "numeric", minute: "2-digit", hour12: true }
                        )}{" "}
                        • {(session.duration * 60).toFixed(0)} min
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No upcoming sessions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;

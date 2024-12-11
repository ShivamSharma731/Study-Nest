import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import logoUrl from "./studyLogo.png";
import vid1 from "./vid1.mp4";
import abc from "./2747.jpg";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const exploreSectionRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4545/api/user/userId",
          { withCredentials: true }
        );
        setUsername(response.data.username);
        if (response.data.profilePic) {
          setProfilePic(response.data.profilePic);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleProfilePicClick = () => {
    document.getElementById("profilePicInput").click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result);

        try {
          const formData = new FormData();
          formData.append("image", file);

          const response = await axios.post(
            "http://localhost:4545/api/user/upload-image",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            }
          );

          setProfilePic(response.data.imageUrl);
          await axios.put(
            "http://localhost:4545/api/user/updateProfilePic",
            { profilePic: response.data.imageUrl },
            { withCredentials: true }
          );
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setIsTermsOpen(false);
    setIsPrivacyOpen(false);
    setIsContactOpen(false);
  };

  const scrollToExploreSection = () => {
    if (exploreSectionRef.current) {
      exploreSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="overflow-hidden mb-0">
      <div className="relative min-h-screen text-white custom-scrollbar">
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={handleVideoLoad}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40 z-0"
        >
          <source src={vid1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-gray-900 to-transparent">
          <div className="flex items-center justify-between px-10 py-6">
            <div className="flex items-center">
              <img
                src={logoUrl}
                alt="Study Nest Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100x40?text=Logo";
                  console.error("Logo image failed to load");
                }}
              />
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={handleProfilePicClick}
            >
              <div className="relative">
                <img
                  src={profilePic || abc}
                  alt="Profile Avatar"
                  className="w-10 h-10 rounded-full border-2 border-blue-600 transform transition duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4 text-white font-semibold text-lg hover:text-blue-500 cursor-pointer transition-colors duration-300">
                {username || "Loading..."}
              </div>
            </div>

            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center text-center px-6 py-20 h-screen bg-black bg-opacity-50">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-100 leading-tight">
              Meet, chat, and study with students from all over the world 🌍
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed text-center">
              Join a global community of learners, collaborate in real-time
              virtual study rooms, and make learning more interactive and fun.
              Together, we grow and achieve!
            </p>
            <button
              className="mt-8 px-6 py-2 bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-400 transition-all"
              onClick={scrollToExploreSection}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div ref={exploreSectionRef} className="bg-gray-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-16 text-center">
            Explore <span className="text-purple-600">Study Nest</span> Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[ 
              {
                title: "Study Groups",
                link : "/channels",
                desc: "Join or create study groups to collaborate with peers.",
                icon: "📚"
              },
              {
                title: "Collaborative Study Rooms",
                link : "/study-room",
                desc: "Join real-time study rooms and collaborate worldwide.",
                icon: "💬"
              },
              {
                title: "Study Goals",
                link : "/study-goals",
                desc: "Set and track your study goals for focused learning.",
                icon: "🎯"
              },
              {
                title: "Create Notes",
                link : "/notes",
                desc: "Take and organize notes during study sessions.",
                icon: "📝"
              },
              {
                title: "Blogs",
                link : "/news",
                desc: "Read and share insightful blogs related to study topics.",
                icon: "📰"
              },
              {
                title: "Task Management",
                link : "#",
                desc: "Stay on top of tasks and assignments.",
                icon: "🗂️"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl"
              >
                <a href={feature.link}>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{feature.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-lg">{feature.desc}</p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2024 Study Nest. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import {
  Clock as ClockIcon,
  Tag as TagIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  BookOpen as BookIcon,
  Zap as TrendingIcon,
} from "lucide-react";

const newsCategories = [
  "Technology",
  "Science",
  "Business",
  "Entertainment",
  "Health",
  "Sports",
];

const featuredArticles = [
  {
    id: 1,
    title: "AI Revolutionizes Modern Workplace",
    excerpt:
      "Artificial Intelligence is transforming how businesses operate and innovate.",
    author: "Sarah Johnson",
    date: "June 15, 2024",
    category: "Technology",
    imageUrl: "/api/placeholder/800/400",
  },
  {
    id: 2,
    title: "Climate Change: A Global Challenge",
    excerpt:
      "Exploring sustainable solutions to combat environmental challenges.",
    author: "Michael Chen",
    date: "June 10, 2024",
    category: "Science",
    imageUrl: "/api/placeholder/800/400",
  },
  {
    id: 3,
    title: "Future of Remote Work",
    excerpt: "How technology is reshaping the traditional workplace landscape.",
    author: "Emma Rodriguez",
    date: "June 5, 2024",
    category: "Business",
    imageUrl: "/api/placeholder/800/400",
  },
];

const recentPosts = [
  {
    id: 4,
    title: "Breakthrough in Renewable Energy",
    author: "David Kim",
    date: "May 28, 2024",
    category: "Science",
  },
  {
    id: 5,
    title: "The Rise of Quantum Computing",
    author: "Lisa Wang",
    date: "May 25, 2024",
    category: "Technology",
  },
  {
    id: 6,
    title: "Mental Health in the Digital Age",
    author: "Dr. Rachel Green",
    date: "May 22, 2024",
    category: "Health",
  },
];

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <BookIcon className="mr-4 text-purple-500" size={40} />
            News & Insights
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Stay informed with the latest news, in-depth articles, and insights
            across various domains from technology to global affairs.
          </p>

          {/* Search and Filter */}
          <div className="mt-6 flex items-center space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full 
                  bg-gray-900 
                  border border-gray-800 
                  rounded-full 
                  py-2 
                  px-4 
                  pl-10 
                  text-white 
                  focus:ring-2 
                  focus:ring-purple-500
                "
              />
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
            <button
              className="
              bg-purple-700 
              hover:bg-purple-600 
              rounded-full 
              p-2 
              transition-colors
            "
            >
              <FilterIcon size={20} />
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {newsCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 
                  py-1 
                  rounded-full 
                  text-sm 
                  transition-colors 
                  ${
                    selectedCategory === category
                      ? "bg-purple-700 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }
                `}
              >
                {category}
              </button>
            ))}
            <button
              onClick={() => setSelectedCategory(null)}
              className="
                px-3 
                py-1 
                rounded-full 
                text-sm 
                bg-gray-800 
                text-gray-400 
                hover:bg-gray-700
              "
            >
              All
            </button>
          </div>
        </header>

        {/* Featured Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingIcon className="mr-3 text-purple-500" size={24} />
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                className="
                  bg-gray-900 
                  rounded-xl 
                  overflow-hidden 
                  shadow-lg 
                  hover:shadow-xl 
                  transition-all 
                  duration-300
                "
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="
                      bg-purple-700 
                      text-white 
                      px-2 
                      py-1 
                      rounded-full 
                      text-xs
                    "
                    >
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                      <ClockIcon size={16} className="mr-2" />
                      {article.date}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{article.excerpt}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      By {article.author}
                    </span>
                    <button
                      className="
                      text-purple-500 
                      hover:text-purple-400 
                      transition-colors
                    "
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookIcon className="mr-3 text-purple-500" size={24} />
            Recent Posts
          </h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="
                  bg-gray-900 
                  rounded-lg 
                  p-4 
                  flex 
                  justify-between 
                  items-center 
                  hover:bg-gray-800 
                  transition-colors
                "
              >
                <div>
                  <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                  <div className="flex items-center space-x-3 text-gray-400 text-sm">
                    <span>{post.author}</span>
                    <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
                    <span>{post.date}</span>
                    <span
                      className="
                      bg-purple-700 
                      text-white 
                      px-2 
                      py-0.5 
                      rounded-full 
                      text-xs
                    "
                    >
                      {post.category}
                    </span>
                  </div>
                </div>
                <button
                  className="
                  text-purple-500 
                  hover:text-purple-400 
                  transition-colors
                "
                >
                  Read
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default News;

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function CategoriesPage() {
  const categories = [
    {
      id: "general",
      name: "General",
      description: "Everyday thoughts, random confessions, and general life experiences",
      icon: "💭",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      posts: 1250,
      trending: ["thoughts", "random", "everyday", "life"]
    },
    {
      id: "relationships",
      name: "Relationships",
      description: "Love, friendship, dating, breakups, and relationship struggles",
      icon: "💕",
      color: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
      posts: 2341,
      trending: ["love", "dating", "breakup", "crush", "friendship"]
    },
    {
      id: "work",
      name: "Work & Career",
      description: "Job stress, career changes, workplace issues, and professional growth",
      icon: "💼",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      posts: 1876,
      trending: ["job", "career", "workplace", "stress", "promotion"]
    },
    {
      id: "family",
      name: "Family",
      description: "Parents, siblings, family drama, and household relationships",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      posts: 1992,
      trending: ["parents", "siblings", "family-drama", "home", "relatives"]
    },
    {
      id: "health",
      name: "Health & Wellness",
      description: "Mental health, physical wellness, medical concerns, and self-care",
      icon: "🏥",
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      posts: 3127,
      trending: ["mental-health", "anxiety", "depression", "wellness", "therapy"]
    },
    {
      id: "personal",
      name: "Personal Growth",
      description: "Self-improvement, goals, achievements, failures, and life lessons",
      icon: "🌱",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      posts: 1654,
      trending: ["growth", "goals", "success", "failure", "learning"]
    },
    {
      id: "secrets",
      name: "Secrets",
      description: "Deep secrets, hidden truths, and things you've never told anyone",
      icon: "🤫",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      posts: 2103,
      trending: ["secret", "hidden", "truth", "confession", "never-told"]
    },
    {
      id: "regrets",
      name: "Regrets",
      description: "Past mistakes, missed opportunities, and things you wish you'd done differently",
      icon: "😔",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      posts: 1435,
      trending: ["regret", "mistake", "missed-opportunity", "past", "wish"]
    }
  ];

  const totalPosts = categories.reduce((sum, cat) => sum + cat.posts, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ConfessHub
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/search">
                <Button variant="ghost">Search</Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Categories</h1>
            <p className="text-muted-foreground mb-4">
              Find confessions organized by topic and experience
            </p>
            <div className="flex justify-center items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {totalPosts.toLocaleString()} Total Confessions
              </Badge>
              <Badge variant="outline" className="text-sm">
                8 Categories
              </Badge>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <Link href={`/dashboard?category=${category.id}`}>
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <Badge className={`text-xs ${category.color}`}>
                        {category.posts.toLocaleString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4 leading-relaxed">
                      {category.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Trending Tags:
                      </p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {category.trending.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Popular Categories */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Most Active Categories</CardTitle>
              <CardDescription>Categories with the most recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories
                  .sort((a, b) => b.posts - a.posts)
                  .slice(0, 4)
                  .map((category) => (
                    <Link key={category.id} href={`/dashboard?category=${category.id}`}>
                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {category.posts.toLocaleString()} posts
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to Share?</h3>
            <p className="text-muted-foreground">
              Join our supportive community and share your story anonymously
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Share Your Confession
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline">
                  Search Confessions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
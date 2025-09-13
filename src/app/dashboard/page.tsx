"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { PostCard } from "@/components/posts/PostCard";
import { PostCreator } from "@/components/posts/PostCreator";
import Link from "next/link";
import { toast } from "sonner";

interface Post {
  id: string;
  content: string;
  category: string;
  anonymousName: string;
  timestamp: string;
  reactions: {
    support: number;
    relate: number;
    care: number;
  };
  comments: number;
  tags: string[];
}

interface User {
  id: number;
  email: string;
  anonymousId: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [showPostCreator, setShowPostCreator] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "relationships", label: "Relationships" },
    { value: "work", label: "Work & Career" },
    { value: "family", label: "Family" },
    { value: "health", label: "Health & Wellness" },
    { value: "personal", label: "Personal Growth" },
    { value: "secrets", label: "Secrets" },
    { value: "regrets", label: "Regrets" }
  ];

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("confess_user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }

    setUser(JSON.parse(userData));
    loadPosts();
  }, [router]);

  const loadPosts = () => {
    // Simulate loading posts from API
    const mockPosts: Post[] = [
      {
        id: "1",
        content: "I've been struggling with anxiety for months but haven't told anyone. Sometimes I feel like I'm drowning in my own thoughts and I don't know how to reach out for help.",
        category: "health",
        anonymousName: "QuietSoul",
        timestamp: "2024-01-15T10:30:00Z",
        reactions: { support: 24, relate: 18, care: 12 },
        comments: 8,
        tags: ["anxiety", "mental-health", "support"]
      },
      {
        id: "2",
        content: "I secretly wish my parents would be proud of me just once. I've achieved so much but they never seem to notice or care.",
        category: "family",
        anonymousName: "HopefulHeart",
        timestamp: "2024-01-15T09:15:00Z",
        reactions: { support: 31, relate: 45, care: 28 },
        comments: 15,
        tags: ["family", "validation", "parents"]
      },
      {
        id: "3",
        content: "I quit my high-paying job to pursue my passion and I'm terrified I made a huge mistake. Everyone thinks I'm crazy.",
        category: "work",
        anonymousName: "DreamChaser",
        timestamp: "2024-01-15T08:45:00Z",
        reactions: { support: 67, relate: 23, care: 19 },
        comments: 22,
        tags: ["career", "passion", "courage"]
      },
      {
        id: "4",
        content: "I've never felt truly loved by anyone and I'm starting to think there's something fundamentally wrong with me.",
        category: "relationships",
        anonymousName: "LonelyWanderer",
        timestamp: "2024-01-15T07:20:00Z",
        reactions: { support: 89, relate: 34, care: 56 },
        comments: 31,
        tags: ["loneliness", "self-worth", "love"]
      },
      {
        id: "5",
        content: "I pretend to be happy all the time but inside I feel empty. I don't want to burden others with my problems.",
        category: "personal",
        anonymousName: "MaskedSmile",
        timestamp: "2024-01-14T20:10:00Z",
        reactions: { support: 76, relate: 92, care: 41 },
        comments: 28,
        tags: ["depression", "facade", "authenticity"]
      }
    ];

    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
    setIsLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPosts(query, selectedCategory, sortBy);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterPosts(searchQuery, category, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    filterPosts(searchQuery, selectedCategory, sort);
  };

  const filterPosts = (query: string, category: string, sort: string) => {
    let filtered = [...posts];

    // Filter by search query
    if (query) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(post => post.category === category);
    }

    // Sort posts
    switch (sort) {
      case "recent":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => 
          (b.reactions.support + b.reactions.relate + b.reactions.care) - 
          (a.reactions.support + a.reactions.relate + a.reactions.care)
        );
        break;
      case "discussed":
        filtered.sort((a, b) => b.comments - a.comments);
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("confess_user");
    toast.success("You've been logged out successfully.");
    router.push("/");
  };

  const handlePostCreated = (newPost: Omit<Post, 'id' | 'timestamp' | 'reactions' | 'comments'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      reactions: { support: 0, relate: 0, care: 0 },
      comments: 0
    };

    setPosts(prev => [post, ...prev]);
    setFilteredPosts(prev => [post, ...prev]);
    setShowPostCreator(false);
    toast.success("Your confession has been shared anonymously!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your space...</p>
        </div>
      </div>
    );
  }

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
              <Badge variant="secondary" className="hidden sm:flex">
                {user?.anonymousId}
              </Badge>
              <ThemeToggle />
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to Your Safe Space
            </h1>
            <p className="text-muted-foreground mb-6">
              Share your thoughts anonymously and connect with others who understand
            </p>
            <Button 
              onClick={() => setShowPostCreator(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Share Your Confession
            </Button>
          </div>

          {/* Post Creator Modal */}
          {showPostCreator && (
            <PostCreator 
              onClose={() => setShowPostCreator(false)}
              onPostCreated={handlePostCreated}
              anonymousName={user?.anonymousId || "Anonymous"}
            />
          )}

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search confessions or tags..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="discussed">Most Discussed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-6">
                {filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        No confessions found matching your search.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setFilteredPosts(posts);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Trending posts feature coming soon!</p>
              </div>
            </TabsContent>

            <TabsContent value="following">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Following feature coming soon!</p>
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Saved posts feature coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { PostCard } from "@/components/posts/PostCard";
import Link from "next/link";

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

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'recent');
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

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

  const popularTags = [
    "anxiety", "depression", "relationships", "family", "work", "career", 
    "love", "friendship", "health", "mental-health", "support", "loneliness",
    "happiness", "stress", "success", "failure", "regret", "hope"
  ];

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [selectedCategory, sortBy]);

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchPerformed(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, filter mock posts
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
        }
      ];

      // Filter based on search criteria
      let filtered = mockPosts;
      
      if (searchQuery) {
        filtered = filtered.filter(post => 
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (selectedCategory !== "all") {
        filtered = filtered.filter(post => post.category === selectedCategory);
      }

      setPosts(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    handleSearch();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

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
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Confessions</h1>
            <p className="text-muted-foreground">
              Find stories and experiences that resonate with you
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex-1">
                    <Input
                      placeholder="Search confessions, tags, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="md:w-auto">
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex gap-4 flex-1">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

                    <Select value={sortBy} onValueChange={setSortBy}>
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
              </form>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Popular Tags</CardTitle>
              <CardDescription>
                Click on any tag to search for related confessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : searchPerformed ? (
            <div className="space-y-6">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No confessions found matching your search criteria.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Try different keywords or browse by category
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setPosts([]);
                          setSearchPerformed(false);
                        }}
                      >
                        Clear Search
                      </Button>
                      <Link href="/dashboard">
                        <Button>Browse All</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      Found {posts.length} confession{posts.length !== 1 ? 's' : ''}
                    </p>
                    {searchQuery && (
                      <Badge variant="secondary">
                        Search: &quot;{searchQuery}&quot;
                      </Badge>
                    )}
                  </div>
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Enter keywords or click on popular tags to start searching
                </p>
                <p className="text-sm text-muted-foreground">
                  Find confessions that resonate with your experiences
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
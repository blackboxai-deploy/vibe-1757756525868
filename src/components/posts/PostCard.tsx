"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

interface PostReactions {
  support: number;
  relate: number;
  care: number;
}

interface Post {
  id: string;
  content: string;
  category: string;
  anonymousName: string;
  timestamp: string;
  reactions: PostReactions;
  comments: number;
  tags: string[];
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState(false);

  const handleReaction = (type: keyof PostReactions) => {
    setUserReactions(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      relationships: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
      work: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      family: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      health: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      personal: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      secrets: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      regrets: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    };
    return colors[category] || colors.general;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {post.anonymousName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm">{post.anonymousName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm leading-relaxed text-foreground/90 mb-4">
          {post.content}
        </p>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button
              variant={userReactions.support ? "default" : "ghost"}
              size="sm"
              onClick={() => handleReaction("support")}
              className="gap-2 text-xs"
            >
              <span>🤗</span>
              <span>Support</span>
              <span className="text-muted-foreground">
                {post.reactions.support + (userReactions.support ? 1 : 0)}
              </span>
            </Button>

            <Button
              variant={userReactions.relate ? "default" : "ghost"}
              size="sm"
              onClick={() => handleReaction("relate")}
              className="gap-2 text-xs"
            >
              <span>🫂</span>
              <span>Relate</span>
              <span className="text-muted-foreground">
                {post.reactions.relate + (userReactions.relate ? 1 : 0)}
              </span>
            </Button>

            <Button
              variant={userReactions.care ? "default" : "ghost"}
              size="sm"
              onClick={() => handleReaction("care")}
              className="gap-2 text-xs"
            >
              <span>💙</span>
              <span>Care</span>
              <span className="text-muted-foreground">
                {post.reactions.care + (userReactions.care ? 1 : 0)}
              </span>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="gap-2 text-xs"
            >
              <span>💬</span>
              <span>{post.comments} Comments</span>
            </Button>

            <Button variant="ghost" size="sm" className="text-xs">
              <span>⚠️</span>
              <span className="sr-only">Report</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="w-full mt-4 pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground">
              Comments feature coming soon!
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
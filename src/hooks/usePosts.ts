"use client";

import { useState, useEffect } from "react";

export interface Post {
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

interface PostsFilters {
  category?: string;
  search?: string;
  sort?: string;
}

export function usePosts(filters: PostsFilters = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      } else {
        setError(data.error || 'Failed to fetch posts');
      }
    } catch {
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (postData: {
    content: string;
    category: string;
    tags: string[];
    anonymousName: string;
  }): Promise<{ success: boolean; error?: string; post?: Post }> => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new post to the beginning of the posts array
        setPosts(prev => [data.post, ...prev]);
        return { success: true, post: data.post };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'Failed to create post. Please try again.' };
    }
  };

  const reactToPost = async (postId: string, reactionType: 'support' | 'relate' | 'care'): Promise<boolean> => {
    try {
      // For demo purposes, just update the local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [reactionType]: post.reactions[reactionType] + 1
            }
          };
        }
        return post;
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to react to post:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters.category, filters.search, filters.sort]);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    createPost,
    reactToPost,
  };
}
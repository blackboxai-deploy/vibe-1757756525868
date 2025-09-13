import { NextRequest, NextResponse } from 'next/server';

interface PostRequest {
  content: string;
  category: string;
  tags: string[];
  anonymousName: string;
}

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

// Mock database - in a real app, this would be a proper database
const posts: Post[] = [
  {
    id: "1",
    content: "I've been struggling with anxiety for months but haven't told anyone. Sometimes I feel like I'm drowning in my own thoughts and I don't know how to reach out for help.",
    category: "health",
    anonymousName: "QuietSoul",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    reactions: { support: 24, relate: 18, care: 12 },
    comments: 8,
    tags: ["anxiety", "mental-health", "support"]
  },
  {
    id: "2",
    content: "I secretly wish my parents would be proud of me just once. I've achieved so much but they never seem to notice or care.",
    category: "family",
    anonymousName: "HopefulHeart",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    reactions: { support: 31, relate: 45, care: 28 },
    comments: 15,
    tags: ["family", "validation", "parents"]
  },
  {
    id: "3",
    content: "I quit my high-paying job to pursue my passion and I'm terrified I made a huge mistake. Everyone thinks I'm crazy.",
    category: "work",
    anonymousName: "DreamChaser",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    reactions: { support: 67, relate: 23, care: 19 },
    comments: 22,
    tags: ["career", "passion", "courage"]
  },
  {
    id: "4",
    content: "I've never felt truly loved by anyone and I'm starting to think there's something fundamentally wrong with me.",
    category: "relationships",
    anonymousName: "LonelyWanderer",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    reactions: { support: 89, relate: 34, care: 56 },
    comments: 31,
    tags: ["loneliness", "self-worth", "love"]
  },
  {
    id: "5",
    content: "I pretend to be happy all the time but inside I feel empty. I don't want to burden others with my problems.",
    category: "personal",
    anonymousName: "MaskedSmile",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    reactions: { support: 76, relate: 92, care: 41 },
    comments: 28,
    tags: ["depression", "facade", "authenticity"]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'recent';

    let filteredPosts = [...posts];

    // Filter by category
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort posts
    switch (sort) {
      case 'popular':
        filteredPosts.sort((a, b) => 
          (b.reactions.support + b.reactions.relate + b.reactions.care) - 
          (a.reactions.support + a.reactions.relate + a.reactions.care)
        );
        break;
      case 'discussed':
        filteredPosts.sort((a, b) => b.comments - a.comments);
        break;
      case 'recent':
      default:
        filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
    }

    return NextResponse.json({
      success: true,
      posts: filteredPosts,
      total: filteredPosts.length
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PostRequest = await request.json();
    const { content, category, tags, anonymousName } = body;

    // Validation
    if (!content || !category || !anonymousName) {
      return NextResponse.json(
        { error: 'Content, category, and anonymous name are required' },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: 'Content must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Content must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // Create new post
    const newPost: Post = {
      id: Date.now().toString(),
      content: content.trim(),
      category,
      tags: tags.slice(0, 5), // Limit to 5 tags
      anonymousName,
      timestamp: new Date().toISOString(),
      reactions: { support: 0, relate: 0, care: 0 },
      comments: 0
    };

    // Add to mock database
    posts.unshift(newPost);

    return NextResponse.json({
      success: true,
      post: newPost,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
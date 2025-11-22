import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { format } from 'date-fns';
import { Calendar, Clock, Tag, User, Heart, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import API from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await API.get("/api/posts/all");
      if (response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleLike = async (e, postId) => {
    e.stopPropagation(); // Prevent navigating to post detail
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }
    try {
      const response = await API.put(`/api/posts/${postId}/like`);
      if (response.data) {
        setPosts(posts.map(post =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        ));
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const isLiked = user && post.likes?.includes(user._id || user.id);
          return (
            <Card
              key={post._id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer group"
              onClick={() => navigate(`/posts/${post._id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-white" />
                    {post.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-white border-white/30 bg-black/30 backdrop-blur-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <CardHeader className="flex-1">
                <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <p className="text-muted-foreground line-clamp-3 mt-2">
                  {post.content}
                </p>
              </CardHeader>

              <CardFooter className="border-t p-4 mt-auto bg-muted/5">
                <div className="flex flex-col w-full gap-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.user?.avatar} alt={post.user?.name} />
                        <AvatarFallback>
                          {post.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{post.user?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-1.5 h-8 px-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={(e) => handleLike(e, post._id)}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="text-xs font-medium">{post.likes?.length || 0}</span>
                    </Button>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">{post.commentCount || 0}</span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {posts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No posts yet</h3>
          <p className="text-muted-foreground mt-2">Be the first to create a post!</p>
        </div>
      )}
    </div>
  );
}

export default Posts;
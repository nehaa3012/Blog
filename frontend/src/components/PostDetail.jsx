import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Tag, ArrowLeft, User, Edit, Trash2, Loader2, X, Check, Heart, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import API from '../config/api';
import { AuthContext } from '../context/AuthContext';
import CommentSection from './CommentSection';

// Confirmation Dialog Component
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Check className="mr-2 h-4 w-4" /> Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleEdit = () => {
    navigate(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await API.delete(`/api/posts/${id}`);
      toast.success('Post deleted successfully');
      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }
    try {
      const response = await API.put(`/api/posts/${id}/like`);
      if (response.data) {
        setPost(prev => ({
          ...prev,
          likes: response.data.likes
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await API.get(`/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p>Post not found</p>
        <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const isOwner = (() => {
    const userId = user?._id || user?.id;
    const postUserId = post?.user?._id || post?.user;
    return userId && postUserId && userId.toString() === postUserId.toString();
  })();

  const isLiked = user && post.likes?.includes(user._id || user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>
        <div className="flex space-x-2">
          {isOwner && (
            <>
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              <Button
                onClick={openDeleteDialog}
                variant="destructive"
                size="sm"
                className="flex items-center gap-1.5"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Delete</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />

      <Card className="overflow-hidden mb-8">
        <div className="relative h-96 w-full">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center text-sm text-white/80 space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.user?.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>

        <CardHeader className="border-t bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.user?.avatar} alt={post.user?.name} />
                <AvatarFallback>{post.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.user?.name}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className={`gap-2 ${isLiked ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes?.length || 0} Likes</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <CommentSection postId={id} />
    </div>
  );
}

export default PostDetail;

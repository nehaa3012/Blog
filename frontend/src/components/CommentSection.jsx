import React, { useState, useEffect, useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Trash2, Heart, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../config/api';
import { AuthContext } from '../context/AuthContext';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchComments = async () => {
        try {
            const response = await API.get(`/api/comments/all/${postId}`);
            if (response.data && response.data.comments) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!user) {
            toast.error("Please login to comment");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await API.post(`/api/comments/add/${postId}`, {
                content: newComment
            });

            if (response.data && response.data.comment) {
                // The backend returns the comment, but we need to populate the user for display
                // Or we can just re-fetch, but that's an extra call.
                // Let's manually construct the comment object for immediate feedback or re-fetch.
                // Re-fetching is safer to ensure consistency.
                await fetchComments();
                setNewComment('');
                toast.success("Comment added");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            await API.delete(`/api/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success("Comment deleted");
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment");
        }
    };

    const handleLike = async (commentId) => {
        if (!user) {
            toast.error("Please login to like comments");
            return;
        }

        try {
            const response = await API.put(`/api/comments/${commentId}`);
            if (response.data && response.data.comment) {
                setComments(comments.map(c =>
                    c._id === commentId ? { ...c, likes: response.data.comment.likes } : c
                ));
            }
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-xl">Comments ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add Comment Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    size="sm"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>

                <Separator />

                {/* Comments List */}
                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to share your thoughts!</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex gap-4 group">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={comment.user?.avatar} />
                                    <AvatarFallback>{comment.user?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{comment.user?.name || 'Unknown User'}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {user && (user._id === comment.user?._id || user.id === comment.user?._id) && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90"
                                                onClick={() => handleDelete(comment._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center gap-4 pt-1">
                                        <button
                                            onClick={() => handleLike(comment._id)}
                                            className={`flex items-center gap-1 text-xs transition-colors ${user && comment.likes.includes(user._id || user.id)
                                                    ? 'text-red-500'
                                                    : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <Heart className={`h-3.5 w-3.5 ${user && comment.likes.includes(user._id || user.id) ? 'fill-current' : ''
                                                }`} />
                                            <span>{comment.likes.length > 0 ? comment.likes.length : 'Like'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CommentSection;

<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Cache;

class PostController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    /**
     * Get all posts with user data and caching
     */
    public function index()
{
    $userId = auth()->id();
    
    return Cache::remember("posts.all.$userId", now()->addMinutes(30), function() use ($userId) {
        return Post::with(['user:id,name'])
            ->where(function($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'completed' => $post->completed,
                    'user' => $post->user,
                    'created_at' => $post->created_at->diffForHumans()
                ];
            });
    });
}

// essaie de fonction facile

public function indexx()
    {
        return array_reverse(Auth::user()->tasks->toArray());
    }

    /**
     * Store a new post with validation améliorée
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            // 'body' => 'required|string',
            'completed' => 'sometimes|boolean'
        ]);

        $post = $request->user()->posts()->create($validated);

        // Clear cache after new post
        Cache::forget('posts.all');

        return response()->json([
            'post' => $post->load('user:id,name'),
            'message' => 'Post créé avec succès'
        ], 201);
    }

    /**
     * Display specific post with authorization check
     */
    public function show(Post $post)
    {
        return $post->load('user:id,name');
    }

    /**
     * Update post with policy check
     */
    public function update(Request $request, Post $post)
    {
        Gate::authorize('modify', $post);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'completed' => 'sometimes|boolean'
        ]);

        $post->update($validated);
        Cache::forget('posts.all');

        return response()->json([
            'post' => $post->fresh(),
            'message' => 'Post mis à jour'
        ]);
    }

    /**
     * Delete post with policy check
     */
    public function destroy($id)
{
    $post = Post::findOrFail($id);
    $this->authorize('delete', $post); // Politique de suppression
    $post->delete();
    
    return response()->json([
        'success' => true,
        'message' => 'Tâche supprimée'
    ]);
}

    /**
     * Get posts by specific user (nouvelle méthode)
     */
    public function userPosts(User $user)
    {
        return $user->posts()
            ->with('user:id,name')
            ->latest()
            ->get()
            ->paginate(10);
    }
}
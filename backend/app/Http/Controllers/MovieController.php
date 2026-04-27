<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    // LIST + SEARCH + FILTER + PAGINATION
    public function index(Request $request)
    {
        $query = Movie::query();

        // Search By Title
        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter By Category (JSON)
        if ($request->category) {
            $query->whereJsonContains('categories', $request->category);
        }

        // Popular Movies
        if ($request->popular) {
            $query->where('rating', '>=', 8);
        }

        // Sort By Rating
        if ($request->sort === 'rating') {
            $query->orderBy('rating', 'desc');
        } else {
            $query->latest();
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(24) // pagination 24 per page (control to FE)
        ]);
    }

    // Create Movie
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'poster_url' => 'nullable|string',
            'rating' => 'required|numeric',
            'categories' => 'required',
        ]);

        $data = $request->all();

        // Upload Poster (optional)
        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('movies', 'public');
            $data['poster_url'] = asset('storage/' . $path);
        }

        // Ensure JSON format
        if (isset($data['categories']) && is_array($data['categories'])) {
            $data['categories'] = json_encode($data['categories']);
        }

        $movie = Movie::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Movie created',
            'data' => $movie
        ], 201);
    }

    // Detail Movie + Reactions Count
    public function show($id)
    {
        $movie = Movie::withCount([
            'watchlists as watchlist_count',
            'reactions as love_count' => function ($q) {
                $q->where('type', 'love');
            },
            'reactions as hate_count' => function ($q) {
                $q->where('type', 'hate');
            }
        ])->find($id);

        if (!$movie) {
            return response()->json([
                'success' => false,
                'message' => 'Movie not found',
                'available_ids' => Movie::pluck('id')
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $movie
        ]);
    }

    // Update Movie (ADMIN)
    public function update(Request $request, $id)
    {
        $movie = Movie::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'poster_url' => 'sometimes|string',
            'rating' => 'sometimes|numeric',
            'categories' => 'sometimes',
        ]);

        $data = $request->all();

        // Upload Poster (optional)
        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('movies', 'public');
            $data['poster_url'] = asset('storage/' . $path);
        }

        // ensure JSON format
        if (isset($data['categories']) && is_array($data['categories'])) {
            $data['categories'] = json_encode($data['categories']);
        }

        $movie->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Movie updated',
            'data' => $movie
        ]);
    }

    // Delete Movie (ADMIN)
    public function destroy($id)
    {
        $movie = Movie::find($id);

        if (!$movie) {
            return response()->json([
                'success' => false,
                'message' => 'Movie not found'
            ], 404);
        }

        $movie->delete();

        return response()->json([
            'success' => true,
            'message' => 'Movie deleted'
        ]);
    }
}
<?php 

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Enregistrement d'un nouvel utilisateur
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed|min:8'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }

    /**
     * Connexion utilisateur
     */
    public function login(Request $request)
    {
        try {
        
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 401);
        }

        $user->tokens()->delete();
    
        // Crée un nouveau token
        $token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;

        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Identifiants invalides',
                'error' => $th->getMessage()
            ], 300);
        }
        return response()->json([
            'user' => $user->only('id', 'name', 'email'),
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => 60 * 24 * 7 // 7 jours en minutes
        ]);
    }

    /**
     * Récupère la liste des utilisateurs (pour la sélection de collaborateurs)
     */
    public function getUsers(Request $request)
    {
        return User::where('id', '!=', $request->user()->id)
            ->select('id', 'name', 'email', 'created_at')
            ->orderBy('name')
            ->paginate(10);
    }

    /**
     * Déconnexion utilisateur
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }
}


// namespace App\Http\Controllers;

// use App\Models\User;
// use Hash;
// use Illuminate\Http\Request;

// class AuthController extends Controller
// {
//     public function register(Request $request){
//         $fields = $request-> validate([
//             'name' => 'required|max:255',
//             'email'=> 'required|email|unique:users',
//             'password'=> 'required|confirmed'
//         ]);

//         $user = User::create($fields);
//         $token = $user->createToken($request->name);

//         return [
//             'user' => $user,
//             'token'=> $token->plainTextToken
//         ];
//     }
//     public function login(Request $request){
//         $request-> validate([
//             'email'=> 'required|email|exists:users',
//             'password'=> 'required'
//         ]);

//         $user = User::where('email', $request->email)->first();

//         if ( !$user || !Hash::check($request->password, $user->password)) {
//             return [
//                 'message' => 'The provided credential are incorrect'
//             ];
//         }

//         $token = $user->createToken($user->name);

//         return [
//             'user' => $user,
//             'token'=> $token->plainTextToken
//         ];

//     }
//     public function logout(Request $request){
//         $request -> user() ->tokens() ->delete();

//         return [
//             'message' => 'You are logout'
//         ];
//     }
// }

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
   
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không chính xác'], 401);
        }

        $user = User::with('roles')->find(auth('api')->user()->id);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'phone'    => 'required|string|max:15',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        if (method_exists($user, 'assignRole')) {
            $user->assignRole('Patient');
        }

        $user->load('roles');

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng ký tài khoản thành công!',
            'user' => $user
        ], 201);
    }


    public function me()
    {
        $user = User::with('roles')->find(auth('api')->user()->id);
        return response()->json($user);
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }
}

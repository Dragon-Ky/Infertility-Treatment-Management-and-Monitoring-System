<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    // Admin xem danh sách mọi người
    public function index() {
        $users = User::all();
        $roles = Role::all();
        return view('admin.users', compact('users', 'roles'));
    }

    // Admin đổi quyền cho User (Ví dụ nâng cấp lên Doctor)
    public function updateRole(Request $request, User $user) {
        $user->syncRoles($request->role);
        return back()->with('status', 'Cập nhật vai trò thành công!');
    }
}

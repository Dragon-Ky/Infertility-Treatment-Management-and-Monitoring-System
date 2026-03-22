<x-app-layout>
    <div class="py-12"><div class="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-white p-6 shadow rounded">
        <h2 class="text-2xl font-bold mb-4">Quản lý người dùng</h2>
        <table class="w-full border-collapse border border-gray-200">
            <thead class="bg-gray-100">
                <tr><th class="border p-2">Tên</th><th class="border p-2">Email</th><th class="border p-2">Vai trò hiện tại</th><th class="border p-2">Đổi vai trò</th></tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                <tr>
                    <td class="border p-2 text-center">{{ $user->name }}</td>
                    <td class="border p-2 text-center">{{ $user->email }}</td>
                    <td class="border p-2 text-center text-blue-600 font-bold">{{ $user->getRoleNames()->first() }}</td>
                    <td class="border p-2 text-center">
                        <form action="{{ route('admin.updateRole', $user->id) }}" method="POST">
                            @csrf
                            <select name="role" class="rounded border-gray-300">
                                @foreach($roles as $role)
                                    <option value="{{ $role->name }}" {{ $user->hasRole($role->name) ? 'selected' : '' }}>{{ $role->name }}</option>
                                @endforeach
                            </select>
                            <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded ml-2">Lưu</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div></div>
</x-app-layout>

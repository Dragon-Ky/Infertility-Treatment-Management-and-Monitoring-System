<?php
use Illuminate\Support\Facades\Schedule;
use App\Jobs\ProcessRemindersJob;

// Hẹn giờ: Chạy Job kiểm tra nhắc nhở mỗi phút
Schedule::job(new ProcessRemindersJob)->everyMinute(5);
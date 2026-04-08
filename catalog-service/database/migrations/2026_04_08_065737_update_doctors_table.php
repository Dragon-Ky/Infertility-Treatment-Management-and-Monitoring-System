<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {

            
            $table->unsignedBigInteger('user_id')->nullable()->after('id');

            
            $table->string('full_name')->nullable()->after('user_id');

           
            $table->string('avatar')->nullable();
            $table->string('specialization')->nullable()->change(); // nếu đã có thì giữ
            $table->string('degree')->nullable();
            $table->integer('experience_years')->default(0);

            
            $table->text('bio')->nullable();
            $table->text('education')->nullable();
            $table->text('certifications')->nullable();

            
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->integer('rating_count')->default(0);

            
            $table->decimal('consultation_fee', 10, 2)->default(0);

            
            $table->enum('status', ['active', 'inactive'])->default('active');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn([
                'user_id',
                'full_name',
                'avatar',
                'degree',
                'experience_years',
                'bio',
                'education',
                'certifications',
                'rating_avg',
                'rating_count',
                'consultation_fee',
                'status'
            ]);
        });
    }
};
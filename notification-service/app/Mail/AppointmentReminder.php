<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $appointmentType;
    public $appointmentDate;
    public $appointmentTime;
    public $doctorName;
    public $notes;

    /**
     * Create a new message instance.
     */
    public function __construct($data)
    {
        $this->userName = $data['user_name'];
        $this->appointmentType = $data['appointment_type'];
        $this->appointmentDate = $data['appointment_date'];
        $this->appointmentTime = $data['appointment_time'];
        $this->doctorName = $data['doctor_name'];
        $this->notes = $data['notes'] ?? '';
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thông báo nhắc nhở lịch khám - Infertility Management System',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-reminder',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

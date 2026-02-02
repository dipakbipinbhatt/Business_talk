import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            console.warn('Email credentials not configured. Email notifications will be disabled.');
            return;
        }

        try {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailUser,
                    pass: emailPass, // Use App Password for Gmail
                },
            });

            console.log('Email service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize email service:', error);
        }
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        if (!this.transporter) {
            console.warn('Email service not configured. Skipping email send.');
            return false;
        }

        try {
            await this.transporter.sendMail({
                from: `"Business Talk" <${process.env.EMAIL_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });

            console.log(`Email sent successfully to ${options.to}`);
            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    }

    async sendContactNotification(name: string, email: string, message: string): Promise<boolean> {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

        if (!adminEmail) {
            console.warn('Admin email not configured');
            return false;
        }

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #800000;">New Contact Form Submission</h2>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <p style="color: #666; font-size: 12px;">
                    This message was sent from the Business Talk contact form.
                </p>
            </div>
        `;

        return this.sendEmail({
            to: adminEmail,
            subject: `New Contact Form Message from ${name}`,
            html,
        });
    }
}

export default new EmailService();

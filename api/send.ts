import { Resend } from 'resend';

export default async function handler(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY is not configured on Vercel. Go to Settings > Environment Variables to add it.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { name, email, phone, reachingOutAs, projectType, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Machina Inquiry <onboarding@resend.dev>',
      to: ['kelvin@brightbeam.io'],
      subject: `New Project Inquiry: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Project Inquiry</h2>
          
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Reaching out as:</strong> ${reachingOutAs || 'Not specified'}</p>
            <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
          </div>
          
          <div style="margin-top: 30px;">
            <p><strong>Message:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
          </div>
          
          <footer style="margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; pt-10;">
            This email was sent from the Machina Contact Form.
          </footer>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: `Server error: ${error.message || 'Unknown'}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

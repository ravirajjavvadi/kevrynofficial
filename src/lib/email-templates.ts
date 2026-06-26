/**
 * Sovereign Email Protocol
 * Designed for KevRyn Technologies
 */

export const getSelectionEmail = (name: string, role: string, loginUrl: string, id: string, internPwd?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #111111; border: 1px solid #333; border-radius: 24px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #00d2ff, #ff00ff); padding: 40px 20px; text-align: center; }
        .logo { background-color: #000; color: #fff; width: 50px; height: 50px; line-height: 50px; border-radius: 12px; font-weight: 900; margin: 0 auto 10px; display: block; font-size: 20px; }
        .content { padding: 40px; }
        h1 { font-size: 24px; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px; text-transform: uppercase; color: #00d2ff; }
        p { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.7); margin-bottom: 20px; }
        .role-badge { display: inline-block; background: rgba(0, 210, 255, 0.1); border: 1px solid #00d2ff; color: #00d2ff; padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; }
        .credentials { background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 30px; }
        .cred-item { margin-bottom: 15px; }
        .cred-label { font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; display: block; }
        .cred-value { font-size: 16px; font-weight: 700; color: #FFFFFF; font-family: monospace; }
        .cta-button { display: block; background: #00d2ff; color: #000; text-align: center; padding: 16px; border-radius: 12px; font-weight: 900; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .footer { padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; }
        .footer-text { font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1.5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">KR</div>
            <div style="font-size: 12px; font-weight: 900; letter-spacing: 2px; color: #000;">KEVRYN TECHNOLOGIES</div>
        </div>
        <div class="content">
            <h1>Internship Selection Confirmation</h1>
            <p>Greetings <strong>${name}</strong>,</p>
            <p>Following your exceptional performance in our Qualifier Arena, we are pleased to officially extend an offer for the following role:</p>
            <div class="role-badge">${role}</div>
            
            <p>Your unique digital offer is ready for review. Access your credentials below to enter the Sovereign Intern OS:</p>
            
            <div class="credentials">
                <div class="cred-item">
                    <span class="cred-label">Platform URL</span>
                    <span class="cred-value">kevryn.ai/workspace</span>
                </div>
                <div class="cred-item">
                    <span class="cred-label">Login Account</span>
                    <span class="cred-value">Your Email</span>
                </div>
                ${internPwd ? `
                <div class="cred-item">
                    <span class="cred-label">Generated Password</span>
                    <span class="cred-value" style="color: #00d2ff;">${internPwd}</span>
                </div>
                ` : ''}
            </div>

            <a href="${loginUrl}" class="cta-button">Access OS Workspace</a>
            
            <p style="margin-top: 30px; font-size: 12px;">Welcome to the ecosystem where AI innovation meets absolute sovereign engineering. We look forward to your contributions.</p>
        </div>
        <div class="footer">
            <div class="footer-text">Official Protocol • KevRyn Revolution</div>
        </div>
    </div>
</body>
</html>
`;

export const getRejectionEmail = (name: string, role: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #111111; border: 1px solid #333; border-radius: 24px; overflow: hidden; }
        .header { background: #1A1A1A; padding: 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .logo { background-color: #333; color: #fff; width: 50px; height: 50px; line-height: 50px; border-radius: 12px; font-weight: 900; margin: 0 auto 10px; display: block; font-size: 20px; border: 1px solid rgba(255,255,255,0.1); }
        .content { padding: 40px; }
        h1 { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 20px; text-transform: uppercase; color: #FF00FF; }
        p { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.7); margin-bottom: 20px; }
        .footer { padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; }
        .footer-text { font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1.5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">KR</div>
            <div style="font-size: 10px; font-weight: 900; letter-spacing: 2px; color: rgba(255,255,255,0.4);">KEVRYN TECHNOLOGIES</div>
        </div>
        <div class="content">
            <h1>Application Status Update</h1>
            <p>Greetings <strong>${name}</strong>,</p>
            <p>Thank you for participating in the KevRyn Qualifier Arena for the <strong>${role}</strong> position.</p>
            <p>Our team has carefully evaluated your performance and cognitive alignment. At this time, we will not be moving forward with your application. The competition in the current cycle is exceptionally high, and we have reached our capacity for the current onboarding protocol.</p>
            <p>We appreciate the time and intelligence you invested in our assessment system. Your credentials will remain in our talent registry for potential future cycles.</p>
            <p>We wish you absolute success in your continued engineering journey.</p>
        </div>
        <div class="footer">
            <div class="footer-text">Official Protocol • KevRyn Revolution</div>
        </div>
    </div>
</body>
</html>
`;

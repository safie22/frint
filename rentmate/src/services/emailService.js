// Email service for sending notifications
// This is a mock service that simulates sending emails

// Email templates
const EMAIL_TEMPLATES = {
    // Landlord account status templates
    LANDLORD_APPROVED: {
      subject: 'Your RentMate Landlord Account Has Been Approved',
      body: (name) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Account Approved!</h2>
          <p>Dear ${name},</p>
          <p>We're pleased to inform you that your landlord account on RentMate has been <strong>approved</strong>!</p>
          <p>You can now:</p>
          <ul>
            <li>List your properties</li>
            <li>Manage your existing listings</li>
            <li>Communicate with potential tenants</li>
            <li>Review rental applications</li>
          </ul>
          <p>Log in to your account to get started.</p>
          <div style="margin: 30px 0;">
            <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Go to My Dashboard</a>
          </div>
          <p>Thank you for choosing RentMate for your property management needs.</p>
          <p>Best regards,<br>The RentMate Team</p>
        </div>
      `
    },
    LANDLORD_REJECTED: {
      subject: 'RentMate Account Application Status',
      body: (name, reason) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Account Review Update</h2>
          <p>Dear ${name},</p>
          <p>We've reviewed your application to join RentMate as a landlord. Unfortunately, we are unable to approve your account at this time.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>If you believe this is an error or would like to provide additional information, please contact our support team for assistance.</p>
          <div style="margin: 30px 0;">
            <a href="#" style="background-color: #6b7280; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Contact Support</a>
          </div>
          <p>Thank you for your interest in RentMate.</p>
          <p>Best regards,<br>The RentMate Team</p>
        </div>
      `
    },
    
    // Property listing status templates
    PROPERTY_APPROVED: {
      subject: 'Your Property Listing Has Been Approved',
      body: (name, propertyTitle) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Property Listing Approved!</h2>
          <p>Dear ${name},</p>
          <p>Great news! Your property listing <strong>"${propertyTitle}"</strong> has been reviewed and approved.</p>
          <p>Your property is now visible to potential tenants and they can:</p>
          <ul>
            <li>View your property details</li>
            <li>Contact you for more information</li>
            <li>Submit rental applications</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View My Listing</a>
          </div>
          <p>Thank you for listing your property on RentMate.</p>
          <p>Best regards,<br>The RentMate Team</p>
        </div>
      `
    },
    PROPERTY_REJECTED: {
      subject: 'Your Property Listing Requires Attention',
      body: (name, propertyTitle, reason) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Property Listing Update</h2>
          <p>Dear ${name},</p>
          <p>We've reviewed your property listing <strong>"${propertyTitle}"</strong> and found that it doesn't meet our current guidelines.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>You can make the necessary changes and resubmit your listing for review.</p>
          <div style="margin: 30px 0;">
            <a href="#" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Edit My Listing</a>
          </div>
          <p>If you have any questions or need assistance, please contact our support team.</p>
          <p>Best regards,<br>The RentMate Team</p>
        </div>
      `
    }
  };
  
  // Mock function to simulate sending an email
  const sendEmail = (to, subject, body) => {
    return new Promise((resolve) => {
      // Log the email for demonstration
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body.substring(0, 100)}...`);
      
      // In a real application, this would use an email service like SendGrid, Mailgun, etc.
      // For this demo, we'll just simulate a successful send after a delay
      setTimeout(() => {
        resolve({
          success: true,
          messageId: `mock-${Date.now()}`,
          to,
          timestamp: new Date().toISOString()
        });
      }, 500);
    });
  };
  
  // Send landlord approval email
  const sendLandlordApprovalEmail = async (landlord) => {
    if (!landlord || !landlord.email) {
      throw new Error('Landlord information is required');
    }
    
    const template = EMAIL_TEMPLATES.LANDLORD_APPROVED;
    const body = template.body(landlord.name);
    
    return await sendEmail(landlord.email, template.subject, body);
  };
  
  // Send landlord rejection email
  const sendLandlordRejectionEmail = async (landlord, reason = '') => {
    if (!landlord || !landlord.email) {
      throw new Error('Landlord information is required');
    }
    
    const template = EMAIL_TEMPLATES.LANDLORD_REJECTED;
    const body = template.body(landlord.name, reason);
    
    return await sendEmail(landlord.email, template.subject, body);
  };
  
  // Send property approval email
  const sendPropertyApprovalEmail = async (landlord, property) => {
    if (!landlord || !landlord.email || !property) {
      throw new Error('Landlord and property information are required');
    }
    
    const template = EMAIL_TEMPLATES.PROPERTY_APPROVED;
    const body = template.body(landlord.name, property.title);
    
    return await sendEmail(landlord.email, template.subject, body);
  };
  
  // Send property rejection email
  const sendPropertyRejectionEmail = async (landlord, property, reason = '') => {
    if (!landlord || !landlord.email || !property) {
      throw new Error('Landlord and property information are required');
    }
    
    const template = EMAIL_TEMPLATES.PROPERTY_REJECTED;
    const body = template.body(landlord.name, property.title, reason);
    
    return await sendEmail(landlord.email, template.subject, body);
  };
  
  // Export functions
  export default {
    sendLandlordApprovalEmail,
    sendLandlordRejectionEmail,
    sendPropertyApprovalEmail,
    sendPropertyRejectionEmail
  };
import Contact from '../models/Contact.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Contact Message from ${contact.name}`,
      html: `
        <div style="font-family:Arial;padding:20px;background:#0a0a0a;color:#fff">
          <h2 style="color:#3b82f6">New Contact Message</h2>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
          <p><strong>Message:</strong> ${contact.message}</p>
        </div>`
    });
    res.status(201).json({ success: true, contact });
  } catch (error) { next(error); }
};

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) { next(error); }
};
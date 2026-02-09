import { Injectable, inject } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

export interface ContactFormPayload {
  from_name: string;
  from_email: string;
  phone?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactEmailService {
  async send(payload: ContactFormPayload): Promise<void> {
    const { serviceId, templateId, publicKey } = environment.emailJs;
    await emailjs.send(serviceId, templateId, payload as unknown as Record<string, unknown>, publicKey);
  }
}

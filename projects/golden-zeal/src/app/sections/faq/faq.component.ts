import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgIcon],
  template: `
    <section
      id="faq"
      class="py-16 md:py-24 px-4 md:px-8"
      style="background: var(--gz-sand); color: var(--gz-charcoal);"
    >
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            Here are answers to some of the most common questions we get from clients
          </h2>
          <div class="aspect-[4/3] rounded-lg overflow-hidden max-w-md">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500"
              alt="Team"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <div class="space-y-2">
          @for (item of faqItems; track item.question; let i = $index) {
            <div
              class="border rounded-lg overflow-hidden"
              style="border-color: var(--gz-olive);"
            >
              <button
                type="button"
                class="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-black/5 transition"
                (click)="openIndex.set(openIndex() === i ? -1 : i)"
              >
                <span>{{ item.question }}</span>
                <ng-icon
                  [name]="openIndex() === i ? 'chevronUp' : 'chevronDown'"
                  size="20"
                />
              </button>
              @if (openIndex() === i) {
                <div class="px-4 pb-4 text-sm opacity-90">{{ item.answer }}</div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AppFaqComponent {
  openIndex = signal<number>(-1);
  faqItems: FaqItem[] = [
    {
      question: 'What does your service mean?',
      answer:
        'We provide end-to-end production services tailored to your project, from concept to delivery.',
    },
    {
      question: 'How to improve my brand?',
      answer:
        'Through strategic storytelling and high-quality visual content that aligns with your brand values.',
    },
    {
      question: 'How long does it take?',
      answer:
        'Timelines vary by project scope. We will provide a detailed schedule during the discovery phase.',
    },
    {
      question: 'What are our methods?',
      answer:
        'We follow a structured process: Discovery, Production, Post-Production, and Delivery.',
    },
  ];
}

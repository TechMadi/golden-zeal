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
      class="py-16 md:py-24 px-4 md:px-8 lg:px-12"
      style="background: var(--gz-ivory); color: var(--gz-charcoal);"
    >
      <div class="max-w-7xl mx-auto grid md:grid-cols-[45%_55%] gap-12 md:gap-16 items-stretch">
        <!-- Left Column: Heading and Image -->
        <div class="flex flex-col space-y-8">
          <h2 class="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight">
            Here are answers to some of the most common questions we get from clients
          </h2>
          <div class="w-full flex-1 flex items-end">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
              alt="Team"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Right Column: FAQ List -->
        <div class="space-y-0">
          @for (item of faqItems; track item.question; let i = $index) {
            <div class="border-t border-gz-charcoal/20 first:border-t-0">
              <button
                type="button"
                class="w-full flex items-center justify-between py-6 text-left transition"
                (click)="openIndex.set(openIndex() === i ? -1 : i)"
              >
                <div class="flex items-start gap-3">
                  <span class="text-gz-charcoal font-bold text-sm md:text-base">[{{ i + 1 }}]</span>
                  <span class="text-gz-charcoal font-medium text-sm md:text-base">{{ item.question }}</span>
                </div>
                <ng-icon
                  [name]="openIndex() === i ? 'chevronUp' : 'chevronDown'"
                  size="20"
                  class="text-gz-charcoal shrink-0 ml-4"
                />
              </button>
              @if (openIndex() === i) {
                <div class="pl-8 pb-6 text-sm md:text-base text-gz-charcoal/70 leading-relaxed">
                  {{ item.answer }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AppFaqComponent {
  openIndex = signal<number>(4); // Default to item 5 (index 4) being open
  faqItems: FaqItem[] = [
    {
      question: 'What services do you offer?',
      answer:
        'We provide comprehensive production services including video production, music videos, short films, post-production, editing, color grading, and distribution.',
    },
    {
      question: 'How long does a typical project take?',
      answer:
        'Project timelines vary based on scope and complexity. We provide detailed schedules during the discovery phase, typically ranging from 2-8 weeks depending on the project type.',
    },
    {
      question: 'What is your production process?',
      answer:
        'Our process follows four key stages: Discovery & Concept, Production, Post-Production, and Delivery & Distribution. Each stage is carefully planned and executed to ensure the highest quality results.',
    },
    {
      question: 'Do you work with clients internationally?',
      answer:
        'Yes, we work with clients globally. While based in Kenya, we have experience working on projects across Africa and internationally, adapting our services to meet diverse needs.',
    },
    {
      question: 'How can I get started with a project?',
      answer:
        'Simply reach out via our contact page or call us directly. We\'ll schedule a consultation to discuss your ideas, project details, and timeline.',
    },
    {
      question: 'What makes your studio different?',
      answer:
        'We combine technical expertise with creative storytelling, ensuring each project is unique and impactful. Our team brings years of experience and a passion for elevating ideas into cinematic masterpieces.',
    },
    {
      question: 'What makes your studio different?',
      answer:
        'We combine technical expertise with creative storytelling, ensuring each project is unique and impactful. Our team brings years of experience and a passion for elevating ideas into cinematic masterpieces.',
    },
  ];
}

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
                class="w-full flex items-center justify-between py-6 text-left transition relative z-10"
                style="touch-action: manipulation; -webkit-tap-highlight-color: transparent;"
                (click)="openIndex.set(openIndex() === i ? -1 : i)"
                (touchstart)="openIndex.set(openIndex() === i ? -1 : i)"
              >
                <div class="flex items-start gap-3 flex-1">
                  <span class="text-gz-charcoal font-bold text-sm md:text-base">[{{ i + 1 }}]</span>
                  <span class="text-gz-charcoal font-medium text-sm md:text-base">{{ item.question }}</span>
                </div>
                <ng-icon
                  [name]="openIndex() === i ? 'chevronUp' : 'chevronDown'"
                  size="20"
                  class="text-gz-charcoal shrink-0 ml-4 pointer-events-none"
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
  openIndex = signal<number>(-1);
  faqItems: FaqItem[] = [
    {
      question: 'What types of projects do you produce?',
      answer:
        'We produce documentaries, television content, branded films, corporate video, and photography projects.',
    },
    {
      question: 'Do you work outside Kenya?',
      answer:
        'Yes. We operate across East, Central, West, and Southern Africa, with extended collaborations in India and Indonesia.',
    },
    {
      question: 'Do you provide full production support?',
      answer:
        'Yes. From development to delivery, including logistics, permits, crew, and post-production.',
    },
    {
      question: 'Can you support international productions filming in Africa?',
      answer:
        'Absolutely. We operate as a seamless extension of international production teams.',
    },
  ];
}

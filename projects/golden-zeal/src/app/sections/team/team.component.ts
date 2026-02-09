import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  location: string;
  imageUrl: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [],
  template: `
    <section
      id="team"
      class="py-16 md:py-24 px-4 md:px-8 lg:px-12"
      style="background: var(--gz-ivory); color: var(--gz-charcoal);"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Heading with decorative dots -->
        <div class="text-center mb-12 md:mb-16">
          <div class="flex justify-center items-center gap-1 mb-4">
            <span class="w-1 h-1 rounded-full bg-gz-charcoal"></span>
            <span class="w-1 h-1 rounded-full bg-gz-charcoal"></span>
            <span class="w-1 h-1 rounded-full bg-gz-charcoal"></span>
          </div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide">
            Our Team
          </h2>
        </div>

        <!-- Team Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12">
          @for (member of teamMembers; track member.name) {
            <div class="flex gap-4">
              <!-- Profile Image -->
              <div class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                <img
                  [src]="member.imageUrl"
                  [alt]="member.name"
                  class="w-full h-full object-cover rounded"
                />
              </div>

              <!-- Profile Details -->
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-lg md:text-xl font-bold mb-1">{{ member.name }}</h3>
                  <p class="text-sm md:text-base text-gz-charcoal/80 mb-1">{{ member.role }}</p>
                  <p class="text-sm text-gz-charcoal/70">{{ member.location }}</p>
                </div>
                <a
                  href="#"
                  class="text-sm text-[#ff6b35] underline hover:opacity-80 transition mt-2 inline-block"
                >
                  View full profile
                </a>
              </div>
            </div>
          }
        </div>

        <!-- Browse Profiles Button -->
        <div class="text-center">
          <button
            type="button"
            class="px-8 py-3 border-2 border-gz-charcoal text-gz-charcoal bg-transparent hover:bg-gz-charcoal hover:text-white transition uppercase font-medium text-sm md:text-base"
          >
            Browse Profiles
          </button>
        </div>
      </div>
    </section>
  `,
})
export class AppTeamComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'Rodgers C Gold',
      role: 'Executive Director/DOP',
      location: 'Nairobi, Kenya',
      imageUrl: 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-1.jpeg',
    },
    {
      name: 'Jane Kariuki',
      role: 'Head of Editing/ DIT / Colorist',
      location: 'San Francisco, CA',
      imageUrl: 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-2.jpg',
    },
    {
      name: 'Kanyiri Kans',
      role: 'Cinematographer/ Head of Technical',
      location: 'Fort Lauderdale, FL',
      imageUrl: 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-5.jpg',
    },
    {
      name: 'Eric Kimani',
      role: 'Director/ CGI/ Senior Editor/ Colorist',
      location: 'Los Angeles, CA',
      imageUrl: 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-1.jpg',
    },
    {
      name: 'Judy Kemboi',
      role: 'Focus Puller/ Cam Tech / Cam Op',
      location: 'New York, NY',
      imageUrl: 'https://goldenzealpictures.co.ke/wp-content/uploads/2024/05/Golden-Zeal-Team-3.png',
    },
    {
      name: 'Daniel Dufresne',
      role: 'Camera Operator',
      location: 'Chicago, IL',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    },
  ];
}

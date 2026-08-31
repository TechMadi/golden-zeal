import { Component, OnInit, signal, computed, inject, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminSupabaseService } from '../../services/admin-supabase.service';
import { PostHogService } from '../../services/posthog.service';
import type { ProjectCredit, TeamMember } from 'shared';

const CANONICAL_ROLES = [
  'Director',
  'DOP',
  'Cinematographer',
  'Producer',
  'Client Producer',
  'Grip',
  'Lighting',
  'Logistics',
  'Production Assistant',
  'Sound Engineer',
  'DIT',
  'Editor',
  'Colorist',
  'Graphics',
  'Wardrobe',
  'Talent Coordinator',
];

const SUB_CATEGORIES: Record<string, { value: string; label: string }[]> = {
  commercial: [
    { value: 'tvc',        label: 'TVC'        },
    { value: 'animations', label: 'Animations' },
  ],
  cinematic: [
    { value: 'commissioned',  label: 'Commissioned Work' },
    { value: 'original_film', label: 'Original Film'     },
  ],
};

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 md:p-10 max-w-2xl">
      <div class="flex items-center gap-4 mb-8">
        <a routerLink="/projects" class="text-xs tracking-widest uppercase" style="color:#8a9e90;">← Projects</a>
        <h1 class="text-3xl" style="font-family:'Bebas Neue',sans-serif; color:#F0EBE0;">
          {{ isEdit() ? 'EDIT PROJECT' : 'NEW PROJECT' }}
        </h1>
      </div>

      @if (saved()) {
        <div class="p-3 mb-6 text-sm" style="background:rgba(201,160,74,0.1); border:1px solid #C9A04A; color:#C9A04A;">
          Saved successfully.
        </div>
      }

      @if (errorMsg()) {
        <div class="p-3 mb-6 text-sm" style="background:rgba(220,50,50,0.1); border:1px solid #dc3232; color:#ff6b6b;">
          {{ errorMsg() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

        <!-- Title -->
        <div>
          <label for="title" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Title *</label>
          <input id="title" type="text" formControlName="title"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Slug -->
        <div>
          <label for="slug" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">
            Slug * <span style="color:#555; font-weight:400; text-transform:none; letter-spacing:0;">(auto-filled from title)</span>
          </label>
          <input id="slug" type="text" formControlName="slug"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Client -->
        <div>
          <label for="client" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Client</label>
          <input id="client" type="text" formControlName="client"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Year -->
        <div>
          <label for="year" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Year</label>
          <input id="year" type="number" formControlName="year"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Vimeo ID -->
        <div>
          <label for="vimeo_id" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Vimeo ID</label>
          <input id="vimeo_id" type="text" formControlName="vimeo_id" placeholder="e.g. 123456789"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- YouTube ID -->
        <div>
          <label for="youtube_id" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">YouTube ID</label>
          <input id="youtube_id" type="text" formControlName="youtube_id" placeholder="e.g. dQw4w9WgXcQ"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Thumbnail URL -->
        <div>
          <label for="thumbnail_url" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Thumbnail URL</label>
          <input id="thumbnail_url" type="text" formControlName="thumbnail_url"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Display Order -->
        <div>
          <label for="display_order" class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Display Order</label>
          <input id="display_order" type="number" formControlName="display_order"
                 class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                 style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Description</label>
          <textarea formControlName="description" rows="4"
                    class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none resize-vertical"
                    style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);"
                    placeholder="Brief project description shown on the project page..."></textarea>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Category</label>
          <select formControlName="category" class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                  style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1); background:#0f1f16;">
            <option value="commercial">Commercial</option>
            <option value="cinematic">Cinematic</option>
            <option value="music_video">Music Video</option>
            <option value="stills">Stills</option>
          </select>
        </div>

        <!-- Sub-category (shown only when options exist) -->
        @if (subCategoryOptions().length > 0) {
          <div>
            <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Sub-category</label>
            <select formControlName="sub_category" class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                    style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1); background:#0f1f16;">
              <option value="">— None —</option>
              @for (opt of subCategoryOptions(); track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
          </div>
        }

        <!-- Thumbnail upload -->
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase mb-2" style="color:#8a9e90;">Thumbnail Image</label>
          <input type="file" accept="image/*" (change)="onFileChange($event)"
                 [disabled]="uploadingImage()"
                 class="text-sm" style="color:#8a9e90;" />
          @if (uploadingImage()) {
            <p class="mt-2 text-xs" style="color:#C9A04A;">Uploading image...</p>
          }
          @if (form.get('thumbnail_url')?.value) {
            <img [src]="form.get('thumbnail_url')?.value" class="mt-3 h-24 object-cover" />
            <p class="mt-1 text-xs break-all" style="color:#555;">{{ form.get('thumbnail_url')?.value }}</p>
          }
        </div>

        <div class="flex gap-4 pt-4">
          <button type="submit" [disabled]="form.invalid || saving()" class="px-6 py-2 text-sm tracking-widest uppercase transition-colors"
                  style="background:#C9A04A; color:#0a150f;" [style.opacity]="saving() ? '0.6' : '1'">
            {{ saving() ? 'Saving...' : 'Save' }}
          </button>
          <a routerLink="/projects" class="px-6 py-2 text-sm tracking-widest uppercase transition-colors"
             style="border:1px solid rgba(240,235,224,0.1); color:#8a9e90;">Cancel</a>
        </div>
      </form>

      <!-- Crew Credits (Producer, Cinematographer, Grip, Editor, etc. — Director/Photographer above are separate) -->
      @if (isEdit()) {
        <div class="mt-12 pt-8" style="border-top:1px solid rgba(240,235,224,0.1);">
          <h2 class="text-xl mb-6" style="font-family:'Bebas Neue',sans-serif; color:#F0EBE0;">CREW CREDITS</h2>

          <div class="mb-6 space-y-2">
            @for (c of credits(); track c.id) {
              <div class="flex items-center justify-between p-3" style="background:#0f1f16; border:1px solid rgba(240,235,224,0.07);">
                <div>
                  <p class="text-sm" style="color:#F0EBE0;">{{ c.person_name }}</p>
                  <p class="text-xs" style="color:#8a9e90;">
                    {{ c.role }}
                    @if (c.team_member) {
                      <span style="color:#C9A04A;"> · Linked to Team</span>
                    }
                  </p>
                </div>
                <button type="button" (click)="deleteCredit(c.id)" class="text-xs uppercase" style="color:#8a9e90;">Delete</button>
              </div>
            }
            @if (credits().length === 0) {
              <p class="text-xs" style="color:#555;">No crew credits yet.</p>
            }
          </div>

          <form [formGroup]="creditForm" (ngSubmit)="onAddCredit()" class="flex flex-wrap items-end gap-3">
            <div class="flex-1 min-w-[160px] relative role-combobox">
              <label class="block text-xs tracking-[0.2em] uppercase mb-1" style="color:#8a9e90;">Role</label>
              <input type="text" placeholder="e.g. Cinematographer"
                     [value]="roleQuery()"
                     (input)="onRoleQueryChange($any($event.target).value)"
                     (focus)="roleDropdownOpen.set(true)"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
              @if (roleDropdownOpen() && filteredRoles().length > 0) {
                <div class="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto z-10" style="background:#0f1f16; border:1px solid rgba(240,235,224,0.1);">
                  @for (r of filteredRoles(); track r) {
                    <button type="button" (click)="selectRole(r)"
                            class="block w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#152a1d]"
                            style="color:#F0EBE0;">
                      {{ r }}
                    </button>
                  }
                </div>
              }
            </div>
            <div class="flex-1 min-w-[200px] relative team-member-combobox">
              <label class="block text-xs tracking-[0.2em] uppercase mb-1" style="color:#8a9e90;">
                Link to Team Member <span style="color:#555; font-weight:400; text-transform:none; letter-spacing:0;">(optional)</span>
              </label>
              <div class="flex items-center gap-2">
                <input type="text" placeholder="Not a member"
                       [value]="teamMemberQuery()"
                       (input)="onTeamMemberQueryChange($any($event.target).value)"
                       (focus)="teamMemberDropdownOpen.set(true)"
                       class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                       style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
                @if (creditForm.get('team_member_id')?.value) {
                  <button type="button" (click)="clearTeamMemberLink()" title="Unlink"
                          class="shrink-0 text-sm" style="color:#8a9e90;">✕</button>
                }
              </div>
              @if (teamMemberDropdownOpen() && filteredTeamMembers().length > 0) {
                <div class="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto z-10" style="background:#0f1f16; border:1px solid rgba(240,235,224,0.1);">
                  @for (m of filteredTeamMembers(); track m.id) {
                    <button type="button" (click)="selectTeamMember(m)"
                            class="block w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#152a1d]"
                            style="color:#F0EBE0;">
                      {{ m.name }}
                    </button>
                  }
                </div>
              }
            </div>
            <div class="flex-1 min-w-[220px]">
              <label class="block text-xs tracking-[0.2em] uppercase mb-1" style="color:#8a9e90;">
                Person Name(s) <span style="color:#555; font-weight:400; text-transform:none; letter-spacing:0;">(comma-separate for multiple — unlinked only)</span>
              </label>
              <input type="text" formControlName="person_name" placeholder="e.g. Paul Kanyiri, Julian Oburu"
                     [readOnly]="!!creditForm.get('team_member_id')?.value"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     [style.opacity]="creditForm.get('team_member_id')?.value ? '0.7' : '1'"
                     style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
            </div>
            <div class="w-24">
              <label class="block text-xs tracking-[0.2em] uppercase mb-1" style="color:#8a9e90;">Order</label>
              <input type="number" formControlName="display_order"
                     class="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
                     style="color:#F0EBE0; border:1px solid rgba(240,235,224,0.1);" />
            </div>
            <button type="submit" [disabled]="!canAddCredit() || savingCredit()"
                    class="px-4 py-2 text-xs tracking-widest uppercase transition-colors"
                    style="background:#C9A04A; color:#0a150f;" [style.opacity]="!canAddCredit() || savingCredit() ? '0.6' : '1'">
              Add
            </button>
          </form>
        </div>
      }
    </div>
  `,
})
export class ProjectFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly admin = inject(AdminSupabaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly posthogService = inject(PostHogService);

  isEdit = signal(false);
  saving = signal(false);
  saved = signal(false);
  errorMsg = signal('');
  uploadingImage = signal(false);
  teamMembers = signal<TeamMember[]>([]);
  teamMemberQuery = signal('');
  teamMemberDropdownOpen = signal(false);
  selectedCategory = signal('commercial');
  credits = signal<ProjectCredit[]>([]);
  savingCredit = signal(false);
  private projectId = '';

  subCategoryOptions = computed(() => SUB_CATEGORIES[this.selectedCategory()] ?? []);

  form = this.fb.nonNullable.group({
    title:           ['', Validators.required],
    slug:            ['', Validators.required],
    client:          [''],
    description:     [''],
    year:            [new Date().getFullYear()],
    category:        ['commercial', Validators.required],
    sub_category:    [''],
    vimeo_id:        [''],
    youtube_id:      [''],
    thumbnail_url:   [''],
    display_order:   [0],
  });

  readonly canonicalRoles = CANONICAL_ROLES;

  creditForm = this.fb.nonNullable.group({
    role:            ['', Validators.required],
    team_member_id:  [''],
    person_name:     ['', Validators.required],
    display_order:   [0],
  });

  roleQuery = signal('');
  roleDropdownOpen = signal(false);

  filteredRoles = computed(() => {
    const q = this.roleQuery().trim().toLowerCase();
    if (!q) return this.canonicalRoles;
    return this.canonicalRoles.filter((r) => r.toLowerCase().includes(q));
  });

  onRoleQueryChange(value: string): void {
    this.roleQuery.set(value);
    this.roleDropdownOpen.set(true);
    this.creditForm.patchValue({ role: value });
  }

  selectRole(role: string): void {
    this.roleQuery.set(role);
    this.roleDropdownOpen.set(false);
    this.creditForm.patchValue({ role });
  }

  filteredTeamMembers = computed(() => {
    const q = this.teamMemberQuery().trim().toLowerCase();
    if (!q) return this.teamMembers();
    return this.teamMembers().filter((m) => m.name.toLowerCase().includes(q));
  });

  onTeamMemberQueryChange(value: string): void {
    this.teamMemberQuery.set(value);
    this.teamMemberDropdownOpen.set(true);
    // Editing the search text after a selection invalidates that selection —
    // require picking from the filtered list again to re-link.
    if (this.creditForm.get('team_member_id')?.value) {
      this.creditForm.patchValue({ team_member_id: '' });
    }
  }

  selectTeamMember(member: TeamMember): void {
    this.teamMemberQuery.set(member.name);
    this.teamMemberDropdownOpen.set(false);
    this.creditForm.patchValue({ team_member_id: member.id, person_name: member.name });
  }

  clearTeamMemberLink(): void {
    this.teamMemberQuery.set('');
    this.creditForm.patchValue({ team_member_id: '', person_name: '' });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.roleDropdownOpen() && !(event.target as HTMLElement).closest('.role-combobox')) {
      this.roleDropdownOpen.set(false);
    }
    if (this.teamMemberDropdownOpen() && !(event.target as HTMLElement).closest('.team-member-combobox')) {
      this.teamMemberDropdownOpen.set(false);
    }
  }

  canAddCredit(): boolean {
    const { role, person_name } = this.creditForm.getRawValue();
    return !!role.trim() && !!person_name.trim();
  }

  ngOnInit(): void {
    this.admin.list<TeamMember>('team_members').subscribe((t) => this.teamMembers.set(t));

    // Auto-generate slug from title (new projects only)
    this.form.get('title')!.valueChanges.subscribe((title) => {
      if (!this.isEdit()) {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        this.form.patchValue({ slug }, { emitEvent: false });
      }
    });

    // Track category for sub-category options, clear sub_category on change
    this.form.get('category')!.valueChanges.subscribe((cat) => {
      this.selectedCategory.set(cat);
      this.form.patchValue({ sub_category: '' }, { emitEvent: false });
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.projectId = id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.admin.get<any>('projects', id).subscribe((p) => {
        if (p) {
          this.selectedCategory.set(p.category ?? 'commercial');
          this.form.patchValue(p);
        }
      });
      this.loadCredits();
    }
  }

  loadCredits(): void {
    this.admin.listCredits(this.projectId).subscribe((c) => this.credits.set(c));
  }

  onAddCredit(): void {
    if (!this.canAddCredit() || this.savingCredit()) return;

    const { role, team_member_id, person_name, display_order } = this.creditForm.getRawValue();
    const resolvedRole = role.trim();
    const names = person_name.split(',').map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return;

    this.savingCredit.set(true);
    const creates = names.map((name, i) =>
      this.admin.create('project_credits', {
        project_id: this.projectId,
        role: resolvedRole,
        person_name: name,
        // A linked team member can only ever apply to a single credited name —
        // if multiple names were entered alongside a link, only the first gets it.
        team_member_id: team_member_id && i === 0 ? team_member_id : null,
        display_order: display_order + i,
      })
    );
    forkJoin(creates).subscribe({
      next: () => {
        this.savingCredit.set(false);
        this.creditForm.reset({ role: '', team_member_id: '', person_name: '', display_order: 0 });
        this.roleQuery.set('');
        this.teamMemberQuery.set('');
        this.loadCredits();
      },
      error: () => this.savingCredit.set(false),
    });
  }

  deleteCredit(id: string): void {
    if (!confirm('Delete this credit?')) return;
    this.admin.delete('project_credits', id).subscribe(() => this.loadCredits());
  }

  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingImage.set(true);
    try {
      const path = `thumbnails/${Date.now()}-${file.name}`;
      const url = await this.admin.uploadImage('media', path, file);
      this.form.patchValue({ thumbnail_url: url });
    } catch (err: unknown) {
      const msg = (err instanceof Error ? err.message : (err as { message?: string })?.message) ?? 'Upload failed';
      this.errorMsg.set(msg);
    } finally {
      this.uploadingImage.set(false);
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.errorMsg.set('');

    // Convert empty strings to null for optional fields
    const data = Object.fromEntries(
      Object.entries(this.form.getRawValue()).map(([k, v]) => [k, v === '' ? null : v])
    );

    const obs = this.isEdit()
      ? this.admin.update('projects', this.projectId, data)
      : this.admin.create('projects', data);

    obs.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.saved.set(true);
        const eventName = this.isEdit() ? 'project_updated' : 'project_created';
        this.posthogService.posthog.capture(eventName, {
          project_category: (saved as Record<string, unknown>)['category'] as string | undefined,
          project_title: (saved as Record<string, unknown>)['title'] as string | undefined,
        });
        setTimeout(() => this.router.navigate(['/projects']), 1000);
      },
      error: (err: unknown) => {
        this.saving.set(false);
        const msg = (err instanceof Error ? err.message : (err as { message?: string })?.message) ?? JSON.stringify(err);
        this.errorMsg.set(`Save failed: ${msg}`);
        this.posthogService.posthog.captureException(err instanceof Error ? err : new Error(msg));
      },
    });
  }
}

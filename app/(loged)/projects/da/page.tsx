"use client"

// ─────────────────────────────────────────────────────
// Wizyy — Direction Artistique v2.0
// React + Tailwind CSS v4 + shadcn/ui
// ─────────────────────────────────────────────────────

import {
  LayoutGrid, MessageSquare, CheckSquare, CalendarDays,
  FlaskConical, Zap, Plus, Pencil, Trash2, Check,
  Settings, Users, FolderOpen, Bell,
} from "lucide-react"

import { Button }                           from "@/src/components/ui/shadcn/button"
import { Badge }                            from "@/src/components/ui/shadcn/badge"
import { Input }                            from "@/src/components/ui/shadcn/input"
import { Textarea }                         from "@/src/components/ui/shadcn/textarea"
import { Label }                            from "@/src/components/ui/shadcn/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/src/components/ui/shadcn/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/shadcn/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/shadcn/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/shadcn/select"
import { Separator }   from "@/src/components/ui/shadcn/separator"
import { Progress }    from "@/src/components/ui/shadcn/progress"
import { Switch }      from "@/src/components/ui/shadcn/switch"
import { Checkbox }    from "@/src/components/ui/shadcn/checkbox"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/components/ui/shadcn/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/shadcn/dropdown-menu"

/* ─────────────────────────────────────────────────────
   TOKENS (miroir du globals.css)
   ───────────────────────────────────────────────────── */
const C = {
  bgBase:      "var(--background)",
  bgSurface:   "var(--surface)",
  bgCard:      "var(--card)",
  bgElevated:  "var(--card-elevated)",
  bgOverlay:   "var(--popover)",
  violet:      "var(--primary)",
  violetLight: "var(--primary-light)",
  violetGhost: "var(--primary-ghost)",
  cyan:        "var(--cyan)",
  cyanDim:     "var(--cyan-dim)",
  fg:          "var(--foreground)",
  fgMuted:     "var(--foreground-muted)",
  fgSubtle:    "var(--foreground-subtle)",
  border:      "var(--border)",
  borderMd:    "var(--border-md)",
  borderHi:    "var(--border-hi)",
  success:     "var(--success)",
  successBg:   "var(--success-bg)",
  successBd:   "var(--success-border)",
  warning:     "var(--warning)",
  warningBg:   "var(--warning-bg)",
  warningBd:   "var(--warning-border)",
  danger:      "var(--destructive)",
  dangerBg:    "var(--destructive-bg)",
  dangerBd:    "var(--destructive-border)",
  info:        "var(--info)",
  infoBg:      "var(--info-bg)",
  infoBd:      "var(--info-border)",
  gradPrimary: "linear-gradient(135deg, var(--primary), var(--primary-light))",
  gradAccent:  "linear-gradient(135deg, var(--cyan), var(--primary))",
  gradAvatar:  "linear-gradient(135deg, #a855f7, #ec4899)",
}

/* ─────────────────────────────────────────────────────
   UTILITAIRES LOCAUX
   ───────────────────────────────────────────────────── */

function SectionHeader({ num, title }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-[11px] font-extrabold tracking-wider text-primary-light">{num}</span>
      <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-foreground-subtle">{title}</span>
      <Separator className="flex-1" />
    </div>
  )
}

function Section({ num, title, children, id }) {
  return (
    <section id={id} className="mb-20">
      <SectionHeader num={num} title={title} />
      {children}
    </section>
  )
}

function RowLabel({ children }) {
  return (
    <p className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-foreground-subtle pb-2.5 mb-4 border-b border-border">
      {children}
    </p>
  )
}

function GradientText({ children, accent = false, className = "" }) {
  return (
    <span
      className={className}
      style={{
        background: accent ? C.gradAccent : C.gradPrimary,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  )
}

/* ─────────────────────────────────────────────────────
   PAGE PRINCIPALE
   ───────────────────────────────────────────────────── */
export default function WizyyDA() {
  return (
    <TooltipProvider>
      <div className="min-h-screen antialiased bg-background text-foreground">

        {/* Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
          <div className="absolute -top-48 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[80px] bg-primary" />
          <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full opacity-[0.05] blur-[80px] bg-cyan" />
        </div>

        {/* ── Nav sticky ────────────────────────────────── */}
        <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-8 flex items-center justify-between h-14">

            <div className="flex items-center gap-2.5 font-extrabold text-[15px] tracking-[-0.04em]">
              <div className="size-[26px] rounded-[6px] grid place-items-center flex-shrink-0 shadow-[0_0_14px_var(--primary-ghost)]"
                style={{ background: C.gradPrimary }}>
                <Zap size={13} className="fill-white text-white" />
              </div>
              Wiz<span className="text-primary-light">yy</span>
            </div>

            <div className="hidden md:flex gap-1">
              {["Brand", "Couleurs", "Typo", "Composants", "UI Shell"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full text-foreground-subtle hover:text-foreground hover:bg-popover transition-colors">
                  {l}
                </a>
              ))}
            </div>

            <Badge variant="outline" className="text-primary-light border-primary/30 bg-primary-ghost text-[10px] font-bold tracking-[0.05em]">
              DA v2.0
            </Badge>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl mx-auto px-8 pb-32">

          {/* ── Hero ──────────────────────────────────────── */}
          <header className="py-20 border-b border-border mb-20">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-0.5 rounded-full" style={{ background: C.gradPrimary }} />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary-light">
                Direction Artistique — Refonte 2026
              </span>
            </div>
            <h1 className="font-extrabold tracking-[-0.05em] leading-none mb-6"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.6rem)" }}>
              Wizyy<br />
              <GradientText accent className="font-light italic text-[0.9em]">Design System</GradientText>
            </h1>
            <p className="text-[15px] leading-7 max-w-md text-foreground-muted">
              Référentiel visuel complet de la nouvelle identité Wizyy. Palette affinée,
              typographie renforcée, composants shadcn/ui pour une expérience maker/client de qualité.
            </p>
            <div className="flex gap-8 mt-9">
              {[["2","Polices"],["13","Tokens"],["9","Composants"],["5","Radius"]].map(([v, k]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <GradientText className="text-[18px] font-extrabold tracking-[-0.03em]">{v}</GradientText>
                  <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-foreground-subtle">{k}</span>
                </div>
              ))}
            </div>
          </header>

          {/* ══ 01 · BRAND ══════════════════════════════════ */}
          <Section num="01" title="Identité de marque" id="brand">
            <div className="flex flex-wrap gap-4 items-end">

              {/* Logo dark */}
              <div className="flex flex-col gap-2">
                <Card className="border-border-md bg-card overflow-hidden relative">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at top left, var(--primary-ghost), transparent 60%)" }} />
                  <CardContent className="flex items-center gap-3 px-7 py-5">
                    <div className="size-[38px] rounded-[9px] grid place-items-center flex-shrink-0 shadow-[0_0_20px_var(--primary-ghost)]"
                      style={{ background: C.gradPrimary }}>
                      <Zap size={20} className="fill-white text-white" />
                    </div>
                    <span className="text-[22px] font-black tracking-[-0.05em]">
                      Wiz<span className="text-primary-light">yy</span>
                    </span>
                  </CardContent>
                </Card>
                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-center text-foreground-subtle">Fond sombre</p>
              </div>

              {/* Logo light */}
              <div className="flex flex-col gap-2">
                <Card className="border-black/8 overflow-hidden" style={{ background: "#f0f2ff" }}>
                  <CardContent className="flex items-center gap-3 px-7 py-5">
                    <div className="size-[38px] rounded-[9px] grid place-items-center flex-shrink-0"
                      style={{ background: C.gradPrimary }}>
                      <Zap size={20} className="fill-white text-white" />
                    </div>
                    <span className="text-[22px] font-black tracking-[-0.05em]" style={{ color: "#0e1018" }}>
                      Wiz<span style={{ color: "var(--primary)" }}>yy</span>
                    </span>
                  </CardContent>
                </Card>
                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-center text-foreground-subtle">Fond clair</p>
              </div>

              {/* Favicon / Variante */}
              {[{ grad: C.gradPrimary, shadow: true, label: "Favicon" }, { grad: C.gradAccent, shadow: false, label: "Variante accent" }].map((item) => (
                <div key={item.label} className="flex flex-col gap-2 items-center">
                  <div className="size-[68px] rounded-2xl grid place-items-center"
                    style={{ background: item.grad, boxShadow: item.shadow ? "0 0 32px var(--primary-ghost)" : undefined }}>
                    <Zap size={34} className="fill-white text-white" />
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-foreground-subtle">{item.label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ══ 02 · COLORS ═════════════════════════════════ */}
          <Section num="02" title="Palette de couleurs" id="couleurs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Arrière-plans",
                  items: [
                    { name: "Background",   token: "--background",    usage: "Page principale",    color: C.bgBase },
                    { name: "Surface",      token: "--surface",       usage: "Sidebar, panels",    color: C.bgSurface },
                    { name: "Card",         token: "--card",          usage: "Cartes, widgets",    color: C.bgCard },
                    { name: "Card Elevated",token: "--card-elevated", usage: "Hover, inputs",      color: C.bgElevated },
                    { name: "Popover",      token: "--popover",       usage: "Modaux, dropdowns",  color: C.bgOverlay },
                  ],
                },
                {
                  title: "Brand & Accents",
                  items: [
                    { name: "Primary",        token: "--primary",       usage: "CTA, liens actifs",   color: C.violet },
                    { name: "Primary Light",  token: "--primary-light", usage: "Texte actif, nav",    color: C.violetLight },
                    { name: "Primary Ghost",  token: "--primary-ghost", usage: "Fonds subtils",       color: C.violetGhost },
                    { name: "Cyan ✦ Nouveau", token: "--cyan",          usage: "Accent, highlights",  color: C.cyan },
                    { name: "Grad. Primary",  token: "gradient",        usage: "Logos, valeurs clés", color: C.gradPrimary },
                  ],
                },
                {
                  title: "Textes",
                  items: [
                    { name: "Foreground",        token: "--foreground",        usage: "Titres, corps principal",    color: C.fg },
                    { name: "Foreground Muted",  token: "--foreground-muted",  usage: "Labels, descriptions",       color: C.fgMuted },
                    { name: "Foreground Subtle", token: "--foreground-subtle", usage: "Placeholders, séparateurs",  color: C.fgSubtle },
                  ],
                },
                {
                  title: "États sémantiques",
                  items: [
                    { name: "Success",     token: "--success",     usage: "Validé, DONE",      color: C.success },
                    { name: "Warning",     token: "--warning",     usage: "En attente",         color: C.warning },
                    { name: "Destructive", token: "--destructive", usage: "Erreur, suppression",color: C.danger },
                    { name: "Info",        token: "--info",        usage: "Infos, badge CLIENT",color: C.info },
                  ],
                },
              ].map((group) => (
                <Card key={group.title} className="border-border bg-card overflow-hidden">
                  <CardHeader className="px-4 py-3.5 border-b border-border">
                    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-foreground-subtle">{group.title}</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    {group.items.map((item) => (
                      <div key={item.name}
                        className="flex items-center gap-3.5 px-4 py-2.5 border-b border-border last:border-b-0 hover:bg-white/[0.02] transition-colors">
                        <div className="size-9 rounded-md flex-shrink-0 border border-white/[0.08]"
                          style={{ background: item.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-foreground truncate">{item.name}</p>
                          <p className="text-[10.5px] font-mono text-foreground-subtle">{item.token}</p>
                          <p className="text-[9.5px] text-foreground-subtle">{item.usage}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          {/* ══ 03 · TYPOGRAPHY ══════════════════════════════ */}
          <Section num="03" title="Typographie" id="typo">
            <Card className="border-border bg-card overflow-hidden">
              <CardContent className="p-0">
                {[
                  { tag: "Display",       spec: "font-black · clamp 2.8–4.6rem · −0.05em",
                    sample: <p className="text-5xl font-black tracking-[-0.05em] leading-none">Wizyy Platform</p> },
                  { tag: "Heading 1",     spec: "font-extrabold · 28px · −0.04em",
                    sample: <p className="text-[28px] font-extrabold tracking-[-0.04em]">Tableau de bord</p> },
                  { tag: "Heading 2",     spec: "font-bold · 20px · −0.02em",
                    sample: <p className="text-xl font-bold tracking-[-0.02em]">Updates récentes</p> },
                  { tag: "Heading 3",     spec: "font-bold · 15px · −0.01em",
                    sample: <p className="text-[15px] font-bold tracking-[-0.01em]">Membres du projet</p> },
                  { tag: "Body",          spec: "font-normal · 14px · leading-7 · muted",
                    sample: <p className="text-sm leading-7 text-foreground-muted">Wizyy centralise la relation maker–client : updates, feedbacks, tests et suivi de projet en un seul espace.</p> },
                  { tag: "Label UC",      spec: "font-bold · 10px · tracking-[0.15em] · uppercase",
                    sample: <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-foreground-subtle">Navigation du projet</p> },
                  { tag: "Italic accent", spec: "font-light italic · gradient accent · grands titrages",
                    sample: <GradientText accent className="text-3xl font-light italic tracking-[-0.03em]">Design System</GradientText> },
                  { tag: "Mono",          spec: "font-mono · 11px · primary-light",
                    sample: <p className="font-mono text-[11px] text-primary-light">#7060ea · oklch(0.58 0.23 288)</p> },
                ].map((row) => (
                  <div key={row.tag} className="flex border-b border-border last:border-b-0">
                    <div className="w-44 flex-shrink-0 px-5 py-5 border-r border-border bg-white/[0.01] flex flex-col justify-center gap-1">
                      <span className="text-[9.5px] font-extrabold tracking-[0.12em] uppercase text-primary-light">{row.tag}</span>
                      <span className="text-[9.5px] font-mono leading-[1.7] mt-0.5 text-foreground-subtle">{row.spec}</span>
                    </div>
                    <div className="flex-1 px-6 py-5 flex items-center">{row.sample}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>

          {/* ══ 04 · BUTTONS ════════════════════════════════ */}
          <Section num="04" title="Boutons" id="composants">
            <Card className="border-border bg-card">
              <CardContent className="p-7 flex flex-col gap-7">

                <div>
                  <RowLabel>Variantes shadcn</RowLabel>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    <Button><Plus size={13} />Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive"><Trash2 size={13} />Destructive</Button>
                    {/* Accent personnalisé */}
                    <Button className="bg-cyan-dim text-cyan border border-cyan-border hover:bg-cyan/18 gap-1.5">
                      <Zap size={13} className="fill-current" />Accent ✦
                    </Button>
                  </div>
                </div>

                <div>
                  <RowLabel>États sémantiques</RowLabel>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    <Button className="bg-success-bg text-success border border-success-border hover:brightness-110 gap-1.5">
                      <Check size={13} />Valider
                    </Button>
                    <Button variant="destructive" className="gap-1.5"><Trash2 size={13} />Supprimer</Button>
                    <Button disabled>Disabled</Button>
                    <Button variant="outline" disabled>Disabled</Button>
                  </div>
                </div>

                <div>
                  <RowLabel>Tailles</RowLabel>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    <Button size="lg"><Plus size={15} />Large</Button>
                    <Button><Plus size={13} />Default</Button>
                    <Button size="sm"><Plus size={12} />Small</Button>
                    <Separator orientation="vertical" className="h-7 mx-1" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon"><Pencil size={14} /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Éditer</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon"><Trash2 size={14} /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Supprimer</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon"><Settings size={14} /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Paramètres</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon"><Plus size={14} /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Ajouter</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* DropdownMenu */}
                <div>
                  <RowLabel>Dropdown Menu</RowLabel>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Actions <Settings size={13} className="ml-1" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44">
                      <DropdownMenuLabel>Projet</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Pencil size={13} className="mr-2" />Éditer</DropdownMenuItem>
                      <DropdownMenuItem><Users size={13} className="mr-2" />Membres</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 size={13} className="mr-2" />Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </CardContent>
            </Card>
          </Section>

          {/* ══ 05 · BADGES ══════════════════════════════════ */}
          <Section num="05" title="Badges & Tags">
            <Card className="border-border bg-card">
              <CardContent className="p-7 flex flex-col gap-6">

                <div>
                  <RowLabel>Variantes shadcn</RowLabel>
                  <div className="flex flex-wrap gap-2.5">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                <div>
                  <RowLabel>Statuts projet — custom</RowLabel>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {[
                      { label: "En cours",   bg: "var(--primary-ghost)",  color: "var(--primary-light)", bd: "var(--primary)/30", dot: "var(--primary-light)" },
                      { label: "Validé",     bg: "var(--success-bg)",     color: "var(--success)",       bd: "var(--success-border)", dot: "var(--success)" },
                      { label: "En attente", bg: "var(--warning-bg)",     color: "var(--warning)",       bd: "var(--warning-border)", dot: "var(--warning)" },
                      { label: "Bloqué",     bg: "var(--destructive-bg)", color: "var(--destructive)",   bd: "var(--destructive-border)", dot: "var(--destructive)" },
                      { label: "Brouillon",  bg: "var(--card-elevated)",  color: "var(--foreground-muted)", bd: "var(--border-md)", dot: "var(--foreground-subtle)" },
                    ].map((b) => (
                      <span key={b.label}
                        className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full border"
                        style={{ background: b.bg, color: b.color, borderColor: b.bd }}>
                        <span className="size-[5px] rounded-full inline-block" style={{ background: b.dot }} />
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <RowLabel>Rôles & types</RowLabel>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge className="bg-primary text-primary-foreground border-transparent">MAKER</Badge>
                    <Badge className="bg-info-bg text-info border-info-border">CLIENT</Badge>
                    <Badge className="bg-cyan-dim text-cyan border-cyan-border">DÉVELOPPEMENT</Badge>
                    <Badge variant="outline" className="text-warning border-warning-border bg-warning-bg">DESIGN</Badge>
                    <Badge variant="destructive">BUG</Badge>
                    <Badge className="bg-success-bg text-success border-success-border">TEST</Badge>
                    <Badge variant="secondary">DOCUMENTATION</Badge>
                  </div>
                </div>

                <div>
                  <RowLabel>Priorité Todos</RowLabel>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">LOW</Badge>
                    <Badge className="bg-info-bg text-info border-info-border">MEDIUM</Badge>
                    <Badge className="bg-warning-bg text-warning border-warning-border">HIGH</Badge>
                    <Badge variant="destructive">CRITICAL</Badge>
                  </div>
                </div>

              </CardContent>
            </Card>
          </Section>

          {/* ══ 06 · FORMULAIRES ════════════════════════════ */}
          <Section num="06" title="Formulaires">
            <Card className="border-border bg-card">
              <CardContent className="p-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11.5px] font-bold tracking-wide text-foreground-muted">
                      Email <span className="text-primary-light">*</span>
                    </Label>
                    <Input type="email" placeholder="maker@wizyy.app"
                      className="bg-input border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring" />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11.5px] font-bold tracking-wide text-foreground-muted">
                      Mot de passe <span className="text-primary-light">*</span>
                    </Label>
                    <Input type="password" placeholder="••••••••"
                      className="bg-input border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring" />
                    <p className="text-[11px] text-foreground-subtle">Minimum 8 caractères</p>
                  </div>

                  {/* Focus */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11.5px] font-bold tracking-wide text-foreground-muted">Focus state</Label>
                    <Input defaultValue="Nom du projet..."
                      className="border-primary bg-primary-ghost ring-2 ring-ring focus-visible:border-primary" />
                    <p className="text-[11px] text-primary-light">Focus actif</p>
                  </div>

                  {/* Erreur */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11.5px] font-bold tracking-wide text-foreground-muted">Erreur</Label>
                    <Input defaultValue="valeur-invalide"
                      className="border-destructive bg-destructive-bg focus-visible:ring-destructive/20" />
                    <p className="text-[11px] text-destructive">Ce champ est invalide</p>
                  </div>

                  {/* Succès */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11.5px] font-bold tracking-wide text-foreground-muted">Succès</Label>
                    <Input defaultValue="ethan@wizyy.app"
                      className="border-success bg-success-bg focus-visible:ring-success/20" />
                    <p className="text-[11px] text-success">Email disponible</p>
                  </div>

                  {/* Select */}
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11.5px] font-bold tracking-wide text-foreground-muted">Type d'update</Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border-md focus:border-primary focus:ring-ring">
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feat">Fonctionnalité</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="bug">Correction de bug</SelectItem>
                        <SelectItem value="doc">Documentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Textarea */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <Label className="text-[11.5px] font-bold tracking-wide text-foreground-muted">Contenu</Label>
                    <Textarea
                      rows={3}
                      placeholder="Décrivez les modifications apportées..."
                      className="bg-input border-border-md placeholder:text-foreground-subtle focus-visible:border-primary focus-visible:ring-ring resize-y"
                    />
                    <p className="text-[11px] text-foreground-subtle">Markdown supporté</p>
                  </div>

                  {/* Switch + Checkbox */}
                  <div className="flex flex-col gap-4">
                    <RowLabel>Contrôles</RowLabel>
                    <div className="flex items-center gap-3">
                      <Switch id="notif" />
                      <Label htmlFor="notif" className="text-sm font-medium cursor-pointer">Notifications activées</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="visible" />
                      <Label htmlFor="visible" className="text-sm font-medium cursor-pointer">Visible par les clients</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="checked" defaultChecked />
                      <Label htmlFor="checked" className="text-sm font-medium cursor-pointer">Update publiée</Label>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </Section>

          {/* ══ 07 · ALERTS ══════════════════════════════════ */}
          <Section num="07" title="Alertes">
            <div className="flex flex-col gap-3">
              <Alert className="border-success-border bg-success-bg text-success">
                <Check size={15} />
                <AlertTitle className="font-bold">Update validée</AlertTitle>
                <AlertDescription className="text-success/80 text-[12px]">
                  Le client a approuvé l'update du 07 Mar 2026.
                </AlertDescription>
              </Alert>
              <Alert className="border-warning-border bg-warning-bg">
                <Bell size={15} className="text-warning" />
                <AlertTitle className="font-bold text-warning">En attente de validation</AlertTitle>
                <AlertDescription className="text-warning/80 text-[12px]">
                  2 updates attendent la validation client depuis plus de 48h.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive" className="bg-destructive-bg border-destructive-border">
                <Trash2 size={15} />
                <AlertTitle className="font-bold">Action irréversible</AlertTitle>
                <AlertDescription className="text-[12px]">
                  La suppression de ce projet est définitive et ne peut pas être annulée.
                </AlertDescription>
              </Alert>
            </div>
          </Section>

          {/* ══ 08 · CARDS ════════════════════════════════════ */}
          <Section num="08" title="Cartes Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">

              {/* Stat */}
              <Card className="border-border bg-card group hover:border-border-hi hover:shadow-2xl transition-all overflow-hidden relative">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at top left, var(--primary-ghost), transparent 60%)" }} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardDescription className="text-[10.5px] font-bold tracking-[0.1em] uppercase">Updates publiées</CardDescription>
                    <div className="size-9 rounded-[6px] grid place-items-center border border-border-md bg-popover text-foreground-muted">
                      <MessageSquare size={16} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <GradientText className="text-[2rem] font-black tracking-[-0.05em] leading-none">12</GradientText>
                  <p className="text-[11.5px] text-foreground-subtle mt-2 flex items-center gap-2">
                    Dernière il y a 2h
                    <Badge className="bg-success-bg text-success border-success-border text-[9.5px]">↑ +3</Badge>
                  </p>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card className="border-border bg-card group hover:border-border-hi hover:shadow-2xl transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardDescription className="text-[10.5px] font-bold tracking-[0.1em] uppercase">Progression</CardDescription>
                    <Badge variant="outline" className="text-[10px]">68%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[2rem] font-black tracking-[-0.05em] leading-none mb-3">
                    68<span className="text-[1.1rem] font-medium text-foreground-subtle">%</span>
                  </p>
                  <Progress value={68} className="h-1.5" />
                  <p className="text-[11.5px] text-foreground-subtle mt-2">Avancement global estimé</p>
                </CardContent>
              </Card>

              {/* Tests */}
              <Card className="border-border bg-card group hover:border-border-hi hover:shadow-2xl transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardDescription className="text-[10.5px] font-bold tracking-[0.1em] uppercase">Tests</CardDescription>
                    <Badge className="bg-success-bg text-success border-success-border text-[10px]">6 / 8</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[2rem] font-black tracking-[-0.05em] leading-none">
                    75<span className="text-[1.1rem] font-medium text-foreground-subtle">%</span>
                  </p>
                  <p className="text-[11.5px] text-foreground-subtle mt-2">6 réussis · 2 en attente</p>
                </CardContent>
              </Card>

              {/* Deadline */}
              <Card className="border-border bg-card group hover:border-border-hi hover:shadow-2xl transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardDescription className="text-[10.5px] font-bold tracking-[0.1em] uppercase">Deadline</CardDescription>
                    <div className="size-9 rounded-[6px] grid place-items-center border border-border-md bg-popover text-foreground-muted">
                      <CalendarDays size={16} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[1.8rem] font-black tracking-[-0.03em] leading-none">15 Avr</p>
                  <p className="text-[11.5px] text-foreground-subtle mt-2 flex items-center gap-2">
                    38 jours restants
                    <Badge className="bg-success-bg text-success border-success-border text-[9.5px]">✓ En avance</Badge>
                  </p>
                </CardContent>
              </Card>

            </div>
          </Section>

          {/* ══ 09 · STATUTS ═════════════════════════════════ */}
          <Section num="09" title="États & Statuts">
            <div className="flex flex-col gap-2">
              {[
                { bg: "var(--success-bg)", bd: "var(--success-border)", iconBg: "oklch(0.72 0.17 155 / 20%)", icon: <Check size={14} />, label: "Validé / Terminé", desc: "Update approuvée par le client — Todo DONE", badge: <Badge className="bg-success-bg text-success border-success-border">DONE</Badge> },
                { bg: "var(--primary-ghost)", bd: "oklch(0.58 0.23 288 / 25%)", iconBg: "oklch(0.58 0.23 288 / 20%)", icon: "→", label: "En cours", desc: "Tâche active — Todo IN_PROGRESS", badge: <Badge className="bg-primary-ghost text-primary-light border-primary/30">IN_PROGRESS</Badge> },
                { bg: "var(--warning-bg)", bd: "var(--warning-border)", iconBg: "oklch(0.78 0.17 70 / 20%)", icon: "⏳", label: "En attente", desc: "Proposition PENDING — Update awaiting review", badge: <Badge className="bg-warning-bg text-warning border-warning-border">PENDING</Badge> },
                { bg: "var(--destructive-bg)", bd: "var(--destructive-border)", iconBg: "oklch(0.70 0.19 22 / 20%)", icon: "✕", label: "Erreur / Refusé", desc: "Proposition refusée — Action destructive", badge: <Badge variant="destructive">REFUSED</Badge> },
                { bg: "var(--card-elevated)", bd: "var(--border-md)", iconBg: "var(--popover)", icon: "✎", label: "Brouillon", desc: "Non publié — visible maker uniquement", badge: <Badge variant="secondary">DRAFT</Badge> },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3.5 px-[18px] py-[13px] rounded-xl border cursor-default hover:brightness-110 transition-all" style={{ background: s.bg, borderColor: s.bd }}>
                  <div className="size-8 rounded-[4px] grid place-items-center text-[13px] flex-shrink-0 text-foreground"
                    style={{ background: s.iconBg }}>{s.icon}</div>
                  <div className="flex-1">
                    <span className="text-[12.5px] font-bold block text-foreground">{s.label}</span>
                    <span className="text-[11px] text-foreground-subtle">{s.desc}</span>
                  </div>
                  {s.badge}
                </div>
              ))}
            </div>
          </Section>

          {/* ══ 10 · AVATARS ═════════════════════════════════ */}
          <Section num="10" title="Avatars">
            <Card className="border-border bg-card">
              <CardContent className="p-7">
                <div className="flex flex-wrap gap-6 items-end">

                  {[
                    { fallback: "E",  size: "size-[60px] text-xl",    label: "2xl · Online", online: true },
                    { fallback: "AB", size: "size-12 text-lg",        label: "XL" },
                    { fallback: "JD", size: "size-[38px] text-base",  label: "LG · blue",   grad: "linear-gradient(135deg,#3b82f6,#60a5fa)" },
                    { fallback: "M",  size: "size-8 text-sm",         label: "MD · green",  grad: "linear-gradient(135deg,#10b981,#6ee7b7)" },
                    { fallback: "T",  size: "size-6 text-xs",         label: "SM" },
                  ].map((av) => (
                    <div key={av.label} className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <Avatar className={av.size}>
                          <AvatarImage src="" />
                          <AvatarFallback
                            className="font-extrabold text-white"
                            style={{ background: av.grad || C.gradAvatar }}>
                            {av.fallback}
                          </AvatarFallback>
                        </Avatar>
                        {av.online && (
                          <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full border-2 bg-success"
                            style={{ borderColor: "var(--background)" }} />
                        )}
                      </div>
                      <span className="text-[9.5px] text-foreground-subtle">{av.label}</span>
                    </div>
                  ))}

                  {/* Square */}
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="size-[38px] rounded-lg">
                      <AvatarFallback className="rounded-lg font-extrabold text-white"
                        style={{ background: C.gradAvatar }}>W</AvatarFallback>
                    </Avatar>
                    <span className="text-[9.5px] text-foreground-subtle">Square</span>
                  </div>

                  {/* Stacked */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex">
                      {[
                        { f: "A", g: C.gradAvatar },
                        { f: "B", g: "linear-gradient(135deg,#3b82f6,#60a5fa)" },
                        { f: "C", g: "linear-gradient(135deg,#10b981,#6ee7b7)" },
                      ].map((av, i) => (
                        <Avatar key={i} className="size-8 border-2 -mr-2.5 last:mr-0" style={{ borderColor: "var(--background)", zIndex: 3 - i }}>
                          <AvatarFallback className="text-[11px] font-extrabold text-white" style={{ background: av.g }}>{av.f}</AvatarFallback>
                        </Avatar>
                      ))}
                      <Avatar className="size-8 border-2" style={{ borderColor: "var(--background)", zIndex: 0 }}>
                        <AvatarFallback className="text-[9.5px] font-extrabold text-foreground-muted bg-popover">+4</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-[9.5px] text-foreground-subtle">Stacked</span>
                  </div>

                </div>
              </CardContent>
            </Card>
          </Section>

          {/* ══ 11 · RADIUS & SPACING ════════════════════════ */}
          <Section num="11" title="Radius & Espacement">
            <Card className="border-border bg-card">
              <CardContent className="p-7 flex flex-col gap-8">

                <div className="flex flex-wrap gap-5 items-end">
                  {[
                    { name: "XS",      val: "4px",  r: "4px" },
                    { name: "SM",      val: "6px",  r: "6px" },
                    { name: "Default", val: "10px", r: "10px" },
                    { name: "MD",      val: "14px", r: "14px" },
                    { name: "LG",      val: "18px", r: "18px" },
                    { name: "XL",      val: "24px", r: "24px" },
                  ].map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-2.5 group cursor-default">
                      <div className="size-16 border border-border-hi bg-card-elevated group-hover:bg-primary-ghost group-hover:border-primary/40 transition-colors"
                        style={{ borderRadius: item.r }} />
                      <span className="text-[10px] font-bold text-foreground-subtle">{item.name}</span>
                      <span className="text-[9px] font-mono text-primary-light">{item.val}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="h-16 w-24 rounded-full border border-border-hi bg-card-elevated" />
                    <span className="text-[10px] font-bold text-foreground-subtle">Full</span>
                    <span className="text-[9px] font-mono text-primary-light">pill</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <RowLabel>Espacement (px)</RowLabel>
                  <div className="flex items-end gap-4 flex-wrap">
                    {[4, 8, 12, 16, 20, 24, 32, 48, 64, 80].map((sp) => (
                      <div key={sp} className="flex flex-col items-center gap-2">
                        <div className="w-8 rounded-sm"
                          style={{ height: `${sp}px`, background: C.gradPrimary, opacity: 0.4 }} />
                        <span className="text-[9px] text-foreground-subtle">{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          </Section>

          {/* ══ 12 · UI SHELL ════════════════════════════════ */}
          <Section num="12" title="UI Shell — Aperçu interface" id="ui-shell">
            <Card className="border-border-md overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
              <div className="flex h-[380px]">

                {/* Sidebar */}
                <div className="w-[218px] flex-shrink-0 flex-col border-r border-border hidden md:flex"
                  style={{ background: "var(--surface)" }}>
                  <div className="flex items-center gap-2.5 px-3.5 py-4 border-b border-border">
                    <div className="size-[26px] rounded-[6px] grid place-items-center flex-shrink-0 shadow-[0_0_14px_var(--primary-ghost)]"
                      style={{ background: C.gradPrimary }}>
                      <Zap size={13} className="fill-white text-white" />
                    </div>
                    <span className="text-[13.5px] font-extrabold tracking-[-0.04em]">Mon Projet</span>
                  </div>
                  <p className="px-4 pt-3.5 pb-1.5 text-[9px] font-extrabold tracking-[0.15em] uppercase text-foreground-subtle">Navigation</p>
                  {[
                    { icon: <LayoutGrid size={14} />,  label: "Dashboard",  active: true },
                    { icon: <MessageSquare size={14} />, label: "Updates",  badge: "3" },
                    { icon: <MessageSquare size={14} />, label: "Feedback" },
                    { icon: <CalendarDays size={14} />,  label: "Timeline" },
                    { icon: <FlaskConical size={14} />,  label: "Tests" },
                    { icon: <CheckSquare size={14} />,   label: "Todos" },
                  ].map((item) => (
                    <div key={item.label}
                      className="flex items-center gap-2.5 mx-2 my-[1px] px-3 py-2 rounded-[6px] text-[12.5px] font-semibold cursor-pointer"
                      style={{
                        color: item.active ? "var(--primary-light)" : "var(--foreground-subtle)",
                        background: item.active ? "var(--primary-ghost)" : "transparent",
                      }}>
                      {item.icon}
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto size-4 rounded-full grid place-items-center text-white font-extrabold bg-primary"
                          style={{ fontSize: "9px" }}>{item.badge}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="flex-1 overflow-hidden p-5 bg-background">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[15px] font-extrabold tracking-[-0.03em]">Dashboard</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success-bg text-success border-success-border text-[10px]">En cours</Badge>
                      <Button size="sm"><Plus size={12} />Update</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                    {[["12","Updates",true],["68%","Progression",false],["38j","Deadline",false]].map(([v,k,g]) => (
                      <Card key={k} className="border-border bg-card">
                        <CardContent className="p-3">
                          {g
                            ? <GradientText className="text-[18px] font-black tracking-[-0.04em]">{v}</GradientText>
                            : <p className="text-[18px] font-black tracking-[-0.04em]">{v}</p>
                          }
                          <p className="text-[9px] font-bold tracking-[0.05em] uppercase mt-0.5 text-foreground-subtle">{k}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { f: "E", label: "Validé",   badge: <Badge className="bg-success-bg text-success border-success-border text-[9.5px]">Validé</Badge> },
                      { f: "A", label: "Pending",  badge: <Badge className="bg-warning-bg text-warning border-warning-border text-[9.5px]">Pending</Badge> },
                      { f: "M", label: "En cours", badge: <Badge className="bg-primary-ghost text-primary-light border-primary/30 text-[9.5px]">En cours</Badge> },
                      { f: "E", label: "Brouillon",badge: <Badge variant="secondary" className="text-[9.5px]">Brouillon</Badge> },
                    ].map((row, i) => (
                      <Card key={i} className="border-border bg-card">
                        <CardContent className="flex items-center gap-2.5 p-2.5">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[10px] font-extrabold text-white" style={{ background: C.gradAvatar }}>{row.f}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 h-1.5 rounded-full bg-card-elevated" style={{ width: ["55%","43%","62%","35%"][i] }} />
                          {row.badge}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

              </div>
            </Card>
          </Section>

          {/* Footer */}
          <footer className="border-t border-border pt-9 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11px] text-foreground-subtle">
              Wizyy <strong className="text-primary-light font-bold">Design System v2.0</strong> — Direction Artistique 2026
            </p>
            <p className="text-[11px] text-foreground-subtle">
              Montserrat · Poppins · Tailwind v4 · shadcn/ui · <strong className="text-primary-light font-bold">Next.js 15</strong>
            </p>
          </footer>

        </div>
      </div>
    </TooltipProvider>
  )
}
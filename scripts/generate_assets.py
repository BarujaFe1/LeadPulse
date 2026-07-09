"""Generate portfolio visual assets for LeadPulse."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1] / "assets"
shots = root / "screenshots"
shots.mkdir(parents=True, exist_ok=True)

BG = (11, 18, 32)
PANEL = (22, 32, 51)
ACCENT = (61, 214, 198)
HOT = (255, 122, 89)
TEXT = (232, 238, 249)
MUTED = (147, 164, 195)
LINE = (42, 58, 85)
WARN = (240, 180, 41)
DANGER = (240, 113, 103)


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def base(w: int, h: int, title: str | None = None, subtitle: str | None = None):
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)
    draw.ellipse((-120, -80, 420, 280), fill=(22, 50, 74))
    draw.ellipse((w - 360, -40, w + 80, 260), fill=(26, 47, 40))
    draw.rounded_rectangle((24, 20, w - 24, 72), radius=14, fill=PANEL, outline=LINE, width=2)
    draw.text((44, 34), "LeadPulse", font=font(22, True), fill=ACCENT)
    if title:
        draw.text((44, 96), title, font=font(28, True), fill=TEXT)
    if subtitle:
        draw.text((44, 136), subtitle, font=font(16), fill=MUTED)
    return img, draw


def card(draw, xy, wh, label, value, accent=ACCENT):
    x, y = xy
    w, h = wh
    draw.rounded_rectangle((x, y, x + w, y + h), radius=16, fill=PANEL, outline=LINE, width=2)
    draw.text((x + 18, y + 18), label, font=font(14), fill=MUTED)
    draw.text((x + 18, y + 48), value, font=font(30, True), fill=accent)


# Icon
icon = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
di = ImageDraw.Draw(icon)
di.rounded_rectangle((32, 32, 480, 480), radius=110, fill=BG)
di.ellipse((96, 96, 416, 416), fill=(18, 40, 48), outline=ACCENT, width=10)
for radius in (150, 120, 90):
    di.arc((256 - radius, 256 - radius, 256 + radius, 256 + radius), start=200, end=340, fill=ACCENT, width=14)
di.ellipse((226, 226, 286, 286), fill=HOT)
icon.resize((256, 256), Image.Resampling.LANCZOS).save(root / "icon.png")

# Hero
hero, d = base(
    1600,
    840,
    "Cockpit de follow-up WhatsApp-first",
    "Leads quentes, SLA de resposta e receita em risco — sem CRM pesado.",
)
for i, (lab, val, col) in enumerate(
    [
        ("Leads esquecidos", "3", HOT),
        ("Mediana 1ª resposta", "42m", ACCENT),
        ("Receita em risco", "R$ 8.4k", WARN),
        ("Follow-ups abertos", "8", ACCENT),
    ]
):
    card(d, (44 + i * 385, 200), (360, 120), lab, val, col)

d.rounded_rectangle((44, 360, 780, 780), radius=18, fill=PANEL, outline=LINE, width=2)
d.text((70, 384), "Radar de follow-up", font=font(22, True), fill=TEXT)
rows = [
    ("Escola Bilíngue Norte", "critical", "Sem 1ª resposta"),
    ("Ana Clínica Estética", "high", "Áudio sem retorno"),
    ("Bruno Imóveis Centro", "high", "Contraproposta pendente"),
    ("Academia Fit Night", "critical", "Formulário after-hours"),
]
for i, (name, prio, note) in enumerate(rows):
    y = 440 + i * 75
    color = DANGER if prio == "critical" else HOT
    d.rounded_rectangle((70, y, 750, y + 60), radius=12, fill=(13, 21, 36), outline=LINE)
    d.text((90, y + 10), name, font=font(18, True), fill=TEXT)
    d.text((90, y + 34), note, font=font(14), fill=MUTED)
    d.rounded_rectangle((600, y + 16, 730, y + 44), radius=20, fill=(40, 20, 20))
    d.text((618, y + 20), prio.upper(), font=font(13, True), fill=color)

d.rounded_rectangle((820, 360, 1556, 780), radius=18, fill=PANEL, outline=LINE, width=2)
d.text((850, 384), "Funil simples", font=font(22, True), fill=TEXT)
stages = [("Novo", 2), ("Contatado", 2), ("Qualificado", 3), ("Proposta", 2), ("Ganho", 1), ("Perdido", 2)]
for i, (name, count) in enumerate(stages):
    y = 450 + i * 48
    d.text((850, y), name, font=font(15), fill=MUTED)
    d.rounded_rectangle((980, y + 6, 980 + int(480 * (count / 3)), y + 22), radius=8, fill=ACCENT)
    d.text((1480, y), str(count), font=font(15, True), fill=TEXT)
hero.save(root / "hero-cover.png", optimize=True)

# Architecture
arch, d = base(1400, 720, "Arquitetura LeadPulse", "CSV/forms → analytics → radar → relatório")
boxes = [
    (80, 220, "Ingestão\nCSV / Form / Manual"),
    (380, 220, "API FastAPI\nLeads + KPIs"),
    (680, 220, "Scoring &\nFollow-up Radar"),
    (980, 220, "Next.js Cockpit\nDashboard SMB"),
]
for x, y, text in boxes:
    d.rounded_rectangle((x, y, x + 260, y + 140), radius=18, fill=PANEL, outline=ACCENT, width=3)
    d.multiline_text((x + 24, y + 40), text, font=font(18, True), fill=TEXT, spacing=8)
for x in (340, 640, 940):
    d.polygon([(x, 285), (x + 30, 300), (x, 315)], fill=ACCENT)
d.rounded_rectangle((200, 430, 1200, 620), radius=18, fill=(13, 21, 36), outline=LINE, width=2)
d.text((230, 460), "Fluxo: import preview → forgotten leads → opportunity score → weekly report", font=font(18), fill=MUTED)
d.text((230, 510), "Billing-ready roadmap: Starter / Pro / Agency · WhatsApp Business API na Fase 2", font=font(18), fill=MUTED)
d.text((230, 560), "Sem scraping · Sem disparo em massa · Foco em rotina comercial diária", font=font(18), fill=ACCENT)
arch.save(root / "architecture-pipeline.png", optimize=True)

# Social
social, d = base(1280, 640, "LeadPulse", "Analytics e follow-up radar para vendas no WhatsApp")
card(d, (60, 220), (280, 140), "Forgotten leads", "3", HOT)
card(d, (370, 220), (280, 140), "Response median", "42m", ACCENT)
card(d, (680, 220), (280, 140), "At-risk revenue", "R$ 8.4k", WARN)
card(d, (990, 220), (230, 140), "Hot leads", "4", HOT)
d.text((60, 420), "Portfolio SaaS · Next.js + FastAPI · Felipe Alirio Baruja", font=font(20), fill=MUTED)
d.text((60, 470), "github.com/BarujaFe1/LeadPulse", font=font(18, True), fill=ACCENT)
social.save(root / "social-preview.png", optimize=True)

screens = [
    ("01-followup-radar.png", "Radar de Follow-up", "Fila priorizada por criticidade, silêncio e temperatura"),
    ("02-leads-inbox.png", "Inbox de Leads", "Canal, estágio, score e receita estimada em uma lista leve"),
    ("03-response-dashboard.png", "Dashboard de Resposta", "Mediana, p90, não respondidos e receita em risco"),
    ("04-simple-funnel.png", "Funil Simples", "New → Contacted → Qualified → Proposal → Won/Lost"),
    ("05-opportunity-score.png", "Opportunity Score", "Heurística transparente de intenção + urgência de canal"),
    ("06-lost-reasons.png", "Motivos de Perda", "Demora no retorno, preço e perda para concorrente"),
    ("07-return-calendar.png", "Calendário de Retorno", "Próximas ações e due dates do follow-up"),
    ("08-weekly-report.png", "Relatório Semanal", "Highlights para dono do negócio ou agência"),
]

for fname, title, sub in screens:
    img, d = base(1400, 860, title, sub)
    for i in range(3):
        d.rounded_rectangle((48, 190 + i * 200, 1350, 360 + i * 200), radius=18, fill=PANEL, outline=LINE, width=2)
        d.text((80, 220 + i * 200), f"Bloco operacional {i + 1}", font=font(20, True), fill=TEXT)
        d.text(
            (80, 260 + i * 200),
            "LeadPulse destaca o que precisa de ação humana agora — não um CRM genérico.",
            font=font(16),
            fill=MUTED,
        )
        labels = ["Hot", "Warm", "Critical", "Due today"]
        colors = [HOT, WARN, DANGER, ACCENT]
        for j in range(4):
            x = 80 + j * 300
            y = 300 + i * 200
            d.rounded_rectangle((x, y, x + 260, y + 40), radius=10, fill=(13, 21, 36), outline=LINE)
            d.text((x + 16, y + 10), labels[j], font=font(14, True), fill=colors[j])
    img.save(shots / fname, optimize=True)

print("assets generated")
for path in sorted(root.rglob("*.png")):
    print(f"{path.relative_to(root)} ({path.stat().st_size} bytes)")

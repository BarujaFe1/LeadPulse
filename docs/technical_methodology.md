# LeadPulse — Technical Methodology

## Ingestão (MVP)
- CSV / export manual
- Formulários
- Cadastro manual

Nenhuma integração não oficial com WhatsApp Web.

## Métricas principais
- **First response time:** minutos até a primeira resposta humana
- **Forgotten leads:** ativos sem 1ª resposta ou sem toque há 24h+
- **Opportunity score:** heurística 0–100 (intenção + canal + silêncio)
- **At-risk revenue:** soma de `estimated_revenue` dos leads esquecidos
- **Lost reasons:** agregação por motivo declarado

## Classificação
Endpoint `POST /api/classify` aplica regras transparentes:
- termos de alta intenção aumentam score e marcam `hot`
- linguagem de baixa urgência reduz score
- silêncio ≥ 24h eleva prioridade de follow-up

Não é modelo preditivo de crédito/pessoa; é priorização operacional de atendimento.

## Fora de escopo no MVP
- CRM corporativo completo
- Scraping / automação não oficial do WhatsApp
- Disparo em massa ilegal

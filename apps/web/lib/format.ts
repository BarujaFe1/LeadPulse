export const STAGE_LABEL: Record<string, string> = {
  new: "Novo",
  contacted: "Contatado",
  qualified: "Qualificado",
  proposal: "Proposta",
  won: "Ganho",
  lost: "Perdido",
};

export function money(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatDue(value: string): string {
  return value.replace("T", " ");
}

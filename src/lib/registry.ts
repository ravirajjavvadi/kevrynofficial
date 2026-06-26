export interface InternData {
  id: string;
  name: string;
  email: string;
  role: string;
  score: number;
  domain: string;
  issueDate: string;
  status: "OFFERED" | "ACCEPTED" | "COMPLETED";
}

// In a real app, this would be a database call.
// For the demo, we will use a localStorage-backed registry.
const REGISTRY_KEY = "kevryn_intern_registry";

export function generateInternID(name: string, domain: string): string {
  const year = new Date().getFullYear();
  const domainExt = domain.split("-").map(p => p[0]).join("").toUpperCase();
  const nameHash = Math.abs(name.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString(16).slice(0, 4);
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `KR-INT-${year}-${domainExt}-${nameHash}-${random}`.toUpperCase();
}

export function registerIntern(data: Omit<InternData, "issueDate" | "status">): InternData {
  if (typeof window === "undefined") return { ...data, issueDate: "", status: "OFFERED" } as InternData;

  const newEntry: InternData = {
    ...data,
    issueDate: new Date().toISOString(),
    status: "OFFERED"
  };

  const currentRegistry = JSON.parse(localStorage.getItem(REGISTRY_KEY) || "[]");
  currentRegistry.push(newEntry);
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(currentRegistry));

  return newEntry;
}

export function getInternData(id: string): InternData | null {
  if (typeof window === "undefined") return null;
  
  const registry: InternData[] = JSON.parse(localStorage.getItem(REGISTRY_KEY) || "[]");
  return registry.find(intern => intern.id === id) || null;
}

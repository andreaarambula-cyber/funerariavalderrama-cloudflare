import obit1 from "@/assets/obit-1.jpg";
import obit2 from "@/assets/obit-2.jpg";
import obit3 from "@/assets/obit-3.jpg";
import obit4 from "@/assets/obit-4.jpg";
import obit5 from "@/assets/obit-5.jpg";
import obit6 from "@/assets/obit-6.jpg";

export type Obituary = {
  slug: string;
  fullName: string;
  photo: string;
  birth: string; // dd/mm/yyyy
  death: string;
  comuna: string;
  summary: string;
  velatorio?: { address: string; time: string };
  candles: number;
};

export const obituaries: Obituary[] = [
  {
    slug: "carlos-munoz-rivera",
    fullName: "Carlos Muñoz Rivera",
    photo: obit1,
    birth: "12/03/1948",
    death: "28/04/2026",
    comuna: "Providencia",
    summary:
      "Padre dedicado, abuelo cariñoso y profesor jubilado. Dejó una huella imborrable en cada estudiante y en su familia, a quienes amó profundamente.",
    velatorio: { address: "Parroquia San Ramón, Providencia", time: "Hoy, 18:00 hrs" },
    candles: 124,
  },
  {
    slug: "maria-elena-soto",
    fullName: "María Elena Soto",
    photo: obit2,
    birth: "05/07/1942",
    death: "26/04/2026",
    comuna: "Ñuñoa",
    summary:
      "Mujer de fe, amante de los jardines y matriarca de una gran familia. Su sonrisa y sus consejos seguirán acompañándonos siempre.",
    velatorio: { address: "Capilla Serena Ñuñoa", time: "Mañana, 11:00 hrs" },
    candles: 87,
  },
  {
    slug: "jorge-andres-pereira",
    fullName: "Jorge Andrés Pereira",
    photo: obit3,
    birth: "22/11/1965",
    death: "25/04/2026",
    comuna: "Las Condes",
    summary:
      "Empresario, amigo leal y apasionado del fútbol. Vivió cada día con intensidad y enseñó a los suyos el valor del trabajo y la honestidad.",
    candles: 56,
  },
  {
    slug: "rosa-vargas-leiva",
    fullName: "Rosa Vargas Leiva",
    photo: obit4,
    birth: "30/01/1939",
    death: "24/04/2026",
    comuna: "Maipú",
    summary:
      "Costurera durante más de 50 años, madre de cinco y bisabuela orgullosa. Su hogar siempre fue un refugio cálido para todos.",
    candles: 211,
  },
  {
    slug: "patricia-fuentes-reyes",
    fullName: "Patricia Fuentes Reyes",
    photo: obit5,
    birth: "14/09/1958",
    death: "23/04/2026",
    comuna: "Valparaíso",
    summary:
      "Enfermera de vocación, viajera incansable y voluntaria comunitaria. Dedicó su vida a cuidar de los demás con ternura y entrega.",
    velatorio: { address: "Iglesia La Matriz, Valparaíso", time: "Hoy, 19:30 hrs" },
    candles: 98,
  },
  {
    slug: "luis-gonzalez-tapia",
    fullName: "Luis González Tapia",
    photo: obit6,
    birth: "08/06/1944",
    death: "21/04/2026",
    comuna: "La Serena",
    summary:
      "Pescador, narrador de historias y querido vecino. Amaba el mar al que volvía cada amanecer, dejando un legado de bondad y trabajo.",
    candles: 142,
  },
];

export function getObituary(slug: string) {
  return obituaries.find((o) => o.slug === slug);
}
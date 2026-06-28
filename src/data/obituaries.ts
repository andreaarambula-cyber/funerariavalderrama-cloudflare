import obit1 from "@/assets/obit-1.webp";
import obit2 from "@/assets/obit-2.webp";
import obit3 from "@/assets/obit-3.webp";
import obit4 from "@/assets/obit-4.webp";
import obit5 from "@/assets/obit-5.webp";
import obit6 from "@/assets/obit-6.webp";
import mem1 from "@/assets/memory-1.webp";
import mem2 from "@/assets/memory-2.webp";
import mem3 from "@/assets/memory-3.webp";
import mem4 from "@/assets/memory-4.webp";
import mem5 from "@/assets/memory-5.webp";
import mem6 from "@/assets/memory-6.webp";

export type TimelineItem = { year: string; title: string; description: string };
export type GalleryItem = { src: string; caption: string; author: string };
export type Anecdote = { author: string; text: string };
export type Candle = { name: string; message?: string; timeAgo: string };
export type FarewellEvent = {
  type: "Velatorio" | "Misa" | "Cortejo" | "Sepultación";
  date: string;
  address: string;
  mapsQuery: string;
  isoStart: string; // ISO datetime for .ics
  isoEnd: string;
};

export type Obituary = {
  slug: string;
  fullName: string;
  photo: string;
  birth: string;
  death: string;
  comuna: string;
  summary: string;
  timeline: TimelineItem[];
  gallery: GalleryItem[];
  anecdotes: Anecdote[];
  candles: Candle[];
  events: FarewellEvent[];
};

const baseGallery = (): GalleryItem[] => [
  { src: mem1, caption: "Tarde en el jardín con los nietos", author: "Familia" },
  { src: mem2, caption: "El día del matrimonio, 1968", author: "Álbum familiar" },
  { src: mem3, caption: "Cuidando sus rosas, su mayor pasión", author: "Hija mayor" },
  { src: mem4, caption: "Vacaciones en la costa, verano del 82", author: "Sobrina Carmen" },
  { src: mem5, caption: "Cumpleaños número 60", author: "Familia" },
  { src: mem6, caption: "Atardeceres compartidos de toda una vida", author: "Su esposa" },
];

const baseCandles = (): Candle[] => [
  { name: "Marcela P.", message: "Siempre en nuestros corazones.", timeAgo: "Hace 10 min" },
  { name: "Familia Rojas", message: "Un abrazo enorme a la familia.", timeAgo: "Hace 32 min" },
  { name: "Don Sergio", message: "Descansa en paz, viejo amigo.", timeAgo: "Hace 1 hora" },
  { name: "Carmen L.", timeAgo: "Hace 2 horas" },
  { name: "Pablo M.", message: "Gracias por todo lo enseñado.", timeAgo: "Hace 3 horas" },
  { name: "Anónimo", message: "Una luz para tu familia.", timeAgo: "Hace 4 horas" },
  { name: "Vecinos del barrio", timeAgo: "Hace 5 horas" },
  { name: "Tía Inés", message: "Te recordaremos siempre.", timeAgo: "Hace 6 horas" },
  { name: "Compañeros de trabajo", message: "Honrando tu memoria.", timeAgo: "Ayer" },
  { name: "Sebastián G.", timeAgo: "Ayer" },
];

export const obituaries: Obituary[] = [
  {
    slug: "carlos-munoz-rivera",
    fullName: "Carlos Muñoz Rivera",
    photo: obit1,
    birth: "12/03/1948",
    death: "28/04/2026",
    comuna: "Concepción",
    summary:
      "Padre dedicado, abuelo cariñoso y profesor jubilado. Dejó una huella imborrable en cada estudiante y en su familia, a quienes amó profundamente.",
    timeline: [
      { year: "1948", title: "Nacimiento", description: "Nace en Chillán, hijo de Pedro y María Luisa." },
      { year: "1966", title: "Ingresa a la Universidad de Concepción", description: "Estudia Pedagogía en Historia, su gran vocación." },
      { year: "1972", title: "Se casa con Inés", description: "Compañera de vida durante 54 años." },
      { year: "1975", title: "Nace su primera hija", description: "Inicio de una familia que llegaría a tener tres hijos." },
      { year: "1980", title: "Profesor en el Liceo Enrique Molina", description: "Donde enseñó por más de 30 años a generaciones de estudiantes penquistas." },
      { year: "2010", title: "Jubilación", description: "Se dedica de lleno a sus nietos y a leer en su jardín." },
      { year: "2026", title: "Despedida", description: "Parte rodeado de los suyos, dejando un legado de amor y conocimiento." },
    ],
    gallery: baseGallery(),
    anecdotes: [
      { author: "Andrés, su hijo", text: "Cada noche nos contaba una historia distinta antes de dormir. Nunca repetía una." },
      { author: "Sofía, su nieta", text: "Me enseñó a leer en su biblioteca. Decía que los libros eran su mejor herencia." },
      { author: "Roberto, ex alumno", text: "Gracias a él decidí estudiar historia. Cambió mi vida sin saberlo." },
      { author: "Inés, su esposa", text: "Bailamos en cada matrimonio al que fuimos. Siempre la misma canción." },
    ],
    candles: baseCandles(),
    events: [
      {
        type: "Velatorio",
        date: "Hoy, 18:00 a 23:00 hrs",
        address: "Catedral de la Santísima Concepción, Concepción",
        mapsQuery: "Catedral de la Santísima Concepción",
        isoStart: "2026-04-29T18:00:00-03:00",
        isoEnd: "2026-04-29T23:00:00-03:00",
      },
      {
        type: "Misa",
        date: "Mañana, 11:00 hrs",
        address: "Catedral de la Santísima Concepción, Concepción",
        mapsQuery: "Catedral de la Santísima Concepción",
        isoStart: "2026-04-30T11:00:00-03:00",
        isoEnd: "2026-04-30T12:00:00-03:00",
      },
      {
        type: "Sepultación",
        date: "Mañana, 13:30 hrs",
        address: "Cementerio General de Concepción",
        mapsQuery: "Cementerio General de Concepción",
        isoStart: "2026-04-30T13:30:00-03:00",
        isoEnd: "2026-04-30T15:00:00-03:00",
      },
    ],
  },
  {
    slug: "maria-elena-soto",
    fullName: "María Elena Soto",
    photo: obit2,
    birth: "05/07/1942",
    death: "26/04/2026",
    comuna: "Chiguayante",
    summary:
      "Mujer de fe, amante de los jardines y matriarca de una gran familia. Su sonrisa y sus consejos seguirán acompañándonos siempre.",
    timeline: [
      { year: "1942", title: "Nace en Talca", description: "La menor de seis hermanos." },
      { year: "1962", title: "Llega a Concepción", description: "Para trabajar como secretaria en una notaría." },
      { year: "1968", title: "Matrimonio con Hernán", description: "Una historia de amor que duró 58 años." },
      { year: "1970", title: "Llegan los hijos", description: "Cuatro hijos que llenaron su vida." },
      { year: "1995", title: "Su jardín premiado", description: "Reconocida por la comunidad por sus rosas blancas." },
      { year: "2026", title: "Descansa en paz", description: "Rodeada de hijos, nietos y bisnietos." },
    ],
    gallery: baseGallery(),
    anecdotes: [
      { author: "Hernán, su esposo", text: "Cada mañana me preparaba el café. Cincuenta y ocho años. Nunca falló." },
      { author: "Daniela, su nieta", text: "Su casa olía siempre a pan amasado. Voy a extrañar ese olor." },
      { author: "Vecina Rosa", text: "Sus rosas blancas adornaron mi matrimonio. Un regalo que nunca olvidaré." },
      { author: "Juan, su hijo", text: "Nunca la vi enojada. Esa era su gran fortaleza." },
    ],
    candles: baseCandles(),
    events: [
      {
        type: "Velatorio",
        date: "Mañana, 11:00 a 18:00 hrs",
        address: "Capilla Valderrama, O'Higgins 1601, Concepción",
        mapsQuery: "O'Higgins 1601 Concepción",
        isoStart: "2026-04-30T11:00:00-03:00",
        isoEnd: "2026-04-30T18:00:00-03:00",
      },
    ],
  },
  {
    slug: "jorge-andres-pereira",
    fullName: "Jorge Andrés Pereira",
    photo: obit3,
    birth: "22/11/1965",
    death: "25/04/2026",
    comuna: "San Pedro de la Paz",
    summary:
      "Empresario, amigo leal y apasionado del fútbol. Vivió cada día con intensidad y enseñó a los suyos el valor del trabajo y la honestidad.",
    timeline: [
      { year: "1965", title: "Nace en Concepción", description: "El segundo de tres hermanos." },
      { year: "1988", title: "Egresa de Ingeniería Comercial", description: "Universidad de Concepción." },
      { year: "1995", title: "Funda su empresa", description: "Una constructora que llegó a emplear a más de 200 personas." },
      { year: "2000", title: "Se casa con Loreto", description: "El amor de su vida." },
      { year: "2003", title: "Llegan los gemelos", description: "Tomás y Vicente, su mayor orgullo." },
      { year: "2026", title: "Despedida", description: "Demasiado pronto, pero con una vida intensa y bien vivida." },
    ],
    gallery: baseGallery(),
    anecdotes: [
      { author: "Tomás, su hijo", text: "Me enseñó que perder con dignidad es ganar. En la cancha y en la vida." },
      { author: "Loreto, su esposa", text: "Bailamos en la cocina cada viernes. Nunca lo voy a olvidar." },
      { author: "Pedro, socio", text: "Su palabra valía más que cualquier contrato. Así de simple." },
      { author: "Vicente, su hijo", text: "Hincha de Universidad de Concepción hasta el último día." },
    ],
    candles: baseCandles(),
    events: [
      {
        type: "Velatorio",
        date: "Hoy, 19:00 a 23:00 hrs",
        address: "Parroquia San Pedro Apóstol, San Pedro de la Paz",
        mapsQuery: "Parroquia San Pedro Apóstol San Pedro de la Paz",
        isoStart: "2026-04-29T19:00:00-03:00",
        isoEnd: "2026-04-29T23:00:00-03:00",
      },
      {
        type: "Misa",
        date: "Mañana, 12:00 hrs",
        address: "Parroquia San Pedro Apóstol, San Pedro de la Paz",
        mapsQuery: "Parroquia San Pedro Apóstol San Pedro de la Paz",
        isoStart: "2026-04-30T12:00:00-03:00",
        isoEnd: "2026-04-30T13:00:00-03:00",
      },
    ],
  },
  {
    slug: "rosa-vargas-leiva",
    fullName: "Rosa Vargas Leiva",
    photo: obit4,
    birth: "30/01/1939",
    death: "24/04/2026",
    comuna: "Talcahuano",
    summary:
      "Costurera durante más de 50 años, madre de cinco y bisabuela orgullosa. Su hogar siempre fue un refugio cálido para todos.",
    timeline: [
      { year: "1939", title: "Nace en Cañete", description: "En una familia campesina." },
      { year: "1958", title: "Llega a Talcahuano", description: "Para trabajar en una sastrería." },
      { year: "1961", title: "Se casa con Luis", description: "Compañero de toda la vida." },
      { year: "1965", title: "Abre su taller", description: "En el living de su casa, vistió a tres generaciones del barrio." },
      { year: "2010", title: "Cierra el taller", description: "Pero nunca dejó de coser para sus nietos." },
      { year: "2026", title: "Despedida", description: "Rodeada de hijos, nietos y bisnietos." },
    ],
    gallery: baseGallery(),
    anecdotes: [
      { author: "Patricia, su hija", text: "Cosió mi vestido de novia con sus manos. Lloraba mientras lo hacía." },
      { author: "Vecina Marta", text: "Le encargué mi vestido de 18 años. Aún lo tengo guardado." },
      { author: "Luis, su esposo", text: "Bailamos cueca cada 18 de septiembre. Nunca falló." },
      { author: "Camila, su bisnieta", text: "Me hizo un osito de retazos. Lo tengo en mi cama." },
    ],
    candles: baseCandles(),
    events: [
      {
        type: "Velatorio",
        date: "Hoy, 17:00 a 22:00 hrs",
        address: "Parroquia San José, Talcahuano",
        mapsQuery: "Parroquia San José Talcahuano",
        isoStart: "2026-04-29T17:00:00-03:00",
        isoEnd: "2026-04-29T22:00:00-03:00",
      },
      {
        type: "Sepultación",
        date: "Mañana, 11:00 hrs",
        address: "Cementerio Parque Talcahuano",
        mapsQuery: "Cementerio Parque Talcahuano",
        isoStart: "2026-04-30T11:00:00-03:00",
        isoEnd: "2026-04-30T12:30:00-03:00",
      },
    ],
  },
  {
    slug: "patricia-fuentes-reyes",
    fullName: "Patricia Fuentes Reyes",
    photo: obit5,
    birth: "14/09/1958",
    death: "23/04/2026",
    comuna: "Hualpén",
    summary:
      "Enfermera de vocación, viajera incansable y voluntaria comunitaria. Dedicó su vida a cuidar de los demás con ternura y entrega.",
    timeline: [
      { year: "1958", title: "Nace en Talcahuano", description: "A pasos del mar que tanto amó." },
      { year: "1980", title: "Titulada como enfermera", description: "Universidad de Concepción." },
      { year: "1985", title: "Hospital Las Higueras", description: "Donde trabajó por más de 35 años." },
      { year: "1990", title: "Se casa con Mario", description: "Su gran compañero." },
      { year: "2005", title: "Voluntariado", description: "Inicia trabajo con adultos mayores en Hualpén." },
      { year: "2026", title: "Descanso", description: "Tras una vida de servicio." },
    ],
    gallery: baseGallery(),
    anecdotes: [
      { author: "Mario, su esposo", text: "Veíamos cada atardecer desde la Península de Hualpén. Ese era nuestro ritual." },
      { author: "Compañera Andrea", text: "Era la primera en llegar al turno y la última en irse. Siempre." },
      { author: "Don Hernán, vecino", text: "Me cuidó cuando estuve enfermo. No le importó que fuera de noche." },
      { author: "Fernanda, sobrina", text: "Me enseñó a no tenerle miedo a la vida. Ni a la muerte." },
    ],
    candles: baseCandles(),
    events: [
      {
        type: "Velatorio",
        date: "Hoy, 19:30 hrs",
        address: "Parroquia Santa Sofía, Hualpén",
        mapsQuery: "Parroquia Santa Sofía Hualpén",
        isoStart: "2026-04-29T19:30:00-03:00",
        isoEnd: "2026-04-29T23:00:00-03:00",
      },
    ],
  },
  {
    slug: "luis-gonzalez-tapia",
    fullName: "Luis González Tapia",
    photo: obit6,
    birth: "08/06/1944",
    death: "21/04/2026",
    comuna: "Coronel",
    summary:
      "Pescador, narrador de historias y querido vecino. Amaba el mar al que volvía cada amanecer, dejando un legado de bondad y trabajo.",
    timeline: [
      { year: "1944", title: "Nace en Coronel", description: "Hijo y nieto de pescadores." },
      { year: "1960", title: "Su primer bote", description: "Llamado 'La Estrella del Norte'." },
      { year: "1968", title: "Se casa con Gladys", description: "Su gran amor." },
      { year: "1970", title: "Cuatro hijos", description: "Que llenaron su casa de risas." },
      { year: "2010", title: "Cuenta historias en la caleta", description: "Se convierte en el narrador favorito de los niños del pueblo." },
      { year: "2026", title: "Despedida", description: "Volvió al mar que tanto amó." },
    ],
    gallery: baseGallery(),
    anecdotes: [
      { author: "Gladys, su esposa", text: "Me trajo flores cada lunes durante 58 años. Sin excepción." },
      { author: "Pedrito, vecino niño", text: "Sus historias del 'pulpo gigante' me hacían soñar despierto." },
      { author: "Hijo Mario", text: "Me enseñó a leer las estrellas para volver a casa." },
      { author: "Don Raúl, compañero", text: "Compartimos miles de amaneceres en el mar. Nunca uno igual al otro." },
    ],
    candles: baseCandles(),
    events: [
      {
        type: "Velatorio",
        date: "Hoy, 18:00 a 22:00 hrs",
        address: "Parroquia San Luis Gonzaga, Coronel",
        mapsQuery: "Parroquia San Luis Gonzaga Coronel",
        isoStart: "2026-04-29T18:00:00-03:00",
        isoEnd: "2026-04-29T22:00:00-03:00",
      },
      {
        type: "Sepultación",
        date: "Mañana, 11:00 hrs",
        address: "Cementerio Municipal de Coronel",
        mapsQuery: "Cementerio Municipal Coronel",
        isoStart: "2026-04-30T11:00:00-03:00",
        isoEnd: "2026-04-30T12:30:00-03:00",
      },
    ],
  },
];

export function getObituary(slug: string) {
  return obituaries.find((o) => o.slug === slug);
}

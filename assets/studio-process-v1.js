const studioPath = "/nexuslabs/estudio";
const headingId = "nexus-inicio-proyecto";

const steps = [
  ["Solicitud de proyecto", "Cuéntanos qué necesitas, para cuándo y qué presupuesto tienes en mente. Revisamos si podemos ayudarte."],
  ["Bienvenida y agenda", "Si tu proyecto encaja, te damos la bienvenida y te enviamos un enlace para reservar la llamada."],
  ["Reunión de descubrimiento", "En 15–20 minutos por Google Meet aclaramos qué problema quieres resolver y qué objetivo debe cumplir el proyecto."],
  ["Propuesta, contrato y adelanto", "Recibes una cotización con alcance, plazo y precio fijo, el contrato y un enlace para pagar el 50 % de adelanto."],
  ["Briefing y arranque", "Cuando firmas y pagas el adelanto, te enviamos el cuestionario detallado y te pedimos los logos, textos, referencias y accesos necesarios."]
];

function createProcessSection() {
  const section = document.createElement("section");
  section.className = "nexus-studio-process";
  section.setAttribute("aria-labelledby", headingId);
  section.innerHTML = `
    <div class="nexus-studio-process__layout">
      <div>
        <h2 id="${headingId}" class="font-display">Cómo empieza tu proyecto</h2>
        <p class="nexus-studio-process__intro">Así trabajamos contigo desde la primera solicitud hasta el arranque.</p>
        <a class="nexus-studio-process__link" href="/nexuslabs/contacto">Solicitar un proyecto</a>
      </div>
      <ol class="nexus-studio-process__steps"></ol>
    </div>
  `;

  const list = section.querySelector("ol");
  for (const [title, description] of steps) {
    const item = document.createElement("li");
    const heading = document.createElement("h3");
    const detail = document.createElement("p");
    heading.textContent = title;
    detail.textContent = description;
    item.append(heading, detail);
    list.append(item);
  }
  return section;
}

const root = document.getElementById("root");
const processSection = createProcessSection();

function syncStudioProcess() {
  const pathname = location.pathname.replace(/\/$/, "");
  const studio = pathname === studioPath ? root.querySelector("main #estudio") : null;

  if (!studio) {
    processSection.remove();
    return;
  }

  if (studio.previousElementSibling !== processSection) {
    studio.before(processSection);
  }
}

new MutationObserver(syncStudioProcess).observe(root, {childList: true, subtree: true});
syncStudioProcess();

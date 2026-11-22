const base = "/nexuslabs";
const photos = [
  ["agua", "A la orilla", "Detalle de una mano y una tela verde junto al agua"],
  ["luz", "Luz de tarde", "Retrato en color con luz cálida sobre el rostro"],
  ["monocromo", "Blanco y negro", "Retrato en blanco y negro de una persona sentada"],
  ["textura", "Luz y textura", "Retrato de un hombre con suéter terracota contra una pared de piedra"],
  ["flores", "Flores sobre tela", "Flores blancas sobre una tela de color azul intenso"]
];

const steps = [
  ["Solicitud de proyecto", "Cuéntanos qué necesitas, para cuándo y qué presupuesto tienes en mente. Revisamos si podemos ayudarte."],
  ["Bienvenida y agenda", "Si tu proyecto encaja, te damos la bienvenida y te enviamos un enlace para reservar la llamada."],
  ["Reunión de descubrimiento", "En 15–20 minutos por Google Meet aclaramos qué problema quieres resolver y qué objetivo debe cumplir el proyecto."],
  ["Propuesta, contrato y adelanto", "Recibes una cotización con alcance, plazo y precio fijo, el contrato y un enlace para pagar el 50 % de adelanto."],
  ["Briefing y arranque", "Cuando firmas y pagas el adelanto, te enviamos el cuestionario detallado y te pedimos los logos, textos, referencias y accesos necesarios."]
];

const editorial = document.createElement("div");
editorial.className = "nexus-editorial";
editorial.innerHTML = `
  <section class="nexus-editorial__cover" aria-labelledby="nexus-editorial-title">
    <h1 id="nexus-editorial-title">NEXUS LABS</h1>
    <p>Estudio de diseño web en La Romana, República Dominicana</p>
    <div class="nexus-editorial__gallery" role="group" aria-label="Galería fotográfica"></div>
    <p class="nexus-editorial__caption">Selección visual del estudio</p>
  </section>
  <section class="nexus-editorial__process" aria-labelledby="nexus-inicio-proyecto">
    <div class="nexus-editorial__process-layout">
      <div>
        <h2 id="nexus-inicio-proyecto">Cómo empieza tu proyecto</h2>
        <a href="${base}/contacto">Solicitar un proyecto</a>
      </div>
      <ol class="nexus-editorial__steps"></ol>
    </div>
  </section>
  <dialog class="nexus-editorial__viewer" aria-labelledby="nexus-editorial-photo-title">
    <div class="nexus-editorial__viewer-bar">
      <span class="nexus-editorial__photo-position" aria-live="polite"></span>
      <button type="button" data-action="close" aria-label="Cerrar foto" autofocus>×</button>
    </div>
    <figure>
      <img alt="">
      <figcaption id="nexus-editorial-photo-title"></figcaption>
    </figure>
    <div class="nexus-editorial__viewer-nav">
      <button type="button" data-action="previous" aria-label="Foto anterior">←</button>
      <button type="button" data-action="next" aria-label="Foto siguiente">→</button>
    </div>
  </dialog>
`;

const gallery = editorial.querySelector(".nexus-editorial__gallery");
const viewer = editorial.querySelector("dialog");
const viewerImage = viewer.querySelector("img");
const viewerTitle = viewer.querySelector("figcaption");
const viewerPosition = viewer.querySelector(".nexus-editorial__photo-position");
const stepList = editorial.querySelector(".nexus-editorial__steps");
let currentPhoto = 0;
let opener;

function photoUrl(name) {
  return `${base}/assets/estudio-${name}.webp`;
}

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const [name, title, alt] = photos[currentPhoto];
  viewerTitle.textContent = title;
  viewerPosition.textContent = `${currentPhoto + 1} / ${photos.length}`;
  viewerImage.alt = alt;
  viewerImage.src = photoUrl(name);
}

photos.forEach(([name, title, alt], index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "nexus-editorial__photo";
  button.setAttribute("aria-label", `Ampliar foto: ${title}`);
  button.setAttribute("aria-haspopup", "dialog");

  const photo = document.createElement("img");
  photo.decoding = "async";
  photo.alt = alt;
  photo.src = photoUrl(name);
  if (index === 2) photo.fetchPriority = "high";
  button.append(photo);
  button.addEventListener("click", () => {
    opener = button;
    showPhoto(index);
    viewer.showModal();
  });
  gallery.append(button);
});

for (const [title, description] of steps) {
  const item = document.createElement("li");
  const heading = document.createElement("h3");
  const detail = document.createElement("p");
  heading.textContent = title;
  detail.textContent = description;
  item.append(heading, detail);
  stepList.append(item);
}

viewer.querySelector('[data-action="close"]').addEventListener("click", () => viewer.close());
viewer.querySelector('[data-action="previous"]').addEventListener("click", () => showPhoto(currentPhoto - 1));
viewer.querySelector('[data-action="next"]').addEventListener("click", () => showPhoto(currentPhoto + 1));
viewer.addEventListener("click", event => {
  if (event.target === viewer) viewer.close();
});
viewer.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(currentPhoto + (event.key === "ArrowLeft" ? -1 : 1));
  }
});
viewer.addEventListener("close", () => opener?.focus());

const root = document.getElementById("root");

function syncStudio() {
  const pathname = location.pathname.replace(/\/$/, "");
  const studio = pathname === `${base}/estudio` ? root.querySelector("main #estudio") : null;
  if (studio && studio.previousElementSibling !== editorial) {
    studio.before(editorial);
  }
  if (!studio && editorial.isConnected) {
    if (viewer.open) viewer.close();
    editorial.remove();
  }
}

new MutationObserver(syncStudio).observe(root, {childList: true, subtree: true});
syncStudio();

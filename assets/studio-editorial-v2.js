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
        <div><a href="https://nexus-labs-workspace.cleardumpling.chatgpt.site/">Probar el workspace editable</a></div>
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


// Branding: layout editorial integrado en El estudio; notas por perfil de navegador.
const branding = document.createElement('section');
branding.className = 'nexus-branding';
branding.setAttribute('aria-labelledby', 'branding-titulo');
branding.innerHTML = `
  <div class="nexus-branding__inner">
    <div class="nexus-branding__eyebrow"><span>ESTUDIO / BRANDING</span><span>01 — IDENTIDAD</span></div>
    <div class="nexus-branding__intro">
      <div><p class="nexus-branding__kicker">Una marca con intención</p><h2 id="branding-titulo">Una identidad que habla <em>por tu negocio.</em></h2></div>
      <div class="nexus-branding__lead"><p>Soy Cristian, de NEXUS LABS. Te ayudo a transformar tu idea en una identidad visual clara y coherente, lista para presentarse ante tus clientes.</p><a href="/nexuslabs/contacto">Hablemos de tu marca <span aria-hidden="true">↗</span></a></div>
    </div>
    <div class="nexus-branding__statement"><span>✳</span><p>Cada proyecto comienza con una conversación. El alcance, el precio y el plazo se acuerdan según lo que tu negocio necesita.</p></div>
    <div class="nexus-branding__sectionhead"><div><p class="nexus-branding__kicker">EL PROCESO</p><h3>Así trabajamos<br><em>tu marca.</em></h3></div><p>De la primera idea a las piezas que necesitas para presentar tu negocio.</p></div>
    <div class="nexus-branding__steps">
      <details><summary><span>01</span><strong>Descubrimiento</strong><span class="nexus-branding__plus" aria-hidden="true"></span></summary><div><p>Conversamos sobre tu negocio, tus clientes, tus objetivos y el estilo que buscas.</p><p><b>Resultado:</b> resumen del proyecto y sus prioridades.</p></div></details>
      <details><summary><span>02</span><strong>Dirección creativa</strong><span class="nexus-branding__plus" aria-hidden="true"></span></summary><div><p>Definimos referencias, colores y tipografías para dar forma a la identidad.</p><p><b>Resultado:</b> dirección visual para revisar juntos.</p></div></details>
      <details><summary><span>03</span><strong>Diseño</strong><span class="nexus-branding__plus" aria-hidden="true"></span></summary><div><p>Desarrollo la identidad y las piezas que hayamos acordado.</p><p><b>Resultado:</b> propuesta visual aplicada a formatos relevantes.</p></div></details>
      <details><summary><span>04</span><strong>Revisión</strong><span class="nexus-branding__plus" aria-hidden="true"></span></summary><div><p>Revisamos tus comentarios y ajustamos los detalles dentro del alcance acordado.</p><p><b>Resultado:</b> versión revisada para tu aprobación.</p></div></details>
      <details><summary><span>05</span><strong>Entrega</strong><span class="nexus-branding__plus" aria-hidden="true"></span></summary><div><p>Preparo los archivos finales en los formatos acordados.</p><p><b>Resultado:</b> archivos organizados y guía básica, si forma parte de la propuesta.</p></div></details>
    </div>
    <div class="nexus-branding__sectionhead nexus-branding__inspiration"><div><p class="nexus-branding__kicker">DIRECCIÓN VISUAL</p><h3>Una idea.<br><em>Muchas posibilidades.</em></h3></div><p>Una identidad puede expresarse en tu web, una tarjeta, un menú o tus redes sociales. Estas imágenes forman parte de la selección visual del estudio.</p></div>
    <figure class="nexus-branding__image"><img src="/nexuslabs/assets/estudio-flores.webp" alt="Flores blancas sobre una tela de color azul intenso" loading="lazy"><figcaption><span>REFERENCIAS DEL ESTUDIO</span><span>IMAGEN 01 / 01</span></figcaption></figure>
    <div class="nexus-branding__sectionhead"><div><p class="nexus-branding__kicker">TU ESPACIO</p><h3>Empieza por<br><em>una idea.</em></h3></div><p>Prepara tu proyecto a tu ritmo. Estas notas se guardan en este perfil del navegador y no se envían a NEXUS LABS.</p></div>
    <form class="nexus-branding__draft" autocomplete="off">
      <label for="nexus-brand-name"><span>01 / TU NEGOCIO</span><input id="nexus-brand-name" type="text" maxlength="120" placeholder="¿Cómo se llama tu negocio?"></label>
      <label for="nexus-brand-about"><span>02 / TU IDEA</span><textarea id="nexus-brand-about" maxlength="4000" rows="2" placeholder="¿Qué haces y a quién te gustaría llegar?"></textarea></label>
      <label for="nexus-brand-needs"><span>03 / LO QUE NECESITAS</span><textarea id="nexus-brand-needs" maxlength="4000" rows="2" placeholder="Identidad visual, página web, piezas para redes..."></textarea></label>
      <div class="nexus-branding__save"><p role="status" aria-live="polite">Guardado solo en este navegador. Quien use este mismo perfil puede ver las notas; al borrar sus datos pueden perderse.</p><button type="button">Borrar mis notas ↗</button></div>
    </form>
    <div class="nexus-branding__end"><p>¿Listo para empezar?</p><a href="/nexuslabs/contacto">Cuéntame tu proyecto <span aria-hidden="true">↗</span></a></div>
  </div>`;
const brandingStyle = document.createElement('style');
brandingStyle.textContent = `
.nexus-branding{background:var(--editorial-paper);color:var(--editorial-text);border-top:1px solid var(--editorial-line);font-family:"Geist Variable",ui-sans-serif,system-ui,sans-serif}.nexus-branding__inner{max-width:1170px;margin:auto;padding:clamp(4rem,9vw,8rem) 1.5rem}.nexus-branding__eyebrow{display:flex;justify-content:space-between;gap:1rem;color:var(--editorial-muted);font-size:.65rem;letter-spacing:.16em}.nexus-branding__intro{display:grid;gap:2rem;padding:clamp(3rem,7vw,6rem) 0}.nexus-branding__kicker{font-size:.68rem;letter-spacing:.16em;color:var(--editorial-muted);margin:0 0 1.3rem}.nexus-branding h2,.nexus-branding h3{font-family:"Instrument Serif",Georgia,serif;font-weight:400;letter-spacing:-.045em;line-height:.98;margin:0}.nexus-branding h2{font-size:clamp(3.2rem,7.2vw,6.5rem);max-width:13ch}.nexus-branding h3{font-size:clamp(2.8rem,5.5vw,5rem)}.nexus-branding h2 em,.nexus-branding h3 em{font-weight:400}.nexus-branding__lead{max-width:24rem;align-self:end}.nexus-branding__lead p,.nexus-branding__sectionhead>p{color:var(--editorial-muted);line-height:1.75;font-size:.95rem}.nexus-branding a{text-decoration:underline;text-underline-offset:.3em}.nexus-branding__lead a{display:inline-block;margin-top:1.5rem;font-weight:600}.nexus-branding__statement{border-top:1px solid var(--editorial-line);border-bottom:1px solid var(--editorial-line);padding:1.5rem 0;display:flex;gap:1.5rem;align-items:start}.nexus-branding__statement span{font-size:1.3rem}.nexus-branding__statement p{margin:0;max-width:45rem;color:var(--editorial-muted);line-height:1.7}.nexus-branding__sectionhead{display:grid;gap:1.5rem;padding:clamp(4rem,8vw,7rem) 0 2.8rem}.nexus-branding__sectionhead>p{max-width:24rem;align-self:end;margin:0}.nexus-branding__steps details{border-top:1px solid var(--editorial-line)}.nexus-branding__steps details:last-child{border-bottom:1px solid var(--editorial-line)}.nexus-branding__steps summary{list-style:none;display:grid;grid-template-columns:3rem 1fr auto;gap:1rem;align-items:center;cursor:pointer;padding:1.4rem 0}.nexus-branding__steps summary::-webkit-details-marker{display:none}.nexus-branding__steps summary>span:first-child{font-size:.75rem;color:var(--editorial-muted)}.nexus-branding__steps summary strong{font-weight:500;font-size:clamp(1.05rem,2vw,1.3rem)}.nexus-branding__plus:before{content:'+';font-size:1.5rem;font-weight:300}.nexus-branding__steps details[open] .nexus-branding__plus:before{content:'−'}.nexus-branding__steps details>div{padding:0 0 1.5rem 4rem;max-width:48rem;color:var(--editorial-muted);font-size:.9rem;line-height:1.7}.nexus-branding__steps details p{margin:.4rem 0}.nexus-branding__steps details b{color:var(--editorial-text);font-weight:600}.nexus-branding__image{margin:0}.nexus-branding__image img{width:100%;height:clamp(18rem,52vw,38rem);object-fit:cover;object-position:center}.nexus-branding__image figcaption{display:flex;justify-content:space-between;padding-top:.8rem;color:var(--editorial-muted);font-size:.62rem;letter-spacing:.15em}.nexus-branding__draft label{display:block;border-top:1px solid var(--editorial-line);padding:1.2rem 0}.nexus-branding__draft label>span{display:block;font-size:.65rem;letter-spacing:.14em;color:var(--editorial-muted);margin-bottom:.8rem}.nexus-branding__draft input,.nexus-branding__draft textarea{display:block;width:100%;background:transparent;border:0;border-radius:0;color:var(--editorial-text);font:inherit;font-size:1rem;line-height:1.6;outline-offset:4px;resize:vertical}.nexus-branding__draft input::placeholder,.nexus-branding__draft textarea::placeholder{color:var(--editorial-muted);opacity:.75}.nexus-branding__save{border-top:1px solid var(--editorial-line);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:start;gap:1rem;padding:1rem 0}.nexus-branding__save p{margin:0;max-width:34rem;color:var(--editorial-muted);font-size:.75rem;line-height:1.6}.nexus-branding__save button{background:transparent;border:0;padding:0;font:inherit;font-size:.8rem;text-decoration:underline;text-underline-offset:.25em;cursor:pointer}.nexus-branding__end{margin-top:clamp(4rem,8vw,7rem);border-top:1px solid var(--editorial-line);padding-top:2rem}.nexus-branding__end p{font-size:.75rem;letter-spacing:.1em;color:var(--editorial-muted);text-transform:uppercase}.nexus-branding__end a{display:inline-block;margin-top:.8rem;font-family:"Instrument Serif",Georgia,serif;font-size:clamp(2.2rem,5vw,4rem);text-underline-offset:.15em}.nexus-branding summary:focus-visible,.nexus-branding button:focus-visible,.nexus-branding input:focus-visible,.nexus-branding textarea:focus-visible{outline:2px solid currentColor;outline-offset:4px}@media(min-width:760px){.nexus-branding__intro,.nexus-branding__sectionhead{grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:clamp(3rem,7vw,7.5rem)}}@media(max-width:480px){.nexus-branding__eyebrow{font-size:.58rem}.nexus-branding__steps summary{grid-template-columns:2rem 1fr auto}.nexus-branding__steps details>div{padding-left:3rem}}
`;
document.head.append(brandingStyle);
editorial.insertBefore(branding, viewer);
const brandingKey = 'nexus-branding-ideas-v1';
const brandingFields = [...branding.querySelectorAll('input, textarea')];
const brandingStatus = branding.querySelector('[role="status"]');
const brandingPrivacy = 'Guardado solo en este navegador. Quien use este mismo perfil puede ver las notas; al borrar sus datos pueden perderse.';
try { const saved = JSON.parse(localStorage.getItem(brandingKey) || '{}'); for (const field of brandingFields) if (typeof saved[field.id] === 'string') field.value = saved[field.id]; }
catch { brandingStatus.textContent = 'No se pudieron recuperar tus notas en este navegador.'; }
for (const field of brandingFields) field.addEventListener('input', () => {
  try { localStorage.setItem(brandingKey, JSON.stringify(Object.fromEntries(brandingFields.map(item => [item.id, item.value])))); brandingStatus.textContent = brandingPrivacy; }
  catch { brandingStatus.textContent = 'No se pudieron guardar tus notas. Cópialas antes de cerrar esta página.'; }
});
branding.querySelector('form').addEventListener('submit', event => event.preventDefault());
branding.querySelector('button').addEventListener('click', () => {
  if (!window.confirm('¿Borrar las notas guardadas en este navegador?')) return;
  try { localStorage.removeItem(brandingKey); for (const field of brandingFields) field.value = ''; brandingStatus.textContent = 'Notas eliminadas de este navegador.'; }
  catch { brandingStatus.textContent = 'No se pudieron eliminar tus notas.'; }
});

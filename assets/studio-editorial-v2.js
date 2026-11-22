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

// Branding workspace: each browser profile keeps its own local draft.
const brandSection = document.createElement("section");
brandSection.className = "nexus-branding";
brandSection.innerHTML = `
  <div class="brand-page">
    <div class="brand-crumb">NEXUS LABS <span> / </span> ESTUDIO <span> / </span> BRANDING</div>
    <div class="brand-icon" aria-hidden="true">✳</div>
    <p class="brand-label">DISEÑO DE MARCA · LA ROMANA, R. D.</p>
    <h2>Branding que hace que tu negocio se vea y se sienta profesional.</h2>
    <p class="brand-lead">Soy Cristian, de NEXUS LABS. Te ayudo a transformar tu idea en una identidad visual clara y coherente, lista para presentarse ante tus clientes.</p>
    <div class="brand-callout"><span>✦</span><p>Cada proyecto comienza con una conversación. El alcance, el precio y el tiempo de entrega se acuerdan según lo que tu negocio necesita.</p></div>
    <h3>Así trabajamos tu marca</h3>
    <div class="brand-table-wrap"><table><thead><tr><th>Etapa</th><th>Qué hacemos</th><th>Qué recibes</th></tr></thead><tbody>
      <tr><td>01 · Descubrimiento</td><td>Hablamos de tu negocio, tus clientes y tus objetivos.</td><td>Resumen y prioridades.</td></tr>
      <tr><td>02 · Dirección creativa</td><td>Definimos referencias, colores y tipografías.</td><td>Una dirección visual para revisar.</td></tr>
      <tr><td>03 · Diseño</td><td>Desarrollo la identidad y las piezas acordadas.</td><td>Propuesta aplicada a formatos relevantes.</td></tr>
      <tr><td>04 · Revisión</td><td>Revisamos comentarios y ajustamos detalles acordados.</td><td>Versión revisada para aprobación.</td></tr>
      <tr><td>05 · Entrega</td><td>Preparo los archivos en los formatos acordados.</td><td>Archivos organizados y guía básica, si se incluye.</td></tr>
    </tbody></table></div>
    <h3>Ejemplo visual · Café Bruma</h3><p class="brand-muted">Concepto ficticio para mostrar cómo podría presentarse una identidad, no un proyecto realizado para un cliente.</p>
    <div class="brand-board"><div class="brand-board__cover"><small>IDENTIDAD VISUAL · CONCEPTO FICTICIO</small><strong>Café Bruma</strong><small>UN MOMENTO PARA QUEDARTE</small></div><div class="brand-board__cards"><div><small>TARJETA DE PRESENTACIÓN</small><strong>Café Bruma</strong><small>CAFÉ DE BARRIO · HECHO CON CALMA</small></div><div class="brand-sage"><small>PALETA DE MARCA</small><div class="brand-swatches"><i></i><i></i><i></i><i></i></div><p>Verde bosque · Salvia · Crema · Café</p></div><div class="brand-sage"><small>APLICACIÓN</small><p class="brand-cup">Bruma</p><p>Vaso para llevar</p></div><div><small>PUBLICACIÓN DIGITAL</small><strong>Una pausa<br>para ti.</strong></div></div></div>
    <h3>¿Qué puede incluir tu proyecto?</h3><ul class="brand-list"><li>Identidad visual básica: logotipo tipográfico, colores y tipografías.</li><li>Piezas digitales para redes sociales.</li><li>Tarjetas, menús o presentaciones digitales.</li><li>Página web o catálogo con contacto por WhatsApp, según el alcance.</li></ul>
    <p class="brand-muted">Cada entrega se define en la propuesta. Los costos externos se acuerdan por separado.</p>
    <div class="brand-draft"><div><p class="brand-label">TU ESPACIO PERSONAL</p><h3>Cuéntame sobre tu marca</h3><p>Escribe tus ideas para preparar tu proyecto. Se guardan únicamente en este navegador y no se envían a NEXUS LABS.</p></div>
      <label for="brand-business">Nombre de tu negocio</label><input id="brand-business" maxlength="120" placeholder="Ej. Café Bruma" autocomplete="off">
      <label for="brand-about">¿Qué hace tu negocio?</label><textarea id="brand-about" rows="3" maxlength="4000" placeholder="Cuéntame qué ofreces y a quién ayudas."></textarea>
      <label for="brand-needs">¿Qué te gustaría crear?</label><textarea id="brand-needs" rows="3" maxlength="4000" placeholder="Una identidad, una página web, piezas para redes..."></textarea>
      <p class="brand-storage" aria-live="polite">Tus notas se guardan en este navegador. Cualquier persona que use el mismo perfil del navegador podrá verlas; se pueden perder al borrar sus datos.</p>
      <div class="brand-actions"><button type="button" data-brand-reset>Eliminar mis notas</button><a href="/nexuslabs/contacto">Hablar de mi proyecto ↗</a></div>
    </div>
  </div>
`;
const brandStyle = document.createElement("style");
brandStyle.textContent = `
.nexus-branding{background:#fff;color:#292723;font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:clamp(50px,8vw,110px) 22px;border-top:1px solid #e8e5df}.brand-page{max-width:900px;margin:auto}.brand-crumb,.brand-label{font-size:11px;letter-spacing:.13em;font-weight:700;color:#89847c}.brand-crumb span{padding:0 9px;color:#d0ccc5}.brand-icon{font-size:42px;margin:35px 0 5px;color:#566e5b}.nexus-branding h2{font-size:clamp(2.4rem,6vw,4.6rem);letter-spacing:-.055em;line-height:1.06;max-width:820px;margin:10px 0 22px}.brand-lead{font-size:1.1rem;color:#68645d;max-width:720px}.brand-callout{display:flex;gap:16px;background:#f5f4f0;border-radius:8px;padding:18px 22px;margin:36px 0 54px}.brand-callout span{font-size:22px;color:#667f69}.brand-callout p{margin:0}.nexus-branding h3{font-size:1.45rem;letter-spacing:-.03em;margin:50px 0 15px}.brand-table-wrap{overflow-x:auto}.nexus-branding table{border-collapse:collapse;width:100%;min-width:600px;font-size:14px}.nexus-branding th,.nexus-branding td{border:1px solid #e9e6e1;padding:13px;text-align:left;vertical-align:top}.nexus-branding th{background:#f8f7f4;color:#77716a}.brand-muted{color:#77716a;font-size:14px}.brand-board{background:#e5dfd3;padding:16px;border-radius:10px;margin:25px 0}.brand-board__cover{background:#26382e;color:#f1e8d6;padding:30px;min-height:230px;display:flex;flex-direction:column;justify-content:space-between;border-radius:6px}.brand-board small{font-size:10px;letter-spacing:.14em}.brand-board strong{display:block;font:italic clamp(34px,6vw,65px) Georgia,serif;letter-spacing:-.04em}.brand-board__cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.brand-board__cards>div{background:#f8f1e3;min-height:180px;border-radius:5px;padding:22px;color:#302b25}.brand-board__cards strong{font-size:36px;margin:24px 0 12px}.brand-board__cards .brand-sage{background:#a3ae97}.brand-swatches{display:flex;gap:5px;margin:24px 0}.brand-swatches i{height:32px;flex:1;background:#26382e;border-radius:3px}.brand-swatches i:nth-child(2){background:#a3ae97;border:1px solid #82917b}.brand-swatches i:nth-child(3){background:#f8f1e3}.brand-swatches i:nth-child(4){background:#815b40}.brand-cup{background:#f5ead9;color:#26382e;width:90px;margin:10px auto;padding:30px 10px;text-align:center;clip-path:polygon(5% 0,95% 0,82% 100%,18% 100%);font:italic 23px Georgia}.brand-list{padding-left:22px}.brand-list li{padding:5px 0}.brand-draft{background:#f7f6f3;border:1px solid #eeece7;border-radius:10px;padding:clamp(20px,4vw,35px);margin-top:60px}.brand-draft h3{margin:8px 0}.brand-draft p{color:#6e6a63;font-size:14px}.brand-draft label{display:block;font-weight:650;font-size:14px;margin:18px 0 7px}.brand-draft input,.brand-draft textarea{width:100%;background:#fff;border:1px solid #d9d5ce;border-radius:6px;padding:12px;color:#292723;font:inherit;resize:vertical}.brand-draft input:focus,.brand-draft textarea:focus{outline:2px solid #758d77;outline-offset:2px}.brand-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:20px}.brand-actions button,.brand-actions a{border:1px solid #d7d2c9;border-radius:6px;background:white;color:#292723;padding:10px 16px;text-decoration:none;font:inherit;font-size:14px;cursor:pointer}.brand-actions a{background:#26382e;color:#fff;border-color:#26382e}.brand-actions button:hover,.brand-actions a:hover{opacity:.8}@media(max-width:600px){.brand-board__cards{grid-template-columns:1fr}.brand-board__cards>div{min-height:140px}.nexus-branding h2{font-size:2.6rem}}
`;
document.head.append(brandStyle);
editorial.insertBefore(brandSection, viewer);
const draftKey = "nexus-brand-draft-v1";
const draftFields = ["brand-business", "brand-about", "brand-needs"];
const draftStatus = brandSection.querySelector(".brand-storage");
try {
  const saved = JSON.parse(localStorage.getItem(draftKey) || "{}");
  for (const id of draftFields) if (typeof saved[id] === "string") brandSection.querySelector("#" + id).value = saved[id];
} catch { draftStatus.textContent = "No se pudieron recuperar las notas guardadas en este navegador."; }
for (const id of draftFields) brandSection.querySelector("#" + id).addEventListener("input", () => {
  try {
    const draft = Object.fromEntries(draftFields.map(key => [key, brandSection.querySelector("#" + key).value]));
    localStorage.setItem(draftKey, JSON.stringify(draft));
    draftStatus.textContent = "Guardado en este navegador. Quien use este mismo perfil puede ver tus notas; se pierden si se borran los datos del navegador.";
  } catch { draftStatus.textContent = "No se pudieron guardar tus notas. Copia el texto antes de cerrar esta página."; }
});
brandSection.querySelector("[data-brand-reset]").addEventListener("click", () => {
  if (!window.confirm("¿Eliminar las notas guardadas en este navegador?")) return;
  try { localStorage.removeItem(draftKey); for (const id of draftFields) brandSection.querySelector("#" + id).value = ""; draftStatus.textContent = "Tus notas se eliminaron de este navegador."; }
  catch { draftStatus.textContent = "No se pudieron eliminar las notas guardadas en este navegador."; }
});


// Editable text is local to this browser profile and never changes the public template.
const editableText = [...brandSection.querySelectorAll('.brand-page > h2, .brand-lead, .brand-callout p, .brand-page > h3, .brand-page > .brand-muted, .brand-list li, .brand-table-wrap td')];
const textKey = 'nexus-brand-text-v1';
const editToolbar = document.createElement('div');
editToolbar.className = 'brand-actions';
editToolbar.innerHTML = '<button type="button" data-edit aria-pressed="false">Editar esta copia</button><button type="button" data-restore>Restaurar texto original</button><span class="brand-edit-status" role="status">Los cambios se guardan solo en este perfil de navegador.</span>';
brandSection.querySelector('.brand-page').insertBefore(editToolbar, brandSection.querySelector('.brand-page > h2'));
const originalText = editableText.map(element => element.textContent);
try { const stored = JSON.parse(localStorage.getItem(textKey) || 'null'); if (Array.isArray(stored) && stored.length === editableText.length && stored.every(item => typeof item === 'string')) editableText.forEach((element, index) => { element.textContent = stored[index]; }); } catch { editToolbar.querySelector('.brand-edit-status').textContent = 'No se pudieron recuperar los cambios guardados.'; }
let editing = false;
const editButton = editToolbar.querySelector('[data-edit]');
editButton.addEventListener('click', () => {
  editing = !editing;
  editableText.forEach(element => { element.contentEditable = editing ? 'plaintext-only' : 'false'; if (editing) element.setAttribute('aria-label', 'Texto editable'); else element.removeAttribute('aria-label'); });
  editButton.textContent = editing ? 'Terminar edición' : 'Editar esta copia';
  editButton.setAttribute('aria-pressed', String(editing));
  editToolbar.querySelector('.brand-edit-status').textContent = editing ? 'Selecciona un texto para editarlo. Los cambios quedan en este navegador.' : 'Edición terminada. Los cambios permanecen en este navegador.';
});
for (const element of editableText) element.addEventListener('input', () => {
  try { localStorage.setItem(textKey, JSON.stringify(editableText.map(item => item.textContent))); editToolbar.querySelector('.brand-edit-status').textContent = 'Cambios guardados en este navegador.'; }
  catch { editToolbar.querySelector('.brand-edit-status').textContent = 'No se pudo guardar; copia tus cambios antes de cerrar la página.'; }
});
editToolbar.querySelector('[data-restore]').addEventListener('click', () => {
  if (!window.confirm('¿Restaurar el texto original y borrar tus cambios locales?')) return;
  try { localStorage.removeItem(textKey); editableText.forEach((element, index) => { element.textContent = originalText[index]; }); editToolbar.querySelector('.brand-edit-status').textContent = 'Texto original restaurado.'; }
  catch { editToolbar.querySelector('.brand-edit-status').textContent = 'No se pudieron borrar los cambios guardados.'; }
});
brandStyle.textContent += '.nexus-branding [contenteditable="plaintext-only"]{outline:1px dashed #91a393;outline-offset:4px;border-radius:3px}.brand-edit-status{color:#77716a;font-size:12px}';

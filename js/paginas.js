const $ = s => document.querySelector(s), Q = new URLSearchParams(location.search), P = document.body.dataset.page;
const J = f => fetch(f == 'datos' ? '../data/datos.json' : 'data/' + f + '.json').then(r => r.json());
const ini = n => n.replace(/^(Dra?\.|Mtr[oa]\.)\s*/, '').split(' ').slice(0, 2).map(w => w[0]).join('');
const ph = n => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#2b1042"/><text x="50" y="63" font-size="36" text-anchor="middle" fill="#ffcf00" font-family="sans-serif" font-weight="700">${ini(n)}</text></svg>`);
const img = (m, c) => `<img src="${m.foto || `utilidades/integrantes/${m.id}.jpg`}" alt="${m.nombre}" class="${c} rounded-full object-cover shrink-0" onerror="this.onerror=null;this.src='${ph(m.nombre)}'">`;
const photo = (m, c, buttonClass = '') => `<button type="button" class="w-fit h-fit rounded-full cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-unacarAmbar ${buttonClass}" data-investigator-photo aria-label="Ampliar foto de ${m.nombre}">${img(m, c)}</button>`;
const ul = a => '<ul class="list-disc pl-5 space-y-1">' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
const sec = (t, b) => `<section class="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-unacarAmbar"><h2 class="text-xl font-extrabold text-unacarMorado mb-3">${t}</h2>${b}</section>`;
const title = (k, t) => `<span class="text-unacarAmbar font-bold uppercase text-sm tracking-wider">${k}</span><h1 class="text-3xl font-extrabold text-unacarMorado mt-1 mb-8">${t}</h1>`;

const photoDialog = document.createElement('dialog');
photoDialog.className = 'w-screen h-screen max-w-none max-h-none m-0 p-0 border-0 bg-transparent backdrop:bg-black/90';
photoDialog.innerHTML = `<div class="relative w-full h-full bg-black/90 flex flex-col items-center justify-center gap-5 p-4"><button type="button" class="absolute top-4 right-4 text-white text-4xl leading-none p-2 hover:text-unacarAmarillo focus:outline-none focus-visible:ring-2 focus-visible:ring-unacarAmarillo rounded" aria-label="Cerrar foto">×</button><img class="w-80 h-80 md:w-[500px] md:h-[500px] rounded-full object-cover border-4 border-unacarAmarillo shadow-2xl" alt=""><p class="text-white text-center font-semibold"></p></div>`;
document.body.append(photoDialog);
const dialogImage = photoDialog.querySelector('img');
const dialogCaption = photoDialog.querySelector('p');
photoDialog.querySelector('button').addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('click', event => {
    if (event.target === photoDialog || event.target === photoDialog.firstElementChild) photoDialog.close();
});
$('#app').addEventListener('error', event => {
    const image = event.target;
    const button = image instanceof HTMLImageElement && image.closest('[data-investigator-photo]');
    if (!button) return;
    button.disabled = true;
    button.removeAttribute('data-investigator-photo');
    button.classList.remove('cursor-zoom-in');
    button.setAttribute('aria-label', 'Foto no disponible para ampliar');
}, true);
$('#app').addEventListener('click', event => {
    const button = event.target.closest('[data-investigator-photo]');
    if (!button) return;
    dialogImage.src = button.querySelector('img').currentSrc;
    dialogImage.alt = button.getAttribute('aria-label').replace('Ampliar foto de ', '');
    dialogCaption.textContent = dialogImage.alt;
    photoDialog.showModal();
});

const R = {
    saber: async () => {
        const [r, m] = await Promise.all([J('red'), J('integrantes')]);
        $('#app').innerHTML = title('La red', 'Sobre NTCyDA') +
            sec('Datos generales', '<dl class="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">' + r.datos.map(([k, v]) => `<div><dt class="font-bold text-unacarMorado">${k}</dt><dd>${v}</dd></div>`).join('') + '</dl>') +
            sec('Objetivo', `<p>${r.objetivo}</p>`) + `<div class="grid md:grid-cols-2 gap-6">${sec('Misión', `<p>${r.mision}</p>`)}${sec('Visión', `<p>${r.vision}</p>`)}</div>` +
            sec('Instituciones participantes', r.instituciones.map(x => `<p class="mb-3"><b class="text-unacarMorado">${x.n}</b><br>${x.t}</p>`).join('')) +
            `<div class="grid md:grid-cols-2 gap-6">${sec('Estrategias', ul(r.estrategias))}${sec('Compromisos', ul(r.compromisos))}${sec('Beneficios', ul(r.beneficios))}${sec('Resultados esperados', ul(r.resultados))}</div>` +
            sec('Actividades', ul(r.actividades)) + sec('Producción de la red', `<h3 class="font-bold">Artículos</h3>${ul(r.produccion.articulos)}<h3 class="font-bold mt-3">Capítulos de libro</h3>${ul(r.produccion.capitulos)}<h3 class="font-bold mt-3">Tesis</h3>${ul(r.produccion.tesis)}`) +
            sec('Integrantes', `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${m.map(x => `<div class="flex items-center gap-3 p-3 rounded-lg bg-unacarGris/40 hover:bg-unacarAmarillo/40 transition">${photo(x, 'w-14 h-14')}<a href="perfil.html?id=${x.id}" class="text-sm"><b class="block text-unacarMorado">${x.nombre}</b>${x.correo || x.institucion}</a></div>`).join('')}</div>`);
    },
    nosotros: async () => {
        const m = await J('integrantes');
        $('#app').innerHTML = title('Comunidad', 'Nuestros investigadores') + `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${m.map(x => `<article class="bg-white rounded-xl shadow-md border border-unacarGris p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition">${photo(x, 'w-28 h-28 border-4 border-unacarAmarillo')}<a href="perfil.html?id=${x.id}" class="flex flex-col items-center text-center flex-grow"><h3 class="font-bold text-unacarMorado mt-3">${x.nombre}</h3><p class="text-xs font-semibold text-unacarAmbar mb-2">${x.institucion}</p><p class="text-xs text-gray-500 mb-2">${x.grados}</p><p class="text-sm text-gray-600 flex-grow">${x.resumen}</p><span class="mt-4 text-sm font-semibold text-unacarMorado">Ver perfil →</span></a></article>`).join('')}</div>`
    },
    perfil: async () => {
        const x = (await J('integrantes')).find(i => i.id == Q.get('id')); if (!x) return $('#app').innerHTML = '<p>Perfil no encontrado.</p>'; document.title = x.nombre;
        $('#app').innerHTML = `<a href="nosotros.html" class="text-sm text-unacarAmbar font-semibold">← Volver</a><div class="bg-white rounded-xl shadow-md p-6 md:p-10 mt-4 flex flex-col md:flex-row gap-8">${photo(x, 'w-40 h-40 border-4 border-unacarAmarillo', 'self-center')}<div><h1 class="text-3xl font-extrabold text-unacarMorado">${x.nombre}</h1><p class="text-unacarAmbar font-semibold mb-4">${x.institucion}</p><p class="mb-4">${x.perfil}</p>${x.grados ? `<h3 class="font-bold text-unacarMorado">Formación</h3>${ul(x.grados.split(' · '))}` : ''}${x.areas.length ? `<h3 class="font-bold text-unacarMorado mt-4">Áreas de interés</h3>${ul(x.areas)}` : ''}<div class="mt-4 text-sm space-y-1">${x.sni ? `<p><b>SNII:</b> ${x.sni}</p>` : ''}${x.correo ? `<p><b>Correo:</b> <a class="underline" href="mailto:${x.correo}">${x.correo}</a></p>` : ''}${x.orcid ? `<p><b>ORCID:</b> <a class="underline" target="_blank" rel="noopener" href="${x.orcid}">${x.orcid}</a></p>` : ''}</div></div></div>`
    },
    evento: async () => {
        const e = (await J('datos')).eventos.find(i => i.id == Q.get('id')); if (!e) return $('#app').innerHTML = '<p>Evento no encontrado.</p>'; document.title = e.titulo;
        const b = 'block text-center font-bold px-6 py-3 rounded-lg ';
        const paint = () => {
            const n = new Date(), a = e.asistencia, on = n >= new Date(a.desde) && n <= new Date(a.hasta);
            $('#asis').outerHTML = on ? `<a id="asis" href="${a.enlace}" target="_blank" rel="noopener" class="${b}bg-unacarMorado text-white hover:bg-unacarAmbar">Unirse a la sesión</a>` : `<span id="asis" class="${b}bg-gray-300 text-gray-500 cursor-not-allowed">Asistencia ${n > new Date(a.hasta) ? 'finalizada' : 'disponible desde el ' + new Date(a.desde).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</span>`
            if (e.conexion) {
                const c = e.conexion, disponible = n >= new Date(c.desde) && n <= new Date(c.hasta);
                const detalles = disponible
                    ? `<a href="${c.enlace}" target="_blank" rel="noopener" class="${b}bg-unacarMorado text-white hover:bg-unacarAmbar">Unirse a la reunión</a><div class="mt-4 space-y-1 text-sm">${c.id ? `<p><b>Id. de reunión:</b> ${c.id}</p>` : ''}${c.codigo ? `<p><b>Código de acceso:</b> ${c.codigo}</p>` : ''}</div>`
                    : `<span class="${b}bg-gray-300 text-gray-500 cursor-not-allowed">Conexión ${n > new Date(c.hasta) ? 'finalizada' : 'disponible desde el ' + new Date(c.desde).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</span>`;
                $('#conexion').innerHTML = sec('Conexión al evento', detalles);
            }
        };
        const registro = e.registroEstado === 'abierto'
            ? `<a href="${e.registro}" target="_blank" rel="noopener" class="${b}bg-unacarAmarillo text-unacarMorado hover:bg-unacarAmbar hover:text-white">Registro</a>`
            : `<span class="${b}bg-gray-300 text-gray-500 cursor-not-allowed">${e.registroEstado === 'suspendido' ? 'Registro suspendido' : 'Registro terminado'}</span>`;
        $('#app').innerHTML = `<a href="index.html#eventos" class="text-sm text-unacarAmbar font-semibold">← Eventos</a><img src="${e.imagen}" alt="" class="w-full h-64 md:h-80 object-cover rounded-xl mt-4"><div class="mt-6">${title(e.fecha + ' · ' + e.lugar, e.titulo)}</div><div class="mb-8">${e.descripcionCompleta.split("\n\n").map(p => `<p class="mb-3">${p}</p>`).join("")}</div><div class="grid sm:grid-cols-2 gap-4 mb-8">${registro}<span id="asis"></span></div>${e.conexion ? '<div id="conexion" class="mb-6"></div>' : ''}` +
            (Array.isArray(e.documentos) && e.documentos.length ? sec('Documentos', ul(e.documentos.map(d => `<a class="underline text-unacarMorado" href="${d.url}" target="_blank" rel="noopener">${d.nombre}</a>`))) : '') +
            e.programa.map(d => sec(d.dia + (d.moderador ? ` <small class="block text-sm text-gray-500 font-normal">Moderación: ${d.moderador}</small>` : ''), `<div class="divide-y">${d.items.map(i => `<div class="py-3 flex gap-4"><b class="w-28 shrink-0 text-unacarAmbar text-sm">${i.h}</b><div class="text-sm"><b>${i.t}</b>${i.p ? `<br><span class="text-gray-600">${i.p}</span>` : ''}</div></div>`).join('')}</div>`)).join('');
        paint(); setInterval(paint, 30000)
    },
    pubs: async () => {
        const p = await J('publicaciones');
        $('#app').innerHTML = title('Obras', 'Publicaciones') + `<div class="grid md:grid-cols-2 gap-8">${p.map((x, k) => `<article class="bg-white rounded-xl shadow-md border border-unacarGris p-6 flex flex-col"><img src="${x.portada}" alt="Portada de ${x.titulo}" class="w-full h-64 md:h-[508px] object-contain rounded-lg shadow bg-gray-100 mb-5" onerror="this.onerror=null;this.src='${ph('NT CyDA')}'"><div class="flex flex-col flex-grow"><h3 class="font-bold text-unacarMorado">${x.titulo}</h3><span class="text-xs font-semibold text-unacarAmbar mb-2">${x.fecha}</span><p class="text-sm text-gray-600 flex-grow">${x.resumen}</p><div class="flex flex-wrap gap-2 mt-4">${x.lectura ? `<button onclick="leer(${k})" class="bg-unacarAmarillo text-unacarMorado font-bold px-4 py-2 rounded text-sm hover:bg-unacarAmbar">Leer aquí</button>` : ''}${x.enlace ? `<a href="${x.enlace}" target="_blank" rel="noopener" class="bg-unacarMorado text-white font-semibold px-4 py-2 rounded text-sm hover:bg-unacarAmbar">Abrir visor</a>` : ''}</div></div></article>`).join('')}</div><p class="mt-10 text-sm italic text-gray-600 border-l-4 border-unacarAmarillo pl-4">Obra desarrollada y publicada en el marco de la Red de colaboración académica Nuevas Tecnologías de Conservación y Desarrollo de Alimentos. Publicado y difundido con la autorización de la coordinación de la red.</p><div id="md" class="hidden fixed inset-0 z-[60] bg-black/70 flex flex-col p-2 md:p-6"><div class="flex justify-between items-center bg-unacarMorado text-white px-4 py-2 rounded-t-lg"><b id="mt" class="text-sm truncate"></b><span><a id="mo" target="_blank" rel="noopener" class="text-unacarAmarillo underline text-sm mr-4">Abrir enlace oficial</a><button onclick="$('#md').classList.add('hidden');$('#mf').src=''" class="text-2xl" aria-label="Cerrar">✕</button></span></div><iframe id="mf" class="flex-grow bg-white rounded-b-lg w-full"></iframe></div>`;
        window.leer = k => {
            if (!p[k].lectura) return;
            $('#mt').textContent = p[k].titulo;
            $('#mo').href = p[k].enlace || '#';
            $('#mo').classList.toggle('hidden', !p[k].enlace);
            $('#mf').src = p[k].lectura;
            $('#md').classList.remove('hidden');
        }
    },
    contacto: () => { }
};
R[P] && R[P]();

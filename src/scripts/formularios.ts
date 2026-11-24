// Envío en segundo plano de los formularios (diagnóstico y boletín) a /enviar.php.
// El contenedor [data-form-box] cambia data-estado: form → sending → sent | error; el CSS muestra cada estado.
export function enviarFormularios() {
  document.querySelectorAll<HTMLFormElement>('form[data-ajax]').forEach((form) => {
    if (form.dataset.listo) return;
    form.dataset.listo = '1';
    const box = form.closest<HTMLElement>('[data-form-box]')!;
    const set = (estado: string) => { box.dataset.estado = estado; };

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (box.dataset.estado === 'sending') return;
      set('sending');
      try {
        const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(String(r.status));
        form.reset();
        set('sent');
      } catch {
        set('error');
      }
    });

    box.querySelector('[data-reset]')?.addEventListener('click', () => set('form'));

    // Sin JS, enviar.php redirige con ?enviado=<form> o ?error=<form>.
    const q = new URLSearchParams(location.search);
    if (q.get('enviado') === form.dataset.ajax) set('sent');
    else if (q.get('error') === form.dataset.ajax) set('error');
  });
}

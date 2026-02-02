const pasos = document.querySelectorAll(".paso");
const acordeones = document.querySelectorAll(".acordeon");

function panelDe(step) {
  return document.querySelector("#panel-" + step);
}

function pintarStepper(step) {
  pasos.forEach((b) => {
    const n = Number(b.dataset.step);
    b.classList.remove("is-active", "is-done");
    if (n < step) b.classList.add("is-done");
    if (n === step) b.classList.add("is-active");
  });
}

function cerrarTodo() {
  acordeones.forEach((a) => {
    a.classList.remove("active");
    a.setAttribute("aria-expanded", "false");
    const p = a.nextElementSibling;
    if (p && p.classList.contains("panel")) p.classList.remove("is-open");
  });
}

function abrirPaso(step) {
  cerrarTodo();
  const a = document.querySelector(`.acordeon[data-step="${step}"]`);
  const p = panelDe(step);

  if (a) {
    a.classList.add("active");
    a.setAttribute("aria-expanded", "true");
  }
  if (p) p.classList.add("is-open");

  pintarStepper(step);
}

function cerrarPaso(step) {
  const a = document.querySelector(`.acordeon[data-step="${step}"]`);
  const p = panelDe(step);

  if (a) {
    a.classList.remove("active");
    a.setAttribute("aria-expanded", "false");
  }
  if (p) p.classList.remove("is-open");

  pintarStepper(step);
}

acordeones.forEach((a) => {
  a.addEventListener("click", () => {
    const step = Number(a.dataset.step);
    if (a.classList.contains("active")) cerrarPaso(step);
    else abrirPaso(step);
  });
});

pasos.forEach((b) => {
  b.addEventListener("click", () => {
    abrirPaso(Number(b.dataset.step));
  });
});

function ponerError(el, msg) {
  el.classList.add("is-error");
  const bloque = el.closest(".campo, fieldset, .check");
  if (!bloque) return;

  if (el.type === "checkbox") {
    const p = bloque.nextElementSibling;
    if (p && p.classList.contains("error-txt")) {
      p.textContent = msg || "Campo obligatorio";
      p.classList.remove("hidden");
    }
    return;
  }

  const p = bloque.querySelector(".error-txt");
  if (p) {
    p.textContent = msg || "Campo obligatorio";
    p.classList.remove("hidden");
  }
}

function quitarError(el) {
  el.classList.remove("is-error");
  const bloque = el.closest(".campo, fieldset, .check");
  if (!bloque) return;

  if (el.type === "checkbox") {
    const p = bloque.nextElementSibling;
    if (p && p.classList.contains("error-txt")) p.classList.add("hidden");
    return;
  }

  const p = bloque.querySelector(".error-txt");
  if (p) p.classList.add("hidden");
}

function validar(panel) {
  let ok = true;
  let primero = null;

  const req = panel.querySelectorAll("input[required], select[required]");
  req.forEach((el) => {
    if (el.type === "radio") return;

    if (el.type === "checkbox") {
      if (!el.checked) {
        ok = false;
        if (!primero) primero = el;
        ponerError(el, "Debes aceptar los términos");
      } else {
        quitarError(el);
      }
      return;
    }

    if (!el.checkValidity() || el.value.trim() === "") {
      ok = false;
      if (!primero) primero = el;

      let msg = "Campo obligatorio";
      if (el.tagName === "SELECT") msg = "Selecciona una opción";
      if (el.type === "number") msg = "Indica una cantidad válida";

      ponerError(el, msg);
    } else {
      quitarError(el);
    }
  });

  const radios = panel.querySelectorAll('input[type="radio"][required]');
  if (radios.length) {
    const name = radios[0].name;
    const checked = [...panel.querySelectorAll(`input[name="${name}"]`)].some(r => r.checked);
    const box = panel.querySelector(".campo-radio");

    if (!checked) {
      ok = false;
      if (!primero) primero = radios[0];
      if (box) {
        const p = box.querySelector(".error-txt");
        if (p) p.classList.remove("hidden");
        box.classList.add("is-error");
        setTimeout(() => box.classList.remove("is-error"), 350);
      }
    } else if (box) {
      const p = box.querySelector(".error-txt");
      if (p) p.classList.add("hidden");
    }
  }

  if (primero) primero.focus();
  return ok;
}

document.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", () => quitarError(el));
  el.addEventListener("blur", () => {
    if (!el.required) return;
    if (el.type === "radio") return;
    if (el.type === "checkbox") return;

    if (!el.checkValidity() || el.value.trim() === "") {
      let msg = "Campo obligatorio";
      if (el.tagName === "SELECT") msg = "Selecciona una opción";
      ponerError(el, msg);
    } else {
      quitarError(el);
    }
  });
});

document.querySelectorAll(".next").forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.closest(".panel");
    if (!panel) return;
    if (!validar(panel)) return;
    abrirPaso(Number(btn.dataset.next));
  });
});

abrirPaso(1);

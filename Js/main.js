window.addEventListener("load", function() {

    const loader = document.getElementById("loader");
    const contenido = document.getElementById("contenido");

    // =========================
    // CONTENEDOR MAPA + BOTÓN
    // =========================

    const contenedorMapa = document.createElement("div");
    contenedorMapa.style.marginTop = "20px";
    contenedorMapa.style.textAlign = "center";

    const mapaWrapper = document.createElement("div");
    mapaWrapper.className = "mapa-wrapper";

    const mapa = document.createElement("img");
    mapa.src = "../encino_map.png";
    mapa.alt = "Mapa Encino";
    mapa.style.maxWidth = "550px";
    mapa.style.maxHeight = "80vh";
    mapa.style.objectFit = "contain";
    mapa.style.transition = "opacity 0.5s ease";
    mapa.style.display = "block";

    mapaWrapper.appendChild(mapa);
    contenedorMapa.appendChild(mapaWrapper);

    // Botón debajo del mapa
    const boton = document.createElement("button");
    boton.textContent = "Cambiar mapa";
    boton.className = "cambiar-mapa";
    boton.style.marginTop = "10px"; // separación del mapa

    boton.addEventListener("click", function() {
        mapa.style.opacity = "0";
        setTimeout(() => {
            mapa.src = mapa.src.includes("encino_map.png")
                ? "../encino1.png"
                : "../encino_map.png";
            mapa.style.opacity = "1";
        }, 500);
    });

    contenedorMapa.appendChild(boton);

    // =========================
    // TABLA DE CÁMARAS
    // =========================

    const tabla = document.createElement("table");
    tabla.style.width = "80%";
    tabla.style.margin = "20px auto";
    tabla.style.borderCollapse = "collapse";
    tabla.style.textAlign = "center";
    tabla.style.fontFamily = "Arial, sans-serif";

    const encabezado = document.createElement("tr");
    ["ID", "Nombre", "Captura"].forEach(texto => {
        const th = document.createElement("th");
        th.textContent = texto;
        th.style.border = "1px solid #ccc";
        th.style.padding = "8px";
        th.style.background = "#38bdf8";
        th.style.color = "white";
        encabezado.appendChild(th);
    });
    tabla.appendChild(encabezado);

    const datosCamaras = [
        { id: "C001", nombre: "Camara 1", imagen: "../img_camera/1_ALAMEDA IZQUIERDA_main_20251204084441.jpg" },
        { id: "C002", nombre: "Camara 2", imagen: "../img_camera/1_ALAMEDA PEATONAL_main_20251204083035.jpg" },
        { id: "C003", nombre: "Camara 3", imagen: "../img_camera/1_CASETA ENTRADA_main_20251203164248.jpg" }
    ];

    datosCamaras.forEach(cam => {
        const tr = document.createElement("tr");

        const tdID = document.createElement("td");
        tdID.textContent = cam.id;
        tdID.style.border = "1px solid #ccc";
        tdID.style.padding = "8px";
        tdID.draggable = true;
        tdID.className = "drag-item";
        tdID.dataset.id = cam.id;

        const tdNombre = document.createElement("td");
        tdNombre.textContent = cam.nombre;
        tdNombre.style.border = "1px solid #ccc";
        tdNombre.style.padding = "8px";

        const tdImagen = document.createElement("td");
        const img = document.createElement("img");
        img.src = cam.imagen;
        img.alt = cam.nombre;
        img.style.width = "400px";
        img.style.height = "240px";
        img.style.objectFit = "cover";
        tdImagen.appendChild(img);
        tdImagen.style.border = "1px solid #ccc";
        tdImagen.style.padding = "8px";

        tr.appendChild(tdID);
        tr.appendChild(tdNombre);
        tr.appendChild(tdImagen);

        tabla.appendChild(tr);
    });

    contenido.appendChild(contenedorMapa);
    contenido.appendChild(tabla);

    // =========================
    // DRAG & DROP
    // =========================

    let dragData = null;
    const posiciones = [];

    document.querySelectorAll(".drag-item").forEach(item => {
        item.addEventListener("dragstart", e => {
            dragData = e.target.dataset.id;
        });
    });

    mapa.addEventListener("dragover", e => e.preventDefault());

    mapa.addEventListener("drop", e => {
        e.preventDefault();
        if (!dragData) return;

        const rect = mapa.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const camaraInfo = datosCamaras.find(c => c.id === dragData);

        // Crear marcador
        const punto = document.createElement("div");
        punto.className = "mapa-punto";
        punto.style.left = `${x}px`;
        punto.style.top = `${y}px`;

        // Crear tooltip
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip-camara";
        tooltip.innerHTML = `
            <img src="${camaraInfo.imagen}" alt="${camaraInfo.nombre}">
            <h4>${camaraInfo.nombre}</h4>
            <p>ID: ${camaraInfo.id}</p>
        `;

        punto.appendChild(tooltip);

        // Hover eventos
        punto.addEventListener("mouseenter", () => tooltip.classList.add("visible"));
        punto.addEventListener("mouseleave", () => tooltip.classList.remove("visible"));

        mapaWrapper.appendChild(punto);

        posiciones.push({
            id: dragData,
            x: x / rect.width,
            y: y / rect.height
        });

        console.log("Posiciones guardadas:", posiciones);
        dragData = null;
    });

    // LOADER
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = "none";
        contenido.style.display = "block";
        contenido.style.textAlign = "center";
    }, 1000);

});

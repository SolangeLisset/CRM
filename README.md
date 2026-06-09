# CRM Comercial

CRM Comercial es una aplicacion web sencilla, ordenada y visualmente cuidada para gestionar clientes, empresas, seguimientos, cotizaciones, tareas y pipeline de ventas desde un dashboard central.

Autora: **SolangeLisset**

## Caracteristicas

- Dashboard con metricas comerciales.
- Modulo de clientes con busqueda.
- Filtro de clientes por estado comercial.
- Modulo de empresas con resumen de contactos, ingresos y salud comercial.
- Seguimientos organizados como linea de tiempo.
- Cotizaciones con estado, monto y vencimiento.
- Tareas con prioridad y responsables.
- Pipeline de ventas tipo kanban.
- Creacion, edicion y eliminacion de registros.
- Persistencia con localStorage para conservar la informacion en el navegador.
- Movimiento de oportunidades entre etapas del pipeline con arrastrar y soltar.
- Calculo automatico de metricas del dashboard.
- Diseno responsive para escritorio y mobile.

## Tecnologias

- HTML5
- CSS3
- JavaScript modular
- Iconos con Lucide

## Estructura del proyecto

```text
crm-comercial/
├── index.html
├── README.md
└── src/
    ├── data.js
    ├── main.js
    └── styles.css
```

## Como ejecutar

No requiere instalacion de dependencias. Como usa JavaScript modular, ejecutalo con un servidor local.

Opciones rapidas:

```bash
python -m http.server 5173
```

Luego abre:

```text
http://localhost:5173
```

Tambien puedes usar una extension como Live Server en VS Code para verlo con recarga automatica.

## Publicar en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub.
2. Entra a Settings > Pages.
3. Selecciona la rama principal y la carpeta raiz del proyecto.
4. Guarda los cambios y espera a que GitHub genere la URL publica.

## Ideas para mejorar

- Conectar con una API o base de datos.
- Crear login y roles de usuario.
- Exportar cotizaciones a PDF.
- Agregar reportes comerciales por fecha y ejecutivo.

## Licencia

Proyecto creado para uso educativo y portafolio personal.

document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.file-checkbox');

    // Solo mostrar los botones si hay checkboxes en la página
    if (checkboxes.length > 0) {
        const downloadButton = document.getElementById('download-selected');

        // Crear los botones de selección
        const selectFirst37Button = document.createElement('button');
        selectFirst37Button.textContent = 'Seleccionar todo';
        selectFirst37Button.classList.add('btn-select-first37'); // Agregamos la clase
        selectFirst37Button.style.position = 'absolute';
        selectFirst37Button.style.top = '210px';
        selectFirst37Button.style.right = '10px';
        selectFirst37Button.style.padding = '10px 15px';
        selectFirst37Button.style.cursor = 'pointer';
        selectFirst37Button.style.backgroundColor = '#007bff';
        selectFirst37Button.style.color = 'white';
        selectFirst37Button.style.border = 'none';
        selectFirst37Button.style.borderRadius = '0px';

        const selectNext71Button = document.createElement('button');
        selectNext71Button.textContent = 'Seleccionar todo';
        selectNext71Button.classList.add('btn-select-next71'); // Agregamos la clase
        selectNext71Button.style.position = 'absolute';
        selectNext71Button.style.right = '10px';
        selectNext71Button.style.padding = '10px 15px';
        selectNext71Button.style.cursor = 'pointer';
        selectNext71Button.style.backgroundColor = '#007bff';
        selectNext71Button.style.color = 'white';
        selectNext71Button.style.border = 'none';
        selectNext71Button.style.borderRadius = '0px';

        document.body.appendChild(selectFirst37Button);
        document.body.appendChild(selectNext71Button);

        // Estado de selección
        let first37Selected = false;
        let next71Selected = false;

        // Función para alternar selección de los primeros 37 checkboxes
        selectFirst37Button.addEventListener('click', () => {
            first37Selected = !first37Selected;
            checkboxes.forEach((checkbox, index) => {
                if (index < 37) {
                    checkbox.checked = first37Selected;
                }
            });
        });

        // Función para alternar selección de los siguientes 71 checkboxes
        selectNext71Button.addEventListener('click', () => {
            next71Selected = !next71Selected;
            checkboxes.forEach((checkbox, index) => {
                if (index >= 37 && index < 108) {
                    checkbox.checked = next71Selected;
                }
            });
        });

        // Crear el modal
        const modal = document.createElement('div');
        modal.id = 'download-modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.padding = '20px';
        modal.style.backgroundColor = '#fff';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modal.style.zIndex = '1002';
        modal.innerHTML = '<p>Descargando<span id="dots">...</span></p>';
        document.body.appendChild(modal);

        // Crear el fondo opaco
        const overlay = document.createElement('div');
        overlay.id = 'download-overlay';
        overlay.style.display = 'none';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '1001';
        document.body.appendChild(overlay);

        // Función para hacer titilar los puntos suspensivos
        const dots = modal.querySelector('#dots');
        let dotCount = 0;
        setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            dots.textContent = '.'.repeat(dotCount);
        }, 500);

        downloadButton.addEventListener('click', async () => {
            const selectedFiles = document.querySelectorAll('.file-checkbox:checked');

            if (selectedFiles.length === 0) {
                alert('Por favor, selecciona al menos un archivo para descargar.');
                return;
            }

            overlay.style.display = 'block';
            modal.style.display = 'block';

            const downloadFile = async (fileUrl) => {
                return new Promise((resolve, reject) => {
                    try {
                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.download = '';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(resolve, 5000);
                    } catch (error) {
                        reject(`Error al descargar el archivo: ${fileUrl}`);
                    }
                });
            };

            const downloadAllFiles = async () => {
                for (let checkbox of selectedFiles) {
                    const fileUrl = checkbox.getAttribute('data-file-url');
                    if (fileUrl) {
                        try {
                            console.log(`Descargando: ${fileUrl}`);
                            await downloadFile(fileUrl);
                        } catch (error) {
                            console.error(error);
                            alert(`No se pudo descargar el archivo: ${fileUrl}`);
                        }
                    } else {
                        console.warn('No se encontró URL para este archivo');
                    }
                }
                modal.style.display = 'none';
                overlay.style.display = 'none';
                alert('Descargas completadas.');
            };

            await downloadAllFiles();
        });
    }
});



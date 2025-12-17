/**
 * Lector de Noticias Dinámico
 * API: NewsData.io
 */

const newsContainer = document.getElementById('news-container');
const refreshBtn = document.getElementById('refresh-btn');

// Configuración de la API
const API_KEY = 'pub_682996bfef1b4233a2ad7fd4f2d68d4e'; 
const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=es`;

/**
 * Función principal que consume la API usando Fetch
 */
async function fetchNews() {
    // 1. Estado de carga: Feedback visual para el usuario
    newsContainer.innerHTML = `
        <div class="loader-container">
            <div class="spinner"></div>
            <p>Sincronizando últimas noticias...</p>
        </div>
    `;
    
    try {
        const response = await fetch(URL);
        
        // 2. Validación de respuesta de red
        if (!response.ok) {
            throw new Error(`Error de conexión: ${response.status}`);
        }

        const data = await response.json();

        // 3. Procesamiento del JSON y validación de datos
        if (data.results && data.results.length > 0) {
            renderNews(data.results);
        } else {
            newsContainer.innerHTML = '<p class="error-msg">No se encontraron noticias en este momento.</p>';
        }

    } catch (error) {
        // 4. Manejo de errores (API caída o sin internet)
        console.error("Error al obtener datos:", error);
        newsContainer.innerHTML = `
            <div class="error-box">
                <p>Ocurrió un error al cargar las noticias.</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}

/**
 * Función para inyectar las noticias en el DOM
 * @param {Array} articles - Arreglo de noticias proveniente del JSON
 */
function renderNews(articles) {
    // Limpiamos el contenedor
    newsContainer.innerHTML = ''; 

    articles.forEach((article, index) => {
        // Creamos el elemento de la tarjeta
        const newsCard = document.createElement('article');
        newsCard.className = 'news-card';
        
        // Estructura interna de la noticia
        // Usamos una imagen por defecto si la noticia no tiene una propia
        const imageUrl = article.image_url || 'https://via.placeholder.com/400x200?text=Noticia+sin+imagen';
        
        newsCard.innerHTML = `
            <div class="card-image" style="background-image: url('${imageUrl}')"></div>
            <div class="news-content">
                <span class="source-tag">${article.source_id || 'Global'}</span>
                <h3>
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer">
                        ${article.title}
                    </a>
                </h3>
                <p>${article.description ? article.description.substring(0, 110) + '...' : 'Haz clic en el título para leer la nota completa en el portal original.'}</p>
                <div class="card-footer">
                    <small>📅 ${new Date(article.pubDate).toLocaleDateString()}</small>
                </div>
            </div>
        `;

        // Añadimos la tarjeta al contenedor principal
        newsContainer.appendChild(newsCard);
    });
}

/**
 * Event Listeners
 */

// Refrescar noticias al hacer clic en el botón
refreshBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fetchNews();
});

// Carga automática al abrir la página
document.addEventListener('DOMContentLoaded', fetchNews);
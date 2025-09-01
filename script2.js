// Inicializa o mapa em uma posição genérica
var map = L.map('map').setView([-15.7801, -47.9292], 5);

// Camada do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Ícone personalizado para o usuário
var userIcon = L.icon({
  iconUrl: '/img/pessoas.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Ícone personalizado para a livraria
var bookIcon = L.icon({
  iconUrl: '/img/iconLivraria.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Coordenadas reais da Livraria Camaño Foscarini
var livrariaLat = -30.0156999;
var livrariaLon = -51.1920028;

L.marker([livrariaLat, livrariaLon], { icon: bookIcon })
  .addTo(map)
  .bindPopup("<b>Livraria Camaño Foscarini</b><br>Rua Coronel Manoel Py, 222, Higienópolis, Porto Alegre")
  .openPopup();

// Função assíncrona que retorna a posição do usuário
async function getCurrentPositionAsync() {
  if (!navigator.geolocation) {
    throw new Error("❌ Geolocalização não suportada pelo seu navegador.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("❌ Permissão de localização negada."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("❌ Localização indisponível."));
            break;
          case error.TIMEOUT:
            reject(new Error("Tempo de resposta excedido."));
            break;
          default:
            reject(new Error("Erro desconhecido ao obter localização."));
        }
      }
    );
  });
}

// Função para centralizar o mapa e adicionar o marcador do usuário
async function centralizarMapaNoUsuario() {
  try {
    const position = await getCurrentPositionAsync();
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Centraliza o mapa no usuário
    map.setView([lat, lon], 14);

    // Marcador do usuário
    L.marker([lat, lon], { icon: userIcon })
      .addTo(map)
      .bindPopup("📍 Você está aqui!")
      .openPopup();
  } catch (error) {
    alert(error.message);
  }
}

// Chama a função para tentar obter a posição do usuário
centralizarMapaNoUsuario();

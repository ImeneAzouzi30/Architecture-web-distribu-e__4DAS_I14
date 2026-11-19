const express = require('express');
const Eureka = require('eureka-js-client').Eureka;

const app = express();

// 1. Lire le port depuis la variable d'environnement PORT (par défaut 8083)
const PORT = process.env.PORT || 8083;

// 2. Configuration du client Eureka
const eurekaClient = new Eureka({
    instance: {
        instanceId: `meeting:${PORT}`,
        app: 'MEETING',                    // Nom du service affiché dans Eureka
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${PORT}/api/meetings/hello`,
        port: {
            '$': PORT,
            '@enabled': true,
        },
        vipAddress: 'MEETING',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 8761,                        // Port de votre tp_Eureka
        servicePath: '/eureka/apps/',
    },
});

// 3. Endpoint demandé par le TP
app.get('/api/meetings/hello', (req, res) => {
    res.json({ message: 'Hello from Meeting service!', port: PORT });
});

// 4. Démarrage du serveur et connexion à Eureka
app.listen(PORT, () => {
    console.log(`Serveur Meeting démarré sur http://localhost:${PORT}`);

    eurekaClient.start((error) => {
        if (error) {
            console.error("Erreur d'enregistrement Eureka :", error);
        } else {
            console.log("Service MEETING enregistré avec succès dans Eureka !");
        }
    });
});

// 5. Arrêt propre lors de la fermeture (CTRL+C)
process.on('SIGINT', () => {
    eurekaClient.stop(() => {
        console.log("Service MEETING retiré d'Eureka.");
        process.exit();
    });
});
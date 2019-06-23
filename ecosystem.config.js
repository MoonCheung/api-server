module.exports = {
    apps: [
        {
            name: 'node-server',
            script: './index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
    deploy: {
        production: {
            user: 'root',
            host: '193.112.52.155',
            ref: 'origin/master',
            repo: 'git@github.com:MoonCheung/node-server.git',
            path: '/www/node-server/',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
        },
    },
};

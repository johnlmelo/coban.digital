sudo bash -c "cat > /etc/nginx/sites-available/apibancos.cj2tech.com.br <<EOF

server {
    listen 80;
    server_name apibancos.cj2tech.com.br;

    location / {
        root /var/www/html/cj2;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

EOF"

# Habilitar site no Nginx
sudo ln -s /etc/nginx/sites-available/apibancos.cj2tech.com.br /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# Configurar SSL com Certbot
sudo certbot --nginx -d apibancos.cj2tech.com.br

echo "Configuração concluída com sucesso!"
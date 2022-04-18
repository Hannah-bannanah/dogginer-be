# Dogginer - BE

Backend de la aplicación de dogginer

## Instrucciones de ejecución

<ol>
<li>Clonar este repositorio</li>
<li>Copiar el archivo db.plantilla.config.js:
<ol>
<li>Reemplazar '&lt;user&gt;' y '&lt;password&gt;' por los credenciales de acceso a la bbdd</li>
<li>Renombrar archivo a 'db.config.js'</li>
</ol>
</li>
<li>Copiar el archivo auth.plantilla.config.js:
<ol>
<li>Reemplazar el valor de la constante <code>JWT_PASSPHRASE</code> por la frase correcta</li>
<li>Renombrar archivo a 'auth.config.js'</li>
</ol>
</li>
<li>Copiar el archivo email.plantilla.config.js:
<ol>
<li>Reemplazar el valor de la constante <code>SENDGRIDAPIKEY</code> por tu clave API</li>
<li>Renombrar archivo a 'email.config.js'</li>
</ol>
</li>
<li>En la terminal, ejecutar <code>npm install</code></li>
<li>En la terminal, ejecutar <code>npm run dev</code></li>
</ol>
